import requests
import os
import json

from dotenv import load_dotenv
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def parse_with_phi(receipt_text):
    prompt = f"""
You are a receipt parser. Extract and return this data as JSON:
- items: list of {{ name, price }}
- subtotal
- tax
- tip
- total

Return only valid JSON.

If there is a multiple line entry, be careful.

If the receipt text groups names first and then prices, try your best to match them up.
RECEIPT:
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
                "HTTP-Referer": "http://localhost", 
                "X-Title": "ReceiptParserApp"
            },
            json={
                "model": "mistralai/mistral-7b-instruct:v0.2",
                "messages": [{"role": "user", "content": prompt}]
            }
        )

        data = response.json()

        

        if "choices" in data:
            return json.loads(data["choices"][0]["message"]["content"])
        elif "response" in data:
            return json.loads(data["response"])
        else:
            raise ValueError("Unexpected response format")

    except Exception as e:
        print("Phi-3 error:", e)
        return {"error": "Failed to parse receipt"}
