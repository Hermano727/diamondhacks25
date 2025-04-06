import requests
import os

def test_upload_receipt(image_path):
    """Test uploading a receipt image to the API."""
    if not os.path.exists(image_path):
        print(f"❌ Image file not found: {image_path}")
        return False
    
    print(f"📝 Testing upload receipt endpoint with image: {image_path}")
    
    # Prepare the file for upload
    with open(image_path, "rb") as f:
        files = {"receipt": (os.path.basename(image_path), f, "image/jpeg")}
        
        # Send the request
        response = requests.post(
            "http://localhost:8000/upload-receipt",
            files=files
        )
    
    # Check the response
    if response.status_code == 200:
        result = response.json()
        print("✅ File uploaded successfully")
        print(f"📂 Saved to: {result['file_path']}")
        return True
    else:
        print(f"❌ Failed to upload file: {response.text}")
        return False

if __name__ == "__main__":
    # Test the upload endpoint with a sample image
    # You can replace this with any image file you want to test with
    sample_image = "test_receipt.jpg"
    
    if os.path.exists(sample_image):
        test_upload_receipt(sample_image)
    else:
        print(f"❌ Sample image not found: {sample_image}")
        print("Please place a test image named 'test_receipt.jpg' in the same directory as this script.") 