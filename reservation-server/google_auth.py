import uvicorn
from fastapi import FastAPI
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
import io
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from httplib2 import Http
from googleapiclient.http import MediaIoBaseDownload
import pandas as pd
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.

SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets"
]

credentials_path = 'reservation-server/credentials/credentials.json'
if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)

if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            credentials_path, SCOPES
        )
        creds = flow.run_local_server(port=0)
# Save the credentials for the next run
    with open("token.json", "w") as token:
        token.write(creds.to_json())


# SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets"
]
# 인증 정보 생성
credentials = service_account.Credentials.from_service_account_file(
    credentials_path, scopes=SCOPES)

# Drive API 클라이언트 생성
drive_service = build('drive', 'v3', credentials=credentials)

# Build the Drive API client
try:
    service = build("drive", "v3", credentials=creds)
    results_ = (
        drive_service.files()
        .list(pageSize=10, fields="nextPageToken, files(id, name)")
        .execute()
    )
    # Call the Drive v3 API
    # results = service.files().list(
    #     q=f"name='{file_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
    #     fields="files(id, name)"
    # ).execute()

    # files = results.get('files', [])

    if not files:
        print(f'No file named "{file_name}" found.')

    file_id = files[0]['id']

    # Build the Sheets API service
    sheets_service = build('sheets', 'v4', credentials=creds)

    # Request to get the spreadsheet data
    sheet = sheets_service.spreadsheets()
    result = sheet.values().get(spreadsheetId=file_id, range='Sheet1').execute()
    values = result.get('values', [])
except HttpError as error:
    # TODO(developer) - Handle errors from drive API.
    print(f"An error occurred: {error}")
