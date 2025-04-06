import os
from ocr_vision import extract_text_from_image
from phi_parser import parse_with_phi
import json

def test_receipt(image_path):
    print(f"\nTesting receipt: {image_path}")
    
    # Step 1: Extract text using Google Vision OCR
    print("\nExtracting text from image...")
    receipt_text = extract_text_from_image(image_path)
    print("\nExtracted Text:")
    print("-" * 50)
    print(receipt_text)
    print("-" * 50)
    
    # Step 2: Parse the text using Phi
    print("\nParsing receipt data...")
    parsed_data = parse_with_phi(receipt_text)
    print("\nParsed Data:")
    print("-" * 50)
    if isinstance(parsed_data, dict) and "error" in parsed_data:
        print(f"Error: {parsed_data['error']}")
        if "details" in parsed_data:
            print(f"Details: {parsed_data['details']}")
    else:
        print(json.dumps(parsed_data, indent=2))
    print("-" * 50)

if __name__ == "__main__":
    # Get the absolute path to the assets/images directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    images_dir = os.path.join(root_dir, "assets", "images")
    
    # List available images
    print("Available images:")
    for i, image in enumerate(os.listdir(images_dir), 1):
        print(f"{i}. {image}")
    
    # Let user choose an image
    choice = input("\nEnter the number of the image to test (or press Enter for test_receipt.jpg): ").strip()
    
    if choice:
        try:
            image_name = os.listdir(images_dir)[int(choice) - 1]
        except (ValueError, IndexError):
            print("Invalid choice. Using test_receipt.jpg")
            image_name = "test_receipt.jpg"
    else:
        image_name = "test_receipt.jpg"
    
    image_path = os.path.join(images_dir, image_name)
    test_receipt(image_path) 