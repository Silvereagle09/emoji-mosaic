# test_dataset.py
import torch
from ml.model import PatchCNN
from ml.dataset import build_dataset, get_transform
from ml.predict import predict_image
from PIL import Image
import numpy as np

dataset = build_dataset("data/raw/ade20k", transform=get_transform())
patch, label = dataset[0]
print(patch.shape)
print(label)
model = PatchCNN(num_classes=7)
dummy = torch.randn(8, 3, 32, 32)   # fake batch of 8 patches
output = model(dummy)
print(output.shape)        
img = Image.open("me.jpg")
labels, confidences = predict_image(img)

print(f"Grid size: {len(labels)} rows x {len(labels[0])} cols")
print(f"Sample labels: {labels[0][:5]}")
print(f"Sample confidences: {[round(c,2) for c in confidences[0][:5]]}")

flat_confs = [c for row in confidences for c in row]
print(f"Mean confidence:   {np.mean(flat_confs):.2f}")
print(f"Median confidence: {np.median(flat_confs):.2f}")
print(f"Above 0.5:  {sum(c > 0.5 for c in flat_confs)} / {len(flat_confs)} patches")
print(f"Above 0.7:  {sum(c > 0.7 for c in flat_confs)} / {len(flat_confs)} patches")

# label distribution
from collections import Counter
flat_labels = [l for row in labels for l in row]
counts = Counter(flat_labels)
for label, count in counts.most_common():
    print(f"  {label}: {count}")
