import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from googleapiclient.discovery import build
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import service_account
import logging
from functools import wraps
import inspect
from itertools import zip_longest
import json
from custom_dataclasses.schedule import Schedule
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://3.36.123.32:3000"],  # Add your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_function_call(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        func_name = func.__name__
        # Get the parameter names
        sig = inspect.signature(func)
        param_names = list(sig.parameters.keys())

        # Create a dictionary of parameter names and their values
        params = dict(zip(param_names, args))
        params.update(kwargs)

        # Log the function call with its parameters
        logger.info(f"  In the func {func_name}: " +
                    ", ".join(f"{k}={v}" for k, v in params.items() if k != 'request'))

        return await func(*args, **kwargs)
    return wrapper


@app.get("/api/{date}")
@log_function_call
async def get_entities_by_month(date: str, response_model=List[Schedule]):
    year = date[:4]
    month = int(date[4:6])

    key_list = ['date', 'class_type', 'start_time', 'end_time', 'location_name', 'max_user_num',
                'user_id_list']

    SCOPES = [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
    ]

    credentials_path = 'credentials/credentials.json'

    credentials = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES)

    # Build the Drive API client
    try:
        service = build('drive', 'v3', credentials=credentials)
        # Call the Drive v3 API
        results = service.files().list(
            q=f"name='{year}' and mimeType='application/vnd.google-apps.spreadsheet'",
            fields="files(id, name)"
        ).execute()

        files = results.get('files', [])

        if not files:
            print(f'No file named "{year}" found.')
            return None

        file_id = files[0]['id']

        # Build the Sheets API service
        sheets_service = build('sheets', 'v4', credentials=credentials)

        # Request to get the spreadsheet data
        sheet = sheets_service.spreadsheets()
        result = sheet.values().get(spreadsheetId=file_id,
                                    range=f'{month}월').execute()
        values = result.get('values', [])
        schedule_list = []
        for value in values[1:]:
            schedule_dict = {}
            for i, (key, schedule_value) in enumerate(zip_longest(values[0], value, fillvalue=[])):
                schedule_dict[key_list[i]] = schedule_value
            schedule_list.append(Schedule(**schedule_dict))

        return schedule_list

    except HttpError as error:
        # TODO(developer) - Handle errors from drive API.
        print(f"An error occurred: {error}")
        return []


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
