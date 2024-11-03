from typing import List
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from custom_dataclasses.schedule import Schedule
from notion_helper import notion_helper as notion


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Can also use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/api/{date}")
async def get_entities_by_date(date: str) -> List[Schedule]:
    schedule = notion.get_schedule_by_date(date)
    return schedule


@app.post("/api/reservation")
async def make_reservation(reservation_data: dict):
    try:
        notion.update_database(reservation_data)
        return {"message": "예약이 성공적으로 완료되었습니다."}
    except Exception as e:
        return {"error": f"예약 처리 중 오류가 발생했습니다: {str(e)}"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
