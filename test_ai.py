import os
import json
from dotenv import load_dotenv

# Load key from .env file
load_dotenv()

from src.ai.extractor import RequirementExtractor
from src.utils.logger import get_logger

logger = get_logger("test_ai")

def run_test():
    # Fast checks
    key = os.getenv("GROQ_API_KEY")
    if not key or "your_groq_api_key_here" in key:
        logger.error("❌ GROQ_API_KEY is not configured in your .env file!")
        logger.info("Please follow Step 1 & 2 to set up your key first.")
        return

    logger.info("=== STARTING GROQ AI EXTRACTION TEST ===")
    extractor = RequirementExtractor()
    
    # Define a test prompt
    prompt = "I want a cozy organic vegan restaurant website named GreenGrill featuring burgers, fresh salads, and a modern layout."
    logger.info(f"Test Prompt: \"{prompt}\"")
    logger.info("Sending request to Groq API (using llama-3.3-70b-versatile in strict JSON Mode)...")
    
    try:
        # Run extractor
        spec = extractor.extract(prompt)
        
        logger.info("🎉 SUCCESS! Received structured JSON specifications from Groq:")
        print(json.dumps(spec, indent=2))
        
    except Exception as e:
        logger.error(f"❌ AI Extraction crashed: {e}")

if __name__ == "__main__":
    run_test()
