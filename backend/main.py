import os
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@app.post("/api/upload")
async def upload_images(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(400, f"Unsupported file type: {ext}")
        filename = f"{uuid.uuid4()}{ext}"
        dest = UPLOAD_DIR / filename
        dest.write_bytes(await file.read())
        results.append({"filename": filename, "url": f"/uploads/{filename}"})
    return results


class ResearchRequest(BaseModel):
    title: str
    type: str  # book | movie | tv


@app.post("/api/research")
async def research(req: ResearchRequest):
    # Implemented in Phase 3
    return {"summary": "", "searches_run": 0}


class MessageRequest(BaseModel):
    history: list
    user_message: str
    research_summary: str
    media_title: str
    media_type: str


@app.post("/api/message")
async def message(req: MessageRequest):
    # Implemented in Phase 4
    return {"reply": "", "strong_opinions_count": 0}


class GenerateRequest(BaseModel):
    history: list
    research_summary: str
    uploaded_images: List[str]
    media_title: str


@app.post("/api/generate")
async def generate(req: GenerateRequest):
    # Implemented in Phase 5
    return {"posts": []}
