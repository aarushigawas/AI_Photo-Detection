from dataset_loader import get_data_generators
from model_builder import build_model
from trainer import train_model

train_gen, val_gen, test_gen = get_data_generators()

model = build_model()

history = train_model(
    model,
    train_gen,
    val_gen
)

print("\nTraining Finished Successfully")