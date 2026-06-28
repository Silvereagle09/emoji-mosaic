import torch
import numpy as np
from PIL import Image
from torchvision import transforms

from ml.model import PatchCNN
from ml.dataset import CLASS_NAMES, PATCH_SIZE

CHECKPOINT_PATH = "checkpoints/model.pth"
CONFIDENCE_THRESHOLD = 0.5   # below this → fall back to color

# ── load model once at module level ──
# this means it loads when FastAPI starts, not on every request
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = PatchCNN(num_classes=7)
model.load_state_dict(torch.load(CHECKPOINT_PATH, map_location=device))
model.eval()
model.to(device)

print(f"PatchCNN loaded on {device}")


# ── same transform as training ──
transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def predict_image(image):
    """
    Takes a PIL image.
    Returns:
        label_grid      — 2D list of class name strings
        confidence_grid — 2D list of float confidence scores
    """

    image_np = np.array(image.convert("RGB"))
    H, W, _ = image_np.shape

    label_grid = []
    confidence_grid = []

    for y in range(0, H - PATCH_SIZE, PATCH_SIZE):   # stride = PATCH_SIZE (no overlap at inference)
        label_row = []
        conf_row = []

        for x in range(0, W - PATCH_SIZE, PATCH_SIZE):

            # extract patch
            patch = image_np[y:y+PATCH_SIZE, x:x+PATCH_SIZE]
            patch_pil = Image.fromarray(patch)

            # transform → tensor
            tensor = transform(patch_pil).unsqueeze(0).to(device)
            # unsqueeze(0) adds batch dimension: (3,32,32) → (1,3,32,32)

            # inference
            with torch.no_grad():
                output = model(tensor)               # (1, 7) raw logits
                probs = torch.softmax(output, dim=1) # convert to probabilities
                confidence, pred = probs.max(dim=1)  # get top class + its confidence

            label = CLASS_NAMES[pred.item()]
            conf = confidence.item()

            label_row.append(label)
            conf_row.append(conf)

        label_grid.append(label_row)
        confidence_grid.append(conf_row)

    return label_grid, confidence_grid