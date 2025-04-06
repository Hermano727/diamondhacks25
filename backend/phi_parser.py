import requests
import os
import json
import time
from dotenv import load_dotenv
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
print("API KEY (preview):", OPENROUTER_API_KEY[:10], "..." if OPENROUTER_API_KEY else "❌ None found")

def parse_with_phi(receipt_text, max_retries=3, retry_delay=1):
    prompt = f"""
You are a receipt parser. Extract and return this data as JSON:
- items: list of {{ name, price }}
- subtotal
- tax
- tip
- total

Return only valid JSON.

If there is a multiple line entry, be careful.
RECEIPT:
\"\"\"
{receipt_text}
\"\"\"
"""

    for attempt in range(max_retries):
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost",  # (Optional) for OpenRouter usage policy
                    "X-Title": "ReceiptParserApp"
                },
                json={
                    "model": "mistralai/mistral-7b-instruct:v0.2",
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=30  # Add timeout
            )

            data = response.json()

            # Debug raw response if needed
            # print("Full response:", json.dumps(data, indent=2))

            # Try both formats
            print(f"RAW OpenRouter Response (attempt {attempt+1}):", json.dumps(data, indent=2))

            if "choices" in data:
                parsed_data = json.loads(data["choices"][0]["message"]["content"])
                # Validate parsed data
                if validate_parsed_data(parsed_data):
                    return parsed_data
                else:
                    print(f"Invalid parsed data on attempt {attempt+1}")
            elif "response" in data:
                parsed_data = json.loads(data["response"])
                # Validate parsed data
                if validate_parsed_data(parsed_data):
                    return parsed_data
                else:
                    print(f"Invalid parsed data on attempt {attempt+1}")
            else:
                print(f"Unexpected response format on attempt {attempt+1}")

            # If we get here, the parsing was successful but the data was invalid
            # Wait before retrying
            if attempt < max_retries - 1:
                time.sleep(retry_delay)

        except requests.exceptions.Timeout:
            print(f"Request timed out on attempt {attempt+1}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
        except requests.exceptions.RequestException as e:
            print(f"Request error on attempt {attempt+1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
        except json.JSONDecodeError as e:
            print(f"JSON decode error on attempt {attempt+1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
        except Exception as e:
            print(f"Unexpected error on attempt {attempt+1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)

    # If we get here, all retries failed
    return {"error": "Failed to parse receipt after multiple attempts"}

def validate_parsed_data(data):
    """Validate that the parsed data has the expected structure."""
    if not isinstance(data, dict):
        return False
    
    # Check for required fields
    required_fields = ["items", "subtotal", "tax", "total"]
    for field in required_fields:
        if field not in data:
            return False
    
    # Check that items is a list
    if not isinstance(data["items"], list):
        return False
    
    # Check that each item has name and price
    for item in data["items"]:
        if not isinstance(item, dict) or "name" not in item or "price" not in item:
            return False
    
    return True 