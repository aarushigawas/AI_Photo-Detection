from tensorflow.keras.models import load_model

MODEL = None


def load_trained_model():

    global MODEL

    MODEL = load_model(
        "../outputs/best_model.keras"
    )

    return MODEL


def get_model():

    if MODEL is None:
        raise Exception(
            "Model has not been loaded yet."
        )

    return MODEL