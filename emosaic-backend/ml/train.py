import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split

from ml.dataset import build_dataset, get_transform
from ml.model import PatchCNN


# ── Config ──────────────────────────────────────────
BATCH_SIZE = 64
EPOCHS = 15
LEARNING_RATE = 0.001
VAL_SPLIT = 0.2
CHECKPOINT_PATH = "checkpoints/model.pth"
ADE20K_ROOT = "data/raw/ade20k"
# ────────────────────────────────────────────────────


def train():

    # device — use GPU if available, otherwise CPU
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on: {device}")

    # ── Data ──
    print("\nLoading dataset...")
    dataset = build_dataset(ADE20K_ROOT, transform=get_transform())

    val_size = int(len(dataset) * VAL_SPLIT)
    train_size = len(dataset) - val_size

    train_set, val_set = random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(
        train_set,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0          # keep 0 on Windows to avoid multiprocessing issues
    )

    val_loader = DataLoader(
        val_set,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0
    )

    print(f"Train samples: {train_size}")
    print(f"Val samples:   {val_size}")

    # ── Model ──
    model = PatchCNN(num_classes=7).to(device)

    # ── Loss ──
    # CrossEntropyLoss = softmax + negative log likelihood
    # standard for multi-class classification
    criterion = nn.CrossEntropyLoss()

    # ── Optimizer ──
    # Adam — adaptive learning rate, works well out of the box
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # ── LR Scheduler ──
    # reduces learning rate by 0.5 if val loss doesn't improve for 3 epochs
    # prevents overshooting the optimal weights late in training
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer,
        patience=3,
        factor=0.5
    )

    # ── Training Loop ──
    best_val_acc = 0.0

    for epoch in range(EPOCHS):

        # ── Train phase ──
        model.train()
        train_loss = 0.0
        train_correct = 0

        for batch_idx, (patches, labels) in enumerate(train_loader):

            patches = patches.to(device)
            labels = labels.to(device)

            # forward pass
            outputs = model(patches)
            loss = criterion(outputs, labels)

            # backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

            # count correct predictions
            predicted = outputs.argmax(dim=1)
            train_correct += (predicted == labels).sum().item()

            # print progress every 50 batches
            if (batch_idx + 1) % 50 == 0:
                print(f"  Epoch {epoch+1} | Batch {batch_idx+1}/{len(train_loader)} | Loss: {loss.item():.4f}")

        train_acc = train_correct / train_size

        # ── Validation phase ──
        model.eval()
        val_loss = 0.0
        val_correct = 0

        with torch.no_grad():       # no gradients needed for validation
            for patches, labels in val_loader:
                patches = patches.to(device)
                labels = labels.to(device)

                outputs = model(patches)
                loss = criterion(outputs, labels)

                val_loss += loss.item()
                predicted = outputs.argmax(dim=1)
                val_correct += (predicted == labels).sum().item()

        val_acc = val_correct / val_size

        print(f"\nEpoch {epoch+1}/{EPOCHS}")
        print(f"  Train Loss: {train_loss/len(train_loader):.4f} | Train Acc: {train_acc:.4f}")
        print(f"  Val Loss:   {val_loss/len(val_loader):.4f} | Val Acc:   {val_acc:.4f}")

        # step scheduler with val loss
        scheduler.step(val_loss / len(val_loader))

        # save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), CHECKPOINT_PATH)
            print(f"  ✓ saved best model (val_acc: {val_acc:.4f})")

    print(f"\nTraining complete. Best val accuracy: {best_val_acc:.4f}")
    print(f"Model saved to {CHECKPOINT_PATH}")


if __name__ == "__main__":
    train()