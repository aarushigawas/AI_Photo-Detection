from fastapi import FastAPI

from model_loader import load_trained_model
from routes.predict import router as predict_router
from routes.health import router as health_router

app = FastAPI()


@app.on_event("startup")
def startup():

    load_trained_model()


app.include_router(
    health_router
)

app.include_router(
    predict_router
)