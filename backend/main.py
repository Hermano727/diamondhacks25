from fastapi import FastAPI, UploadFile, File, HTTPException
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
        print(f"✅ Saved receipt image to {file_path}")

        return {
            "message": "File uploaded successfully",
            "file_path": file_path
        }
    except Exception as e:
        print(f"❌ Error saving file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}