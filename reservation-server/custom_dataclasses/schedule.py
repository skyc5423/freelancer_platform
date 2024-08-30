from dataclasses import dataclass
from typing import List
from .user import User
from .location import Location
from pydantic import BaseModel
from typing import Optional


class Schedule(BaseModel):
    date: str
    class_type: str
    start_time: str
    end_time: str
    user_id_list: List
    location_name: str
    max_user_num: int
