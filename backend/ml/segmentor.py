import numpy as np
from PIL import Image
from ml.predict import predict_image, CONFIDENCE_THRESHOLD
from app.color_detector import get_color_group

CNN_MIN_SIZE = 480  


def segment_image(image, pixels):
    """
    Returns a fine-grained segment_grid at the SAME resolution as `pixels`.
    """

    H, W, _ = pixels.shape

    # ── 1. Run CNN on a separately upscaled copy for finer patch coverage ──
    cnn_image = image
    if image.width < CNN_MIN_SIZE or image.height < CNN_MIN_SIZE:
        scale = CNN_MIN_SIZE / min(image.width, image.height)
        new_w = int(image.width * scale)
        new_h = int(image.height * scale)
        cnn_image = image.resize((new_w, new_h), Image.LANCZOS)

    label_grid, confidence_grid = predict_image(cnn_image)

    use_cnn = bool(label_grid and label_grid[0])

    if use_cnn:
        coarse_H = len(label_grid)
        coarse_W = len(label_grid[0])

        # scale factors to map fine pixel -> coarse CNN patch
        scale_y = coarse_H / H
        scale_x = coarse_W / W

    segment_grid = []

    for y in range(H):
        row = []
        for x in range(W):

            pixel = pixels[y, x]
            color = get_color_group(pixel)

            if use_cnn:
                coarse_y = min(int(y * scale_y), coarse_H - 1)
                coarse_x = min(int(x * scale_x), coarse_W - 1)

                label = label_grid[coarse_y][coarse_x]
                confidence = confidence_grid[coarse_y][coarse_x]

                if confidence >= CONFIDENCE_THRESHOLD and label != "background":
                    row.append(("segment", label, pixel))
                else:
                    row.append(("color", color, pixel))
            else:
                row.append(("color", color, pixel))

        segment_grid.append(row)

    return segment_grid