import torch
import torch.nn as nn


class PatchCNN(nn.Module):

    def __init__(self, num_classes=7):
        super(PatchCNN, self).__init__()

        # ── Feature Extractor ──
        self.features = nn.Sequential(

            # Block 1 — detects edges and basic textures
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),          # 32x32 → 16x16

            # Block 2 — detects patterns from edges
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),          # 16x16 → 8x8

            # Block 3 — detects complex textures
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),          # 8x8 → 4x4
        )

        # ── Classifier ──
        self.classifier = nn.Sequential(
            nn.Flatten(),                # (128, 4, 4) → 2048
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)  # 256 → 7
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x