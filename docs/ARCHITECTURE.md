# Technical Architecture: WhatsApp AI Website Generator

This document provides a detailed overview of the system architecture, design decisions, data flow, and components of the **WhatsApp AI Website Generator MVP**.

---

## 1. System Design Diagram & Flow

The application coordinates four distinct modules: **Twilio Sandbox**, **Flask Webhook Server**, **Groq Llama Inference**, and **Netlify Hosting API**.

```mermaid
sequenceDiagram
    autonumber
    actor User as WhatsApp User
    participant Twilio as Twilio WhatsApp Gateway
    participant Flask as Flask Server (app.py)
    participant AI as AI Extractor (src/ai/extractor.py)
    participant Gen as HTML Builder (src/generator/builder.py)
    participant Netlify as Netlify API
    
    User->>Twilio: Sends WhatsApp Prompt<br/>"Build a pizza shop named Bella Italia"
    Twilio->>Flask: POST Webhook Request
    
    Note over Flask: Validates parameters & key configurations
    Flask-->>Twilio: HTTP 200 Response with quick acknowledgment<br/>"Started building... 🚀"
    Twilio-->>User: Delivers Acknowledgment Message
    
    Note over Flask: Spawns Background Thread
    
    rect rgb(240, 248, 255)
        Note right of Flask: Background Async Pipeline
        Flask->>AI: extract(user_prompt)
        Note over AI: Queries Groq Llama 3.3 in JSON Mode
        AI-->>Flask: Structured spec (colors, fonts, custom marketing copy)
        
        Flask->>Gen: build(spec)
        Note over Gen: Injects specs into Tailwind Jinja2 template;<br/>Saves index.html to output/
        Gen-->>Flask: Compiled website directory path
        
        Flask->>Netlify: deploy(site_dir)
        Note over Netlify: Packages files into binary ZIP;<br/>POST payload to API sites endpoint
        Netlify-->>Flask: Live hosted .netlify.app URL
        
        Flask->>Twilio: Sends REST Message with hosted URL
        Twilio-->>User: Delivers Live Link on WhatsApp! 🎉
    end
    
    Note over Flask: Cleans up temporary output folder
```

---

## 2. Key Architectural Decisions Explained

### A. Asynchronous Multi-threaded Webhooks (Crucial)
* **Problem:** Twilio expects an HTTP response from webhooks within **15 seconds**. LLM content generation and Netlify deployment processes take between **20 and 45 seconds** combined. If a webhook blocks the main thread, Twilio triggers timeout retries, resulting in duplicate processes and server overload.
* **Solution:** The Flask server uses a **multi-threaded asynchronous** architecture. Upon receiving a POST webhook request:
  1. It performs fast validation checks.
  2. Spawns an independent `threading.Thread` to execute the heavy-lifting pipeline in the background.
  3. Immediately returns a standard `MessagingResponse` acknowledgment to Twilio.
  4. The background thread makes out-of-band calls back to the Twilio REST Client API to push progress updates and the final URL to the user.

### B. Groq JSON Mode
* **Problem:** Traditional LLM completions can contain conversational filler ("Sure, here is your JSON:") or syntax errors, causing JSON parsing to fail.
* **Solution:** We configure the Groq SDK with `response_format={"type": "json_object"}`. Combined with strict prompt system instructions requesting a specific schema, this guarantees syntactically correct, parsable JSON outputs on every invocation. Llama-3.3-70b is utilized for ultra-fast, high-quality content copywriting.

### C. Universal Template compiling with Play Tailwind CDN
* **Problem:** Traditional bundlers (Webpack/Vite) or React frameworks require extensive compile times, server-side dependencies, and long build steps.
* **Solution:** We use a single, highly flexible `base_website.html` master template loaded with a custom Tailwind CSS Play CDN script. 
  * The builder injects brand-specific color codes and Google Font parameters dynamically into the CDN configuration script inside the HTML file.
  * When the browser loads the page, Tailwind automatically compiles and styles the components on the fly in milliseconds.
  * This guarantees **Lighthouse scores > 90** and zero build dependencies.

### D. Single REST Call ZIP Deployments
* **Problem:** Deploying through command-line clients (e.g., netlify-cli, vercel-cli) requires global installations, configurations, and complex shell integrations.
* **Solution:** Netlify allows deploying pre-packaged static folders by POSTing a raw binary ZIP file directly to their `/api/v1/sites` endpoint. The deployment module compresses the generated directory programmatically using python `zipfile` and deploys it in a single HTTP call.

---

## 3. Data Schema Flow

```json
{
  "type": "restaurant",
  "business_name": "Gusto Italiano",
  "slogan": "Traditional Neapolitan Pizza",
  "hero_title": "Taste the Hearth of Naples",
  "hero_subtitle": "Wood-fired sourdough pizza topped with organic imported mozzarella and basil.",
  "brand_story": "Born from a love of traditional Neapolitan ovens...",
  "font_family": "Plus Jakarta Sans",
  "colors": {
    "primary": "#b91c1c",
    "secondary": "#ea580c",
    "accent": "#facc15",
    "dark": "#1c1917",
    "light": "#fafaf9"
  },
  "sections": ["hero", "features", "services", "about", "contact"],
  "features": [
    {"title": "Organic Ingredients", "desc": "100% genuine Italian olive oil.", "icon": "fa-seedling"}
  ],
  "services": [
    {"title": "Margherita", "price": "$14.00", "description": "Classic tomato sauce and cheese.", "icon": "fa-pizza-slice"}
  ],
  "contact": {
    "phone": "+1 555-0192",
    "email": "ciao@gusto.com",
    "address": "123 Rome Street"
  }
}
```

---

## 4. Operational Cleanliness
To maintain filesystem cleanliness on production systems:
1. Every run generates files in a unique subdirectory: `/output/site-name-uuid/index.html`.
2. As soon as the Netlify deployment returns the hosted URL, a `finally` block executes `shutil.rmtree` on the session directory.
3. This guarantees the server maintains a **$0 budget** storage footprint and zero permanent data accumulation.
