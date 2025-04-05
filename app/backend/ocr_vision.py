from google.cloud import vision
import os

# Load creds from .env if needed
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./app/backend/google-creds.json"

client = vision.ImageAnnotatorClient()

def extract_text_from_image(file_path):
    with open(file_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return ""

    return texts[0].description  # Full receipt text
