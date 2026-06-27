import time

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from app.image_processor import (
    load_image,
    resize_image,
    image_to_array
)

from app.color_detector import (
    build_color_grid
)

from app.emoji_mapper import (
    build_emoji_grid
)

from app.themes import THEMES

router = APIRouter()


@router.post("/generate")
async def generate(

    image: UploadFile = File(...),

    theme: str = Form(...),

    resolution: int = Form(...),

    chaos: float = Form(...)

):

    start = time.time()

    # -----------------------------
    # Validate uploaded file
    # -----------------------------

    if not image.content_type.startswith("image/"):

        raise HTTPException(

            status_code=400,

            detail="Only image files are allowed."

        )

    # -----------------------------
    # Validate theme
    # -----------------------------

    theme = theme.lower()

    if theme not in THEMES:

        raise HTTPException(

            status_code=400,

            detail=f"Theme '{theme}' not found."

        )

    # -----------------------------
    # Validate resolution
    # -----------------------------

    if resolution < 20 or resolution > 100:

        raise HTTPException(

            status_code=400,

            detail="Resolution must be between 20 and 100."

        )

    # -----------------------------
    # Validate chaos
    # -----------------------------

    if chaos < 0 or chaos > 1:

        raise HTTPException(

            status_code=400,

            detail="Chaos must be between 0 and 1."

        )

    # -----------------------------
    # Process Image
    # -----------------------------

    image_obj = load_image(image.file)

    resized = resize_image(
        image_obj,
        resolution
    )

    pixels = image_to_array(resized)

    color_grid = build_color_grid(
        pixels
    )

    emoji_grid = build_emoji_grid(
        color_grid,
        theme,
        chaos
    )

    end = time.time()

    print(
        f"Processing Time: {end-start:.4f} seconds"
    )

    return {

        "success": True,

        "theme": theme,

        "resolution": resolution,

        "chaos": chaos,

        "rows": len(emoji_grid),

        "cols": len(emoji_grid[0]),

        "grid": emoji_grid

    }