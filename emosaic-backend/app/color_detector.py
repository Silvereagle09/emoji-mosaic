import numpy as np


COLOR_CENTROIDS_LAB = {
    "dark":    [10,   0,    0  ],
    "light":   [95,   0,    0  ],
    "red":     [40,   55,   35 ],
    "pink":    [65,   35,  -5  ],
    "orange":  [60,   25,   45 ],
    "brown":   [35,   15,   20 ],
    "yellow":  [85,  -5,    60 ],
    "green":   [50,  -40,   25 ],
    "blue":    [45,   5,   -40 ],
    "neutral": [70,   2,    4  ],
}


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
        return t ** (1/3) if t > 0.008856 else (7.787 * t + 16/116)

    fx, fy, fz = f(X), f(Y), f(Z)

    L = 116 * fy - 16
    a = 500 * (fx - fy)
    b_val = 200 * (fy - fz)

    return L, a, b_val


def get_color_group(pixel):
    r, g, b = [x / 255.0 for x in pixel[:3]]
    L, a, b_val = rgb_to_lab(r, g, b)

    if L < 18:
        return "dark"
    if L > 92 and abs(a) < 5 and abs(b_val) < 5:
        return "light"

    lab = [L, a, b_val]
    best_color = min(
        COLOR_CENTROIDS_LAB,
        key=lambda c: (
            (lab[0] - COLOR_CENTROIDS_LAB[c][0]) ** 2 * 0.3 +   # weight L less
            (lab[1] - COLOR_CENTROIDS_LAB[c][1]) ** 2 * 1.5 +   # weight a more
            (lab[2] - COLOR_CENTROIDS_LAB[c][2]) ** 2 * 1.5     # weight b more
        )
    )

    return best_color


def build_color_grid(pixels):
    color_grid = []
    for row in pixels:
        color_row = []
        for pixel in row:
            color_row.append(get_color_group(pixel))
        color_grid.append(color_row)
    return color_grid