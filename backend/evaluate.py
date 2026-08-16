import torch
import numpy as np
import matplotlib.pyplot as plt

from torch.utils.data import DataLoader, random_split
from sklearn.metrics import (
    confusion_matrix,
    classification_report
)

from ml.dataset import build_dataset, get_transform, CLASS_NAMES
from ml.model import PatchCNN


CHECKPOINT_PATH = "checkpoints/model.pth"
ADE20K_ROOT = "data/raw/ade20k"

VAL_SPLIT = 0.2
BATCH_SIZE = 64


def evaluate():

    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    print(f"Evaluating on: {device}")

    # ─────────────────────────────
    # 1. Load dataset
    # ─────────────────────────────

    dataset = build_dataset(
        ADE20K_ROOT,
        transform=get_transform()
    )

    val_size = int(len(dataset) * VAL_SPLIT)
    train_size = len(dataset) - val_size

    _, val_set = random_split(
        dataset,
        [train_size, val_size]
    )

    val_loader = DataLoader(
        val_set,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0
    )

    print(f"Validation samples: {len(val_set)}")

    # ─────────────────────────────
    # 2. Load trained model
    # ─────────────────────────────

    model = PatchCNN(num_classes=7).to(device)

    model.load_state_dict(
        torch.load(
            CHECKPOINT_PATH,
            map_location=device
        )
    )

    model.eval()

    # ─────────────────────────────
    # 3. Collect predictions
    # ─────────────────────────────

    all_predictions = []
    all_labels = []

    with torch.no_grad():

        for patches, labels in val_loader:

            patches = patches.to(device)

            outputs = model(patches)

            predictions = outputs.argmax(dim=1)

            all_predictions.extend(
                predictions.cpu().numpy()
            )

            all_labels.extend(
                labels.numpy()
            )

    # Convert to numpy
    all_predictions = np.array(all_predictions)
    all_labels = np.array(all_labels)

    # ─────────────────────────────
    # 4. Accuracy
    # ─────────────────────────────

    accuracy = (
        all_predictions == all_labels
    ).mean()

    print("\n==============================")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("==============================")

    # ─────────────────────────────
    # 5. Confusion Matrix
    # ─────────────────────────────

    cm = confusion_matrix(
        all_labels,
        all_predictions
    )

    print("\nConfusion Matrix:")
    print(cm)

    # ─────────────────────────────
    # 6. Classification Report
    # ─────────────────────────────

    print("\nClassification Report:")

    print(
        classification_report(
            all_labels,
            all_predictions,
            target_names=CLASS_NAMES,
            digits=4
        )
    )

    # ─────────────────────────────
    # 7. Plot confusion matrix
    # ─────────────────────────────

    plt.figure(figsize=(9, 7))

    plt.imshow(cm)

    plt.title("Emosaic PatchCNN - Confusion Matrix")
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")

    plt.xticks(
        range(len(CLASS_NAMES)),
        CLASS_NAMES,
        rotation=45,
        ha="right"
    )

    plt.yticks(
        range(len(CLASS_NAMES)),
        CLASS_NAMES
    )

    # Put numbers inside cells
    for i in range(len(CLASS_NAMES)):
        for j in range(len(CLASS_NAMES)):
            plt.text(
                j,
                i,
                cm[i, j],
                ha="center",
                va="center"
            )

    plt.colorbar()

    plt.tight_layout()

    plt.savefig(
        "confusion_matrix.png",
        dpi=300
    )

    plt.show()


if __name__ == "__main__":
    evaluate()