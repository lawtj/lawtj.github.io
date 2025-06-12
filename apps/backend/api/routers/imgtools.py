from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse
from PIL import Image
from io import BytesIO
from ..services.image_service import resize_image as resize_image_service, make_transparent as make_transparent_service, save_as_webp, get_dimensions

router = APIRouter()

@router.post("/resize")
async def resize_image(
    file: UploadFile = File(...),
    size: int = Form(...),
    quality: int = Form(80)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_data = await file.read()
        
        # Check file size (max 10MB)
        if len(image_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
        
        image = Image.open(BytesIO(image_data))
        
        resized_image = resize_image_service(image, size)
        webp_data = save_as_webp(resized_image, quality)
        
        return StreamingResponse(
            BytesIO(webp_data),
            media_type="image/webp",
            headers={"Content-Disposition": "attachment; filename=resized_image.webp"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error resizing image: {str(e)}")

@router.post("/make-transparent")
async def make_transparent(
    file: UploadFile = File(...),
    tolerance: int = Form(10),
    quality: int = Form(80)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_data = await file.read()
        
        # Check file size (max 10MB)
        if len(image_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
        
        image = Image.open(BytesIO(image_data))
        
        transparent_image = make_transparent_service(image, tolerance)
        webp_data = save_as_webp(transparent_image, quality)
        
        return StreamingResponse(
            BytesIO(webp_data),
            media_type="image/webp",
            headers={"Content-Disposition": "attachment; filename=transparent_image.webp"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error making image transparent: {str(e)}")

@router.post("/convert-to-webp")
async def convert_to_webp(
    file: UploadFile = File(...),
    quality: int = Form(80)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_data = await file.read()
        
        # Check file size (max 10MB)
        if len(image_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
        
        image = Image.open(BytesIO(image_data))
        
        webp_data = save_as_webp(image, quality)
        
        return StreamingResponse(
            BytesIO(webp_data),
            media_type="image/webp",
            headers={"Content-Disposition": "attachment; filename=converted_image.webp"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error converting image: {str(e)}")

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Image Tools API"}