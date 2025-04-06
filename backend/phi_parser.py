import requests
import os
import json
import re

from dotenv import load_dotenv
# Load .env from root directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def parse_with_phi(receipt_text):
    prompt = f"""
You are a receipt parsing assistant. Your job is to extract structured data from the receipt text below.

Please return **valid JSON only** in the following format:
{{
  "items": [
    {{
      "name": "string",
      "price": number,
      "quantity": integer
    }}
  ],
  "subtotal": number,
  "tax": number,
  "tip": number,
  "total": number
}}

Instructions:
- Do not include any non-JSON explanation or formatting.
- Extract items carefully, even if their names span multiple lines.
- If a line like "2 Fried Chicken Sandwich $34.00" appears, it should be parsed as quantity 2, price 34.00 / 2 = 17.00 per item.
- If quantity is not specified, default to quantity: 1.
- Prices should be floats. Remove all currency symbols.
- Do your best to infer correct quantities and split prices when needed.
- If subtotal/tax/tip/total appear in the receipt, include them in the JSON.

RECEIPT TEXT:
\"\"\"
{receipt_text}
\"\"\"
"""

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
            }
        )

        data = response.json()

        # Print raw response for debugging
        print("RAW OpenRouter Response:", json.dumps(data, indent=2))

        # Extract the content from the response
        content = None
        if "choices" in data and len(data["choices"]) > 0:
            content = data["choices"][0]["message"]["content"]
        elif "response" in data:
            content = data["response"]
        
        if not content:
            raise ValueError("No content found in response")
        
        # Clean the content - remove comments and fix common JSON issues
        # Remove any comments (// or /* */)
        content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        
        # Try to parse the cleaned JSON
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            # Try to extract just the JSON part if it's wrapped in markdown code blocks
            json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except:
                    pass
            
            # If all else fails, return a structured error
            return {"error": "Failed to parse receipt", "details": str(e)}

    except Exception as e:
        print(f"Phi-3 error: {e}")
        return {"error": "Failed to parse receipt"}