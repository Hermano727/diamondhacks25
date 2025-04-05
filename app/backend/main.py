from fastapi import FastAPI, UploadFile, File
from app.backend.ocr_vision import extract_text_from_image
from app.backend.phi_parser import parse_with_phi
import shutil
import os

app = FastAPI()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload-receipt")
async def upload_receipt(receipt: UploadFile = File(...)):
    # Save uploaded image
    file_path = os.path.join(UPLOAD_FOLDER, receipt.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(receipt.file, f)

    # Step 1: Google OCR
    receipt_text = extract_text_from_image(file_path)

    # Step 2: LLaMA parsing
    parsed_receipt = parse_with_phi(receipt_text)

    return {
        "raw_text": receipt_text,
        "parsed": parsed_receipt
    }
