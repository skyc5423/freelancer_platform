from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    user_database_id: str
    name: str
    phone_number: str
    instagram_id: Optional[str] = None
    email: Optional[str] = None
