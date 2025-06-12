from PIL import Image
from io import BytesIO

def resize_image(image: Image.Image, size: int) -> Image.Image:
    width, height = image.size
    if width > height:
        aspect_ratio = height / width
        new_width = size
        new_height = int(new_width * aspect_ratio)
    else:
        aspect_ratio = width / height
        new_height = size
        new_width = int(new_height * aspect_ratio)
    return image.resize((new_width, new_height), Image.LANCZOS)

def make_transparent(image: Image.Image, tolerance: int = 10) -> Image.Image:
    img = image.convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for item in data:
        if all(i > 255 - tolerance for i in item[:3]):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    return img

def save_as_webp(image: Image.Image, quality: int = 80) -> bytes:
    output = BytesIO()
    image.save(output, format='WEBP', quality=quality)
    output.seek(0)
    return output.getvalue()

def get_dimensions(image: Image.Image) -> dict:
    width, height = image.size
    return {"width": width, "height": height}