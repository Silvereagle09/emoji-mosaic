import json
import random
import numpy as np

from app.themes import THEMES

with open("data/emoji_colors.json", "r", encoding="utf-8") as f:
    _raw_colors = json.load(f)

EMOJI_COLOR_LOOKUP = {
    char: data["lab"] for char, data in _raw_colors.items()
}


def rgb_to_lab_batch(pixels):
    """
    Vectorized RGB -> LAB conversion.
    pixels: numpy array (N, 3) in 0-255
    Returns: numpy array (N, 3) LAB
    """
    rgb = pixels.astype(np.float64) / 255.0

    def linearize(c):
        return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

    rgb_lin = linearize(rgb)

    # sRGB -> XYZ matrix
    M = np.array([
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.0721750],
        [0.0193339, 0.1191920, 0.9503041],
    ])

    xyz = rgb_lin @ M.T

    xyz[:, 0] /= 0.95047
    xyz[:, 1] /= 1.00000
    xyz[:, 2] /= 1.08883

    def f(t):
        return np.where(t > 0.008856, np.cbrt(t), 7.787 * t + 16 / 116)

    fxyz = f(xyz)

    L = 116 * fxyz[:, 1] - 16
    a = 500 * (fxyz[:, 0] - fxyz[:, 1])
    b = 200 * (fxyz[:, 1] - fxyz[:, 2])

    return np.stack([L, a, b], axis=1)


def build_candidate_lab_matrix(candidates):
    """
    candidates: list of emoji chars
    Returns: (valid_chars, lab_matrix) where lab_matrix is (M, 3)
    """
    valid_chars = []
    labs = []
    for char in candidates:
        lab = EMOJI_COLOR_LOOKUP.get(char)
        if lab is not None:
            valid_chars.append(char)
            labs.append(lab)

    if not valid_chars:
        # fallback — no color data, just return first candidate with dummy lab
        return [candidates[0]], np.array([[50.0, 0.0, 0.0]])

    return valid_chars, np.array(labs)


# cache candidate LAB matrices per (theme, category) so we don't rebuild every request
_candidate_cache = {}


def get_candidate_matrix(theme_name, label, cell_type):
    key = (theme_name, label, cell_type)
    if key not in _candidate_cache:
        theme = THEMES.get(theme_name, THEMES["pastel"])
        if cell_type == "segment":
            candidates = theme.get(label, theme.get("background", ["⬜"]))
        else:
            candidates = theme.get(label, theme["neutral"])
        _candidate_cache[key] = build_candidate_lab_matrix(candidates)
    return _candidate_cache[key]


def build_emoji_grid(segment_grid, theme_name, chaos):
    """
    Vectorized version: groups cells by (cell_type, label) so we batch-process
    all pixels needing the same candidate pool at once.
    """
    theme_name = theme_name.lower()
    chaos = max(0.0, min(1.0, chaos))

    H = len(segment_grid)
    W = len(segment_grid[0]) if H else 0

    # flatten grid into arrays for batch processing
    flat_cells = [cell for row in segment_grid for cell in row]
    cell_types = [c[0] for c in flat_cells]
    labels = [c[1] for c in flat_cells]
    pixels = np.array([c[2] for c in flat_cells])  # (N, 3)

    N = len(flat_cells)
    result = [None] * N

    # group indices by (cell_type, label) so each group shares a candidate pool
    groups = {}
    for i in range(N):
        key = (cell_types[i], labels[i])
        groups.setdefault(key, []).append(i)

    for (cell_type, label), indices in groups.items():
        valid_chars, lab_matrix = get_candidate_matrix(theme_name, label, cell_type)

        idx_array = np.array(indices)
        group_pixels = pixels[idx_array]  # (G, 3)

        target_labs = rgb_to_lab_batch(group_pixels)  # (G, 3)

        # pairwise squared distance: (G, 1, 3) - (1, M, 3) -> (G, M, 3) -> sum -> (G, M)
        diffs = target_labs[:, None, :] - lab_matrix[None, :, :]
        dists = np.sum(diffs ** 2, axis=2)

        best_idx = np.argmin(dists, axis=1)  # (G,)

        for j, i in enumerate(indices):
            if chaos > 0 and random.random() < chaos:
                result[i] = random.choice(valid_chars)
            else:
                result[i] = valid_chars[best_idx[j]]

    # reshape back into grid
    emoji_grid = []
    for y in range(H):
        emoji_grid.append(result[y * W:(y + 1) * W])

    return emoji_grid