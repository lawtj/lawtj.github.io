#!/usr/bin/env python3

from fastapi import FastAPI
from .routers import subtask

app = FastAPI(
    title="Vercel FastAPI template",
    description="A starter template for FastAPI backends in Vercel deployments",
    version="0.1.0",
    docs_url='/api',
    openapi_url='/api/openapi.json',
    redoc_url=None
)

app.include_router(subtask.router, prefix="/api/subtask", tags=["Subtask"])


@app.get('/api/hello')
async def hello():
    return {'message': 'Hello world!'}
