from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

from model_loader import get_model
from image_preprocessor import preprocess_image


router = APIRouter()


@router.post("/predict")
async def predict_image(
    image: UploadFile = File(...)
):

    model = get_model()

    processed_image = preprocess_image(
        image.file
    )

    prediction = model.predict(
        processed_image
    )

    confidence = float(
        prediction[0][0]
    )

    if confidence >= 0.5:

        verdict = "REAL"

    else:

        verdict = "FAKE"

        confidence = 1 - confidence

    return {
        "prediction": verdict,
        "confidence": round(
            confidence * 100,
            2
        )
    }