import random

from app.themes import THEMES


def choose_emoji(color, theme_name, chaos):

    theme = THEMES.get(
        theme_name.lower(),
        THEMES["pastel"]
    )

    emojis = theme.get(
        color,
        theme["neutral"]
    )

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
    color_grid,
    theme_name,
    chaos
):

    emoji_grid = []

    for row in color_grid:

        emoji_row = []

        for color in row:

            emoji = choose_emoji(
                color,
                theme_name,
                chaos
            )

            emoji_row.append(emoji)

        emoji_grid.append(emoji_row)

    return emoji_grid