from tensorflow.keras.models import load_model

from dataset_loader import get_data_generators
from evaluator import evaluate_model

train_gen, val_gen, test_gen = get_data_generators()

model = load_model(
    "../outputs/best_model.keras"
)

results = evaluate_model(
    model,
    test_gen
)

print(results)