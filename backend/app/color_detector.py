import colorsys


def get_color_group(pixel):
    """
    Classify one RGB pixel into a color group.

    Input:
        pixel -> [R, G, B]

    Output:
        red
        pink
        orange
        yellow
        green
        blue
        light
        dark
        neutral
    """

    # RGB values (0-255)
    r, g, b = pixel

    # Convert to 0-1
    r /= 255.0
    g /= 255.0
    b /= 255.0

    # RGB -> HSV
    h, s, v = colorsys.rgb_to_hsv(r, g, b)

    # Hue in degrees
    h *= 360

    # ------------------------
    # Brightness
    # ------------------------

    # Black
    if v < 0.12:
        return "dark"

    # White
    if v > 0.92 and s < 0.12:
        return "light"

    # Gray / Beige / Skin
    if s < 0.18:
        return "neutral"

    # ------------------------
    # Hue Classification
    # ------------------------

    # RED
    if h >= 345 or h < 15:
        return "red"

    # Brown
    if 15 <= h < 40 and v < 0.65:
        return "brown"

    # ORANGE
    if 15 <= h < 40:
        return "orange"

    # YELLOW
    if 40 <= h < 70:
        return "yellow"

    # GREEN
    if 70 <= h < 170:
        return "green"

    # CYAN + BLUE
    if 170 <= h < 270:
        return "blue"

    # PURPLE
    if 270 <= h < 300:
        return "pink"

    # PINK / MAGENTA
    if 300 <= h < 345:
        return "pink"

    return "neutral"


def build_color_grid(pixels):
    """
    Converts entire image into a grid of color names.
    """

    color_grid = []

    for row in pixels:

        color_row = []

        for pixel in row:

            color_row.append(get_color_group(pixel))

        color_grid.append(color_row)

    return color_grid