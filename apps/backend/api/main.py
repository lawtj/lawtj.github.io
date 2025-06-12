from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import imgtools

app = FastAPI(title="Personal Backend API", version="1.0.0",
              docs_url='/api',
              openapi_url='/api/openapi.json',
              redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(imgtools.router, prefix="/imgtools", tags=["Image Tools"])

@app.get("/")
async def root():
    return {"message": "Personal Backend API is running"}