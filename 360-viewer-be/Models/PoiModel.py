from pydantic import BaseModel

class POI(BaseModel):
    id: int
    name: str
    ath: float
    atv: float
    type: str
    description: str
    pdf:str
    video:str
