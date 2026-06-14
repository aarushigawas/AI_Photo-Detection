from dataset_loader import get_data_generators
from model_builder import build_model
from trainer import train_model


def main():

    print("Loading Dataset...")

    train_gen, val_gen, test_gen = get_data_generators()

    print("Building Model...")

    model = build_model()

    print("Starting Training...")

    history = train_model(
        model,
        train_gen,
        val_gen
    )

    print("Training Finished Successfully")

    return history


if __name__ == "__main__":
    main()