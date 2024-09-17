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


@app.get("/api/{date}")
async def get_entities_by_date(date: str) -> List[Schedule]:
    schedule = notion.get_schedule_by_date(date)
    return schedule

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
