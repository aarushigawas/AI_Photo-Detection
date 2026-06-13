import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)


def evaluate_model(model, test_gen):

    print("\nRunning Evaluation...\n")

    test_gen.reset()

    predictions = model.predict(
        test_gen,
        verbose=1
    )

    y_pred = (predictions > 0.5).astype(int).flatten()

    y_true = test_gen.classes

    accuracy = accuracy_score(
        y_true,
        y_pred
    )

    precision = precision_score(
        y_true,
        y_pred
    )

    recall = recall_score(
        y_true,
        y_pred
    )

    f1 = f1_score(
        y_true,
        y_pred
    )

    print("\n========== RESULTS ==========")

    print(f"Accuracy  : {accuracy:.4f}")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1 Score  : {f1:.4f}")

    print("\nClassification Report:\n")

    print(
        classification_report(
            y_true,
            y_pred,
            target_names=["FAKE", "REAL"]
        )
    )

    cm = confusion_matrix(
        y_true,
        y_pred
    )

    plt.figure(figsize=(8, 6))

    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["FAKE", "REAL"],
        yticklabels=["FAKE", "REAL"]
    )

    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")

    os.makedirs(
        "../outputs",
        exist_ok=True
    )

    plt.savefig(
        "../outputs/confusion_matrix.png"
    )

    plt.close()

    with open(
        "../outputs/metrics.txt",
        "w"
    ) as f:

        f.write(
            f"Accuracy  : {accuracy:.4f}\n"
        )

        f.write(
            f"Precision : {precision:.4f}\n"
        )

        f.write(
            f"Recall    : {recall:.4f}\n"
        )

        f.write(
            f"F1 Score  : {f1:.4f}\n"
        )

    print(
        "\nConfusion matrix saved."
    )

    print(
        "Metrics saved."
    )

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1
    }