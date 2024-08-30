from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    name: str
    phone_number: str
    email: Optional[str] = None
