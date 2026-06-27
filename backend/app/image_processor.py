import numpy as np
from PIL import Image


def load_image(file):
    image = Image.open(file)

    # Convert everything to RGB
    image = image.convert("RGB")

    return image


def resize_image(image, resolution):
    """
    Resize while preserving aspect ratio.

    Resolution should be between 20 and 100.
    """

    width, height = image.size

    # Clamp resolution
    resolution = max(20, min(100, resolution))

    aspect_ratio = width / height

    if width >= height:
        new_width = resolution
        new_height = int(resolution / aspect_ratio)
    else:
        new_height = resolution
        new_width = int(resolution * aspect_ratio)

    resized = image.resize(
        (new_width, new_height),
        Image.LANCZOS
    )

    return resized


def image_to_array(image):

    return np.array(image)