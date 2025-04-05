from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
from typing import List, Optional
import uvicorn

# Import Google Vision (commented out for now)
# from google.cloud import vision

app = FastAPI(title="Splitr API", description="API for receipt parsing and expense splitting")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define response models
class ReceiptItem(BaseModel):
    name: str
    price: float
    quantity: int

class ReceiptResponse(BaseModel):
    store_name: str
    date: str
    total: float
    items: List[ReceiptItem]
    tax: float

@app.post("/api/parse-receipt", response_model=ReceiptResponse)
async def parse_receipt(file: UploadFile = File(...)):
    try:
        # Read the image file
        contents = await file.read()
        
        # For now, return mock data
        # In a real implementation, you would use Google Vision API to parse the receipt
        mock_data = {
            'store_name': 'Sample Store',
            'date': '2023-04-05',
            'total': 45.67,
            'items': [
                {'name': 'Item 1', 'price': 12.99, 'quantity': 1},
                {'name': 'Item 2', 'price': 8.50, 'quantity': 2},
                {'name': 'Item 3', 'price': 15.68, 'quantity': 1},
            ],
            'tax': 3.50
        }
        
        return mock_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 