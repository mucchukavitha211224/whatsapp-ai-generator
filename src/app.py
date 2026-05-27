import os
import logging
import threading
from flask import Flask, request, render_template, redirect, url_for
from dotenv import load_dotenv
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "wa-gen-default-key-12345")

# Import modular pipeline components
from ai_processor import extract_requirements
from website_generator import generate_website
from netlify_deployer import deploy_to_netlify

# Helper to check key states
def get_system_status():
    groq_key = os.environ.get("GROQ_API_KEY")
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN")
    netlify_token = os.environ.get("NETLIFY_AUTH_TOKEN")
    
    return {
        "groq_active": bool(groq_key and groq_key != "gsk_your_groq_api_key_here"),
        "twilio_active": bool(twilio_sid and twilio_sid != "ACyour_twilio_account_sid_here" and twilio_token and twilio_token != "your_twilio_auth_token_here"),
        "netlify_active": bool(netlify_token and netlify_token != "your_netlify_personal_access_token_here")
    }

@app.route("/", methods=["GET"])
def index():
    """
    Renders the central developer cockpit dashboard with configuration diagnostics.
    """
    status = get_system_status()
    return render_template("dashboard.html", **status, test_result=None)

@app.route("/generate-test", methods=["POST"])
def generate_test():
    """
    Dashboard Form Action: Triggers the generation and deployment pipeline synchronously
    so the developer can see results instantly in their browser console.
    """
    prompt = request.form.get("prompt", "").strip()
    status = get_system_status()
    
    if not prompt:
        return redirect(url_for("index"))
        
    try:
        # 1. AI specs extraction
        specs = extract_requirements(prompt)
        
        # 2. Render templates
        html = generate_website(specs)
        
        # 3. Deploy to Netlify
        deployed_url = deploy_to_netlify(html, specs["business_name"])
        
        # Build success result for the UI
        test_result = {
            "template_type": specs["template_type"],
            "business_name": specs["business_name"],
            "theme_color": specs["theme_color"],
            "deployed_url": deployed_url
        }
        
        return render_template("dashboard.html", **status, test_result=test_result)
        
    except Exception as e:
        logger.error(f"Test generation pipeline failed: {e}", exc_info=True)
        # Display elegant error details on page
        test_result = {
            "template_type": "error",
            "business_name": "Pipeline Execution Error",
            "theme_color": "rose",
            "deployed_url": f"Failed: {str(e)}"
        }
        return render_template("dashboard.html", **status, test_result=test_result)

def async_generation_worker(prompt: str, sender_number: str):
    """
    Background worker thread to run AI extraction, website rendering, and Netlify deployment.
    Uses Twilio REST client to reply back with the live URL asynchronously once finished.
    """
    logger.info(f"Background thread launched for sender: {sender_number}")
    
    # 1. Check system keys
    status = get_system_status()
    
    try:
        # 2. Extract specs
        logger.info("Extracting specifications via AI processor...")
        specs = extract_requirements(prompt)
        
        # 3. Render dynamic template
        logger.info("Rendering HTML template...")
        html = generate_website(specs)
        
        # 4. Deploy to Netlify
        logger.info("Deploying packages to Netlify...")
        deployed_url = deploy_to_netlify(html, specs["business_name"])
        
        # 5. Build response message
        msg_body = (
            f"✨ *Your Website is Live!* ✨\n\n"
            f"🏢 *Business:* {specs['business_name']}\n"
            f"🎨 *Design Style:* {specs['template_type'].capitalize()}\n"
            f"🎨 *Theme Accent:* {specs['theme_color'].capitalize()}\n\n"
            f"🌐 *Live Netlify Link:*\n{deployed_url}\n\n"
            f"You can view and share your new professional site right away! 🚀"
        )
        
    except Exception as e:
        logger.error(f"Error in background website creation: {e}", exc_info=True)
        msg_body = (
            f"❌ *Website Generation Failed*\n\n"
            f"We hit a snag while generating your site. Error:\n_{str(e)}_\n\n"
            f"Please double check your prompt and try again!"
        )

    # 6. Send the message back via Twilio WhatsApp API
    if status["twilio_active"]:
        try:
            account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
            auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
            sandbox_number = os.environ.get("TWILIO_WHATSAPP_NUMBER", "+14155238886")
            
            # Format sender/receiver correctly for WhatsApp
            from_whatsapp = f"whatsapp:{sandbox_number}" if not sandbox_number.startswith("whatsapp:") else sandbox_number
            to_whatsapp = sender_number # 'sender_number' from Twilio already contains 'whatsapp:' prefix
            
            logger.info(f"Sending WhatsApp notification via Twilio REST from {from_whatsapp} to {to_whatsapp}")
            
            client = Client(account_sid, auth_token)
            client.messages.create(
                body=msg_body,
                from_=from_whatsapp,
                to=to_whatsapp
            )
            logger.info("WhatsApp notification sent successfully.")
            
        except Exception as twilio_err:
            logger.error(f"Failed to send WhatsApp message via Twilio REST: {twilio_err}", exc_info=True)
    else:
        logger.warning(
            f"Twilio credentials are not configured! Could not send message back.\n"
            f"Generated response body was:\n{msg_body}"
        )

@app.route("/webhook", methods=["POST"])
def webhook():
    """
    Twilio WhatsApp Webhook POST Endpoint.
    Receives incoming chat messages, spawns a background thread, and immediately returns
    a fast response to keep Twilio from timing out.
    """
    incoming_msg = request.form.get('Body', '').strip()
    sender = request.form.get('From', '')
    
    logger.info(f"Webhook received incoming request from {sender}. Body size: {len(incoming_msg)} chars")
    
    # 1. Prevent processing empty messages
    if not incoming_msg:
        resp = MessagingResponse()
        resp.message("Hello! Send a detailed description of the website you want to build (e.g. 'A rustic Italian pizza house...').")
        return str(resp), 200, {'Content-Type': 'application/xml'}

    # 2. Boot up a daemon background thread to handle AI processing and Netlify deployment
    # This prevents Twilio's HTTP webhook request from timing out (>15s limit)
    worker_thread = threading.Thread(
        target=async_generation_worker,
        args=(incoming_msg, sender)
    )
    worker_thread.daemon = True
    worker_thread.start()
    
    # 3. Return immediate acknowledgment TwiML response
    resp = MessagingResponse()
    resp.message(
        "🛠️ *AI Web Generator is on it!*\n\n"
        "We are analyzing your details, choosing the perfect design template, "
        "and deploying your custom page to Netlify. Hold tight! You will receive the live link here in a few seconds... 🚀"
    )
    return str(resp), 200, {'Content-Type': 'application/xml'}

if __name__ == "__main__":
    # Ensure outputs directory exists
    os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs"), exist_ok=True)
    
    logger.info("Starting Flask server on port 5000...")
    # Bind to all interfaces to make local Ngrok integration easy
    app.run(host="0.0.0.0", port=5000, debug=True)
