from typing import List
from pydantic import BaseModel


class Schedule(BaseModel):
    date: str
    class_type: str
    class_song: str
    start_time: str
    end_time: str
    user_id_list: List
    location_name: str
    max_user_num: int
    database_id: str
