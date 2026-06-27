from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="Emoji Mosaic API",
    version="1.0"
)

app.include_router(router)