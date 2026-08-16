import os
import numpy as np
from PIL import Image
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from collections import Counter

CLASS_NAMES = [
    "background",   # 0 
    "hair",         # 1
    "skin",         # 2
    "clothes",      # 3
    "water",        # 4
    "ground",       # 5
    "plants",       # 6
]

NUM_CLASSES = 7

ADE20K_TO_OURS = {
    2:  0,   # sky → background
    4:  5,   # floor → ground
    9:  6,   # tree → plants
    10: 5,   # grass → ground
    14: 4,   # water
    17: 0,   # table → background
    21: 0,   # chair → background
    26: 0,   # car → background
    30: 6,   # bush → plants
    64: 4,   # sea → water
    67: 0,   # food → background
    96: 0,   # bus → background
}

HUMAN_TO_OURS = {
    0:  0,   # background
    2:  1,   # hair
    4:  3,   # upper clothes
    6:  3,   # pants → clothes
    7:  3,   # dress → clothes
    11: 2,   # face → skin
    13: 2,   # left leg → skin
    14: 2,   # right leg → skin
    15: 2,   # left arm → skin
    16: 2,   # right arm → skin
}

PATCH_SIZE = 32
STRIDE = 16


# Dataset class — PyTorch needs this to load data in batches

class PatchDataset(Dataset):

    def __init__(self, samples, transform=None):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        patch, label = self.samples[idx]

        patch = Image.fromarray(patch)

        if self.transform:
            patch = self.transform(patch)

        return patch, label


# Patch extraction — slides window across one image+mask pair

def extract_patches_from_image(image_path, mask_path, label_map):

    image = np.array(Image.open(image_path).convert("RGB"))
    mask = np.array(Image.open(mask_path))

    H, W, _ = image.shape
    samples = []

    for y in range(0, H - PATCH_SIZE, STRIDE):
        for x in range(0, W - PATCH_SIZE, STRIDE):

            # crop patch from image
            patch = image[y:y+PATCH_SIZE, x:x+PATCH_SIZE]

            # crop same region from mask
            mask_patch = mask[y:y+PATCH_SIZE, x:x+PATCH_SIZE]

            # check center pixel label
            center_y = PATCH_SIZE // 2
            center_x = PATCH_SIZE // 2
            raw_label = int(mask_patch[center_y, center_x])

            # translate to our class system
            our_label = label_map.get(raw_label, None)

            # skip if this label isn't in our mapping
            if our_label is None:
                continue

            samples.append((patch, our_label))

    return samples


# ADE20K loader — reads from disk

def load_ade20k(root, max_images=500):

    samples = []

    img_dir = os.path.join(root, "ADEChallengeData2016", "images", "training")
    mask_dir = os.path.join(root, "ADEChallengeData2016", "annotations", "training")

    files = os.listdir(img_dir)
    files = files[:max_images] #sliced dataset

    print(f"ADE20K: found {len(files)} images")

    for fname in files:

        if not fname.endswith(".jpg"):
            continue

        img_path = os.path.join(img_dir, fname)

        # mask has same name but .png
        mask_path = os.path.join(mask_dir, fname.replace(".jpg", ".png"))

        if not os.path.exists(mask_path):
            continue

        patches = extract_patches_from_image(
            img_path,
            mask_path,
            ADE20K_TO_OURS
        )

        samples.extend(patches)

    print(f"ADE20K: extracted {len(samples)} patches")
    return samples


# Human parsing loader — reads from HuggingFace

def load_human_parsing(max_images=500):

    samples = []

    from datasets import load_dataset

    print("Loading human parsing dataset from HuggingFace...")
    ds = load_dataset("mattmdjaga/human_parsing_dataset", split="train")

    print(f"Human parsing: found {max_images} images")

    for item in ds.select(range(max_images)):

        image = np.array(item["image"].convert("RGB"))
        mask = np.array(item["mask"])

        H, W, _ = image.shape

        for y in range(0, H - PATCH_SIZE, STRIDE):
            for x in range(0, W - PATCH_SIZE, STRIDE):

                patch = image[y:y+PATCH_SIZE, x:x+PATCH_SIZE]
                mask_patch = mask[y:y+PATCH_SIZE, x:x+PATCH_SIZE]

                center_y = PATCH_SIZE // 2
                center_x = PATCH_SIZE // 2
                raw_label = int(mask_patch[center_y, center_x])

                our_label = HUMAN_TO_OURS.get(raw_label, None)

                if our_label is None:
                    continue

                samples.append((patch, our_label))

    print(f"Human parsing: extracted {len(samples)} patches")
    return samples


# Main build function — combines both datasets

def build_dataset(ade20k_root, transform=None, max_images_per_source=500, max_per_class=5000):

    print("Building dataset...")

    ade_samples = load_ade20k(ade20k_root, max_images=max_images_per_source)
    human_samples = load_human_parsing(max_images=max_images_per_source)

    all_samples = ade_samples + human_samples

    # cap each class so no single class dominates
    from collections import defaultdict
    import random

    bucketed = defaultdict(list)
    for patch, label in all_samples:
        bucketed[label].append((patch, label))

    balanced = []
    for label, items in bucketed.items():
        random.shuffle(items)
        balanced.extend(items[:max_per_class])

    random.shuffle(balanced)

    print(f"Total patches after balancing: {len(balanced)}")

    counts = Counter(label for _, label in balanced)
    for i, name in enumerate(CLASS_NAMES):
        print(f"  {name}: {counts.get(i, 0)}")

    dataset = PatchDataset(balanced, transform=transform)
    return dataset

# Transform — normalizes patches for CNN input

def get_transform():
    return transforms.Compose([
        transforms.Resize((32, 32)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])