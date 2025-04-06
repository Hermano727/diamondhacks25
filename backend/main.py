from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from backend.ocr_vision import extract_text_from_image
from backend.phi_parser import parse_with_phi
import os
import shutil

app = FastAPI()

# CORS: Allow mobile frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ideally set your device IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-receipt")
async def upload_receipt(receipt: UploadFile = File(...)):
    # Save temp image
    temp_path = f"temp_{receipt.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(receipt.file, buffer)

    try:
        # Step 1: OCR
        raw_text = extract_text_from_image(temp_path)

        # Step 2: Parse
        parsed = parse_with_phi(raw_text)

        return {
            "raw_text": raw_text,
            "parsed": parsed
        }

    finally:
        # Clean up temp file
        os.remove(temp_path)
