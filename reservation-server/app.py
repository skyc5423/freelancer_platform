from typing import List
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
import logging
from functools import wraps
import inspect
from itertools import zip_longest
from custom_dataclasses.schedule import Schedule
import time
from notion_helper import notion_helper as notion


app = FastAPI()
origins = [
    "http://3.36.123.32:3000",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Can also use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_function_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        func_name = func.__name__
        # Get the parameter names
        sig = inspect.signature(func)
        param_names = list(sig.parameters.keys())

        # Create a dictionary of parameter names and their values
        params = dict(zip(param_names, args))
        params.update(kwargs)

        # Log the function call with its parameters

        # Measure execution time
        start_time = time.time()

        # Call the function
        result = func(*args, **kwargs)

        # Calculate execution time
        end_time = time.time()
        execution_time = end_time - start_time

        # Log the execution time
        logger.info(f"  In the func {func_name}\n" +
                    ", ".join(f"{k}={v}" for k, v in params.items() if k != 'request\n') +
                    f"{func_name} took {execution_time:.4f} seconds to execute.")

        return result
    return wrapper


@log_function_call
def get_credentials():
    SCOPES = [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
    ]
    credentials_path = 'credentials/credentials.json'
    return service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES)


@log_function_call
def get_file_id(service, year):
    results = service.files().list(
        q=f"name='{year}' and mimeType='application/vnd.google-apps.spreadsheet'",
        fields="files(id, name)"
    ).execute()
    files = results.get('files', [])
    return files[0]['id'] if files else None


@log_function_call
def get_sheet_data(sheet, file_id, month):
    result = sheet.values().get(spreadsheetId=file_id,
                                range=f'{month}월').execute()
    return result.get('values', [])


@log_function_call
def parse_sheet_data(values, date):
    key_list = ['date', 'class_type', 'start_time', 'end_time',
                'location_name', 'max_user_num', 'user_id_list']
    schedule_list = []
    for value in values[1:]:
        schedule_dict = {}
        if value[0] != date:
            continue
        for i, (key, schedule_value) in enumerate(zip_longest(values[0], value, fillvalue=[])):
            schedule_dict[key_list[i]] = schedule_value
        schedule_list.append(Schedule(**schedule_dict))
    return schedule_list


@app.get("/api/{date}")
async def get_entities_by_date(date: str) -> List[Schedule]:
    schedule = notion.get_schedule_by_date(date)
    return schedule

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
