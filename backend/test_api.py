import requests
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API endpoint
API_URL = "http://localhost:8000"

def test_health():
    """Test the health check endpoint."""
    logger.info("Testing health check endpoint")
    response = requests.get(f"{API_URL}/health")
    logger.info("Health check response: %s", response.json())
    return response.status_code == 200

def test_upload_receipt(image_path):
    """Test the upload receipt endpoint with a sample image."""
    if not os.path.exists(image_path):
        logger.error("Image file not found: %s", image_path)
        return False
    
    logger.info("Testing upload receipt endpoint with image: %s", image_path)
    
    # Prepare the file for upload
    files = {"receipt": open(image_path, "rb")}
    
    # Send the request
    response = requests.post(f"{API_URL}/upload-receipt", files=files)
    
    # Check the response
    if response.status_code == 200:
        result = response.json()
        logger.info("Receipt parsed successfully")
        logger.info("Raw text: %s...", result["raw_text"][:100])
        logger.info("Parsed data: %s", json.dumps(result["parsed"], indent=2))
        return True
    else:
        logger.error("Failed to parse receipt: %s", response.text)
        return False

if __name__ == "__main__":
    # Test the health check endpoint
    if test_health():
        logger.info("Health check passed")
    else:
        logger.error("Health check failed")
    
    # Test the upload receipt endpoint
    # Replace with the path to a sample receipt image
    sample_image = "sample_receipt.jpg"
    if os.path.exists(sample_image):
        if test_upload_receipt(sample_image):
            logger.info("Upload receipt test passed")
        else:
            logger.error("Upload receipt test failed")
    else:
        logger.warning("Sample image not found: %s", sample_image) 