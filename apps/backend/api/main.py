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
    allow_origins=[
        "https://lawtj.github.io",
        "http://localhost:5173",
        "http://localhost:4173"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(imgtools.router, prefix="/imgtools", tags=["Image Tools"])

@app.get("/")
async def root():
    return {"message": "Personal Backend API is running"}