from google.cloud import vision
from dotenv import load_dotenv
import os

# Load .env from root directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if creds_path is None:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS not found in .env")

# Get the absolute path to the credentials file
root_dir = os.path.dirname(os.path.dirname(__file__))
creds_path = os.path.join(root_dir, creds_path)

if not os.path.exists(creds_path):
    raise ValueError(f"Credentials file not found at: {creds_path}")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

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