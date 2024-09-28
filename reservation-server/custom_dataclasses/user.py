from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    name: str
    phone_number: str
    instagram_id: Optional[str] = None
    email: Optional[str] = None
