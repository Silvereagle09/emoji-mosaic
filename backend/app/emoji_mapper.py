import random

from app.themes import THEMES


def choose_emoji(cell, theme_name, chaos):

    theme = THEMES.get(
        theme_name.lower(),
        THEMES["pastel"]
    )

    # cell is either ("segment", "hair") or ("color", "blue")
    cell_type, label = cell

    if cell_type == "segment":
        # use segment label — hair, skin, clothes etc.
        emojis = theme.get(label, theme.get("background", ["⬜"]))
    else:
        # color fallback — original behavior
        emojis = theme.get(label, theme["neutral"])

    # Clamp chaos
    chaos = max(0.0, min(1.0, chaos))

    # Completely consistent
    if chaos == 0:
        return emojis[0]

    # Mostly consistent
    if random.random() > chaos:
        return emojis[0]

    # Random variation
    return random.choice(emojis)


def build_emoji_grid(
    segment_grid,
    theme_name,
    chaos
):

    emoji_grid = []

    for row in segment_grid:

        emoji_row = []

        for cell in row:

            emoji = choose_emoji(
                cell,
                theme_name,
                chaos
            )

            emoji_row.append(emoji)

        emoji_grid.append(emoji_row)

    return emoji_grid