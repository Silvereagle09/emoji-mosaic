# test_dataset.py
import torch
from ml.model import PatchCNN
from ml.dataset import build_dataset, get_transform

dataset = build_dataset("data/raw/ade20k", transform=get_transform())
patch, label = dataset[0]
print(patch.shape)
print(label)
model = PatchCNN(num_classes=7)
dummy = torch.randn(8, 3, 32, 32)   # fake batch of 8 patches
output = model(dummy)
print(output.shape)        