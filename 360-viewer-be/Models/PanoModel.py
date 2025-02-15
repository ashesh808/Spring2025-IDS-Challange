from pydantic import BaseModel

class PanoModel(BaseModel):
    id: int
    url: str
    preview_image: str

