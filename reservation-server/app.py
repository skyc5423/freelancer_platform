from typing import List
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
from itertools import zip_longest
from custom_dataclasses.schedule import Schedule
from notion_helper import notion_helper as notion
from utils import log_function_call


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
