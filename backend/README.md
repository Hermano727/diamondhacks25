# Receipt Upload Backend

This is a simple Flask backend for handling receipt image uploads. It currently supports basic file upload functionality, with plans to add OCR processing in the next step.

## Setup

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the Flask server:
```bash
python app.py
```

The server will run on http://localhost:5000 by default.

## Testing

1. First, create a test image:
   ```bash
   python create_test_image.py
   ```
   This will create a test receipt image from the sample text in `sample_receipt.txt`.

2. Test the upload endpoint:
   ```bash
   python test_upload.py
   ```
   This will upload the test image to the server and display the response.

## API Endpoints

### POST /upload
Upload a receipt image.

**Request:**
- Content-Type: multipart/form-data
- Body: file (image file)

**Response:**
```json
{
    "message": "File uploaded successfully",
    "filename": "receipt.jpg",
    "filepath": "uploads/receipt.jpg"
}
```

## Next Steps

1. Integrate OCR processing to extract text from uploaded images
2. Add receipt parsing to extract structured data
3. Implement error handling and validation
4. Add authentication and authorization 