import json
import emoji
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# ── CONFIG ──────────────────────────────────────────
FONT_PATH = r"C:\Windows\Fonts\seguiemj.ttf"   # Windows color emoji font
FONT_SIZE = 96
CANVAS_SIZE = 128
OUTPUT_PATH = "emoji_colors.json"
# A curated subset filter — skip flags, skin-tone variants, complex ZWJ sequences
# (these often render as boxes/tofu or duplicate colors)
SKIP_CATEGORIES = ["flag", "regional indicator"]
# ────────────────────────────────────────────────────


def rgb_to_lab(r, g, b):
    def linearize(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = linearize(r), linearize(g), linearize(b)

    X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    Y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
    Z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

    X /= 0.95047
    Y /= 1.00000
    Z /= 1.08883

    def f(t):
        return t ** (1 / 3) if t > 0.008856 else (7.787 * t + 16 / 116)

    fx, fy, fz = f(X), f(Y), f(Z)

    L = 116 * fy - 16
    a = 500 * (fx - fy)
    b_val = 200 * (fy - fz)

    return L, a, b_val


def render_emoji(char, font):
    """Render one emoji onto a transparent canvas, return PIL Image."""
    img = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    try:
        draw.text(
            (CANVAS_SIZE // 2, CANVAS_SIZE // 2),
            char,
            font=font,
            embedded_color=True,
            anchor="mm",
        )
    except Exception:
        return None

    return img


def average_color(img):
    """
    Average only the non-transparent pixels.
    Returns (r, g, b) in 0-255 or None if emoji didn't render (blank/tofu).
    """
    arr = np.array(img)  # H, W, 4 (RGBA)

    alpha = arr[:, :, 3]
    visible = alpha > 10  # ignore fully transparent pixels

    if visible.sum() < 50:  # too few visible pixels = probably didn't render
        return None

    r = arr[:, :, 0][visible].mean()
    g = arr[:, :, 1][visible].mean()
    b = arr[:, :, 2][visible].mean()

    return r, g, b


def main():
    print("Loading font...")
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)

    all_emojis = list(emoji.EMOJI_DATA.keys())
    print(f"Total candidate emojis: {len(all_emojis)}")

    results = {}
    skipped = 0
    failed = 0

    for i, char in enumerate(all_emojis):

        # skip flags / regional indicators / overly long ZWJ sequences
        meta = emoji.EMOJI_DATA.get(char, {})
        category_str = str(meta).lower()

        if any(skip in category_str for skip in SKIP_CATEGORIES):
            skipped += 1
            continue

        if len(char) > 3:  # skip complex multi-codepoint ZWJ sequences (family emojis etc.)
            skipped += 1
            continue

        img = render_emoji(char, font)
        if img is None:
            failed += 1
            continue

        avg = average_color(img)
        if avg is None:
            failed += 1
            continue

        r, g, b = avg
        L, a, b_val = rgb_to_lab(r / 255.0, g / 255.0, b / 255.0)

        results[char] = {
            "rgb": [round(r, 1), round(g, 1), round(b, 1)],
            "lab": [round(L, 2), round(a, 2), round(b_val, 2)],
        }

        if (i + 1) % 500 == 0:
            print(f"  Processed {i+1}/{len(all_emojis)}...")

    print(f"\nDone. Generated colors for {len(results)} emojis.")
    print(f"Skipped: {skipped} (flags/ZWJ)")
    print(f"Failed to render: {failed}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()