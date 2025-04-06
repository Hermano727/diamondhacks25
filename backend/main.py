from fastapi import FastAPI, UploadFile, File, HTTPException
from backend.ocr_vision import extract_text_from_image
from backend.phi_parser import parse_with_phi
import shutil
import os
import time

app = FastAPI()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload-receipt")
async def upload_receipt(receipt: UploadFile = File(...)):
    # Generate a unique filename to avoid conflicts
    timestamp = int(time.time())
    filename = f"{timestamp}_{receipt.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        # Save uploaded image
        with open(file_path, "wb") as f:
            shutil.copyfileobj(receipt.file, f)

        # Step 1: Google OCR
        receipt_text = extract_text_from_image(file_path)
        
        if not receipt_text:
            raise HTTPException(status_code=400, detail="No text could be extracted from the image")

        # Step 2: LLaMA parsing
        parsed_receipt = parse_with_phi(receipt_text)
        
        # Check if parsing failed
        if "error" in parsed_receipt:
            raise HTTPException(status_code=500, detail=parsed_receipt["error"])

        return {
            "raw_text": receipt_text,
            "parsed": parsed_receipt
        }
    except Exception as e:
        # Log the error
        print(f"Error processing receipt: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error removing file {file_path}: {e}")