🌸 **Emosaic**

> Transform any photo into a beautiful emoji mosaic using AI-powered semantic segmentation and perceptual color matching.

---

**What is Emosaic?**

Emosaic is a full-stack AI web app that converts uploaded photos into emoji mosaics. It uses a custom-trained **PatchCNN** to semantically understand image regions (hair, skin, clothes, background) and maps each region to carefully curated, theme-appropriate emojis — picking the best match using **perceptual LAB color distance**.

![Before/After](assets/comparison.svg)

---

**Themes**

Emosaic comes with four hand-curated emoji themes:

| Theme | Vibe |
|---|---|
| 🌸 **Pastel** | Soft, cute, dreamy |
| 🌊 **Ocean** | Aquatic, tropical, serene |
| 🎃 **Spooky** | Dark, eerie, Halloween |
| 💿 **Y2K** | Bold, cyber, glittery |

---

**Architecture**

```
                Upload Photo
                     │
                     ▼
              Image Processing
  (resize to internal resolution, LANCZOS)
                     │
                     ▼
┌────────────────────────────────────────┐
│           Segmentation Pipeline        │
│                                        │
│  PatchCNN (runs on 480px upscale)      │
│  ↓ 32×32 patches → 7 semantic classes  │
│                                        │
│  ┌────────────────┬────────────────┐   │
│  │ Confidence≥0.5 │ Confidence<0.5 │   │
│  └───────┬────────┴───────┬────────┘   │
│          ▼                ▼            │
│   Segment Label     LAB Color Group    │
└──────────┬────────────────┬────────────┘
           └────────┬───────┘
                    ▼
               Emoji Mapping
     (NumPy vectorized LAB nearest-color)
                    │
                    ▼
            Emoji Mosaic Grid
                    │
                    ▼
         JSON → Frontend Render
```

---

**PatchCNN**

Custom lightweight CNN trained on **32×32 image patches**, classifying into 7 semantic classes:

```
Input: 3 × 32 × 32

Conv2d(3→32)  + BatchNorm + ReLU + MaxPool   → 16×16
Conv2d(32→64) + BatchNorm + ReLU + MaxPool   → 8×8
Conv2d(64→128)+ BatchNorm + ReLU + MaxPool   → 4×4

Flatten → Linear(2048→256) → ReLU → Dropout(0.3)
Linear(256→7)
```

| ID | Class |
|---|---|
| 0 | Background |
| 1 | Hair |
| 2 | Skin |
| 3 | Clothes |
| 4 | Water |
| 5 | Ground |
| 6 | Plants |

---

**Model Performance**

Trained on a combined dataset of **ADE20K** + **Human Parsing Dataset (HuggingFace)** — 33,859 balanced patches across 7 classes.

| Metric | Result |
|---|---|
| Validation Accuracy | **71.08%** |
| Macro F1 | **71.25%** |
| Weighted F1 | **70.84%** |

| Class | Precision | Recall | F1 |
|---|---|---|---|
| Background | 59.20% | 49.00% | 53.62% |
| Hair | 83.01% | 80.78% | **81.88%** |
| Skin | 68.94% | 77.93% | 73.16% |
| Clothes | 59.07% | 59.86% | 59.46% |
| Water | 85.14% | 88.26% | **86.67%** |
| Ground | 72.42% | 72.91% | 72.67% |
| Plants | 70.61% | 72.04% | 71.31% |

![Confusion Matrix](assets/confusion_matrix.svg)

---

**How Color Matching Works**

For every pixel cell:

1. Convert pixel RGB → **LAB color space** (perceptually uniform — better than RGB/HSV for human color perception)
2. Look up the **rendered LAB color** of each candidate emoji (pre-computed by rendering actual emoji glyphs via Windows Segoe UI Emoji font)
3. Pick the emoji with the **smallest LAB distance** to the pixel — this is what makes skin tones and hair shades render accurately instead of just picking arbitrary emojis

This is done in a **NumPy-vectorized batch operation** — all cells sharing the same category are processed in a single matrix distance calculation, making even 300×300 grids fast.

---

**Controls**

| Control | Range | Effect |
|---|---|---|
| **Resolution** | 0–100 (maps to 40–300px internally) | Higher = more emoji cells = more detail |
| **Chaos** | 0–100 | 0 = pure nearest-color match, higher = more random variation within theme |

---

**Running Locally**

**Backend**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

uvicorn app.main:app --reload
```

API available at `http://localhost:8000`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend at `http://localhost:5174`

---

**Project Structure**

```
emoji-mosaic/
├── backend/
│   ├── app/
│   │   ├── color_detector.py    # LAB color space classification
│   │   ├── emoji_mapper.py      # NumPy vectorized nearest-color matching
│   │   ├── image_processor.py   # Resize + array conversion
│   │   ├── routes.py            # FastAPI /generate endpoint
│   │   ├── themes.py            # Curated emoji lists per theme
│   │   └── main.py              # FastAPI app + CORS
│   ├── ml/
│   │   ├── model.py             # PatchCNN architecture
│   │   ├── predict.py           # Inference pipeline
│   │   ├── segmentor.py         # CNN + color fallback hybrid
│   │   ├── dataset.py           # ADE20K + HuggingFace data pipeline
│   │   └── train.py             # Training loop
│   ├── checkpoints/
│   │   └── model.pth            # Trained model weights
│   ├── data/
│   │   └── emoji_colors.json    # Pre-rendered LAB colors for 2485 emojis
│   └── requirements.txt
└── frontend/
    └── ...                      # React + Vite
```

---

**Tech Stack**

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| ML | PyTorch, Torchvision |
| Image Processing | Pillow, NumPy |
| Color Science | LAB color space (manual sRGB→XYZ→LAB pipeline) |

---

**API**

### `POST /generate`

| Field | Type | Description |
|---|---|---|
| `image` | file | Uploaded image (jpg/png) |
| `theme` | string | `pastel` / `ocean` / `spooky` / `y2k` |
| `resolution` | int | 20–100 (maps to 40–300px internally) |
| `chaos` | float | 0.0–1.0 |

**Response:**
```json
{
  "success": true,
  "theme": "pastel",
  "resolution": 80,
  "chaos": 0.0,
  "rows": 60,
  "cols": 80,
  "grid": [["🌸", "🍑", "..."], ...]
}
```

---
