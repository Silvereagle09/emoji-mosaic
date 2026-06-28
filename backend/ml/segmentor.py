from ml.predict import predict_image, CONFIDENCE_THRESHOLD
from app.color_detector import get_color_group


def segment_image(image, pixels):
    """
    Takes:
        image  — PIL image (resized)
        pixels — numpy array of same image (H x W x 3)

    Returns:
        segment_grid — 2D list, each cell is either:
                       a segment label ("hair", "skin"...)
                       or a color label ("red", "blue"...)
                       depending on CNN confidence
    """

    label_grid, confidence_grid = predict_image(image)
    
    if not label_grid or not label_grid[0]:
        from app.color_detector import build_color_grid
        color_grid = build_color_grid(pixels)
        return [[("color", color) for color in row] for row in color_grid]

    H = len(label_grid)
    W = len(label_grid[0])

    segment_grid = []

    for y in range(H):
        row = []
        for x in range(W):

            label = label_grid[y][x]
            confidence = confidence_grid[y][x]

            if confidence >= CONFIDENCE_THRESHOLD:
                # CNN is confident → use segment label
                row.append(("segment", label))
            else:
                # CNN not confident → fall back to color
                # get the center pixel of this patch
                patch_y = y * 32
                patch_x = x * 32

                # clamp to image bounds
                patch_y = min(patch_y, pixels.shape[0] - 1)
                patch_x = min(patch_x, pixels.shape[1] - 1)

                pixel = pixels[patch_y, patch_x]
                color = get_color_group(pixel)
                row.append(("color", color))

        segment_grid.append(row)

    return segment_grid