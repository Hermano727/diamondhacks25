import requests
import json


def parse_with_llama(receipt_text):
    prompt = f"""
Extract all items and prices from this receipt, and return a JSON object with:
- items: list of {{ name, price }}
- subtotal
- tax
- tip (if present)
- total

Only return the JSON object. Do not explain it.

RECEIPT:
\"\"\"
{receipt_text}
\"\"\"
"""

    try:
        print("🔁 Sending request to Ollama...")
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        print("🧪 Status Code:", response.status_code)
        print("📦 Raw Text:", response.text)
        data = response.json()

    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Ollama. Is the server running?")
        return {}

    except requests.exceptions.ReadTimeout:
        print("⏱️ Ollama took too long to respond.")
        return {}

    except Exception as e:
        print("❌ Error making request:", e)
        return {}

    raw = data.get("response", "").strip()
    print("🎯 LLaMA response:", raw)

    # 🧼 Extract JSON from markdown/code blocks if present
    try:
        # If wrapped in markdown block, extract it
        if "```" in raw:
            import re
            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
            if match:
                raw = match.group(1)

        # Add closing } if it's missing (common LLaMA issue)
        if raw.count("{") > raw.count("}"):
            raw += "}"

        return json.loads(raw)

    except json.JSONDecodeError as e:
        print("❌ Failed to parse LLaMA JSON:", e)
        raise Exception("LLaMA returned non-JSON output")




# ✅ Test it
if __name__ == "__main__":
    sample_text = """
GRASS FED BEEF         $26.19
BODY PILLOW            $14.99
TAX                    $3.93
TOTAL                  $153.22
"""
    result = parse_with_llama(sample_text)
    print(json.dumps(result, indent=2))
