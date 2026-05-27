import { GoogleGenAI } from '@google/generativeai';
import dotenv from 'dotenv';

dotenv.config();

// Standard rule-based backup website builder generator
const generateMockRequirements = (message) => {
  const msg = message.toLowerCase();
  
  // Extract website type
  let type = 'landing';
  if (msg.includes('restaurant') || msg.includes('food') || msg.includes('bakery') || msg.includes('cafe') || msg.includes('pizza') || msg.includes('burger')) {
    type = 'restaurant';
  } else if (msg.includes('portfolio') || msg.includes('photograph') || msg.includes('cv') || msg.includes('resume') || msg.includes('designer') || msg.includes('developer')) {
    type = 'portfolio';
  } else if (msg.includes('store') || msg.includes('shop') || msg.includes('boutique') || msg.includes('bakery') || msg.includes('e-commerce') || msg.includes('ecommerce')) {
    type = 'store';
  } else if (msg.includes('agency') || msg.includes('consult') || msg.includes('business') || msg.includes('lawyer') || msg.includes('company')) {
    type = 'agency';
  }

  // Extract business name
  let businessName = 'DreamCraft App';
  const nameMatches = message.match(/(?:for|named|called|of|brand)\s+([A-Za-z0-9\s'&]+?)(?:\s+(?:with|in|and|whose|theme|which|at|to|from|$))/i);
  if (nameMatches && nameMatches[1]) {
    businessName = nameMatches[1].trim();
  } else {
    // Attempt capitalize first two words
    const words = message.replace(/[^A-Za-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    if (words.length > 0) {
      const candidates = words.filter(w => !['want', 'need', 'website', 'build', 'create', 'make', 'restaurant', 'portfolio', 'store', 'agency', 'online'].includes(w.toLowerCase()));
      if (candidates.length > 0) {
        businessName = candidates.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
  }

  // Color extraction & HSL schemas
  let primaryColor = '220 90% 56%'; // Nice blue
  let secondaryColor = '220 15% 10%'; // Sleek dark gray
  let style = 'modern';
  let fontFamily = 'sans';

  if (msg.includes('red')) {
    primaryColor = '0 84% 60%';
  } else if (msg.includes('green')) {
    primaryColor = '142 70% 45%';
  } else if (msg.includes('yellow') || msg.includes('gold')) {
    primaryColor = '45 93% 47%';
  } else if (msg.includes('dark') || msg.includes('black') || msg.includes('slate')) {
    primaryColor = '220 10% 20%';
    secondaryColor = '220 10% 98%';
    style = 'glassmorphism';
  } else if (msg.includes('pink') || msg.includes('purple')) {
    primaryColor = '322 81% 60%';
  }

  if (msg.includes('neon') || msg.includes('cyber') || msg.includes('retro')) {
    style = 'neon';
  } else if (msg.includes('glass') || msg.includes('sleek')) {
    style = 'glassmorphism';
  } else if (msg.includes('bold') || msg.includes('block') || msg.includes('brutalist')) {
    style = 'brutalist';
  }

  // Pre-generate rich placeholder data based on types
  if (type === 'restaurant') {
    return {
      type,
      businessName,
      tagline: 'Crafting Exquisite Culinary Journeys',
      primaryColor,
      secondaryColor,
      fontFamily: 'serif',
      style,
      hero: {
        title: `Welcome to ${businessName}`,
        subtitle: 'Savor organic, local ingredients cooked with passion and served with love.',
        ctaText: 'View Menu & Reserve'
      },
      about: {
        title: 'Our Story & Philosophy',
        text: `At ${businessName}, we believe that food is a celebration of life. Founded by passionate chefs, our culinary crew curates delightful flavors with clean, locally sourced produce.`,
        listItems: [
          '100% Fresh & Handcrafted Daily',
          'Locally Sourced Organic Ingredients',
          'Extensive Wine & Mocktail Selection'
        ]
      },
      features: [
        { title: 'Truffle Tagliatelle', desc: 'Handcrafted pasta tossed in white truffle butter, wild mushrooms, and fresh parmesan.', price: '$26', icon: 'utensils' },
        { title: 'Smoked Salmon Carpaccio', desc: 'Thinly sliced cold-smoked salmon, capers, pickled red onions, and lemon zest oil.', price: '$19', icon: 'fish' },
        { title: 'Signature Lava Cake', desc: 'Warm dark chocolate cake with a molten center, served with vanilla bean gelato.', price: '$12', icon: 'cake' }
      ],
      galleryKeywords: ['italian restaurant food', 'plated gourmet meal', 'cozy restaurant interior', 'chef cooking'],
      contact: {
        email: `hello@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1 (555) 321-9876',
        address: '742 Evergreen Terrace, Foodie District, NY 10001'
      }
    };
  } else if (type === 'portfolio') {
    return {
      type,
      businessName,
      tagline: 'Capturing Moments, Creating Art',
      primaryColor,
      secondaryColor,
      fontFamily: 'sans',
      style,
      hero: {
        title: `Hi, I'm ${businessName}`,
        subtitle: 'Visual Artist, Photographer, and Digital Designer pushing the boundaries of aesthetics.',
        ctaText: 'Explore My Gallery'
      },
      about: {
        title: 'About Me',
        text: `I am ${businessName}, a seasoned creative designer specialized in capturing authentic human emotions, dramatic natural landscapes, and high-converting commercial designs.`,
        listItems: [
          '5+ Years of Industry Experience',
          'Published in Leading Design Journals',
          'Focused on Storytelling & Visual Rhythm'
        ]
      },
      features: [
        { title: 'Commercial Brand Shoots', desc: 'Crafting high-quality visual campaigns for premium lifestyle and fashion labels.', price: 'Starts at $800', icon: 'camera' },
        { title: 'Digital Art Direction', desc: 'Full aesthetic consulting, UI/UX concept sketching, and digital asset rendering.', price: 'Starts at $1500', icon: 'palette' },
        { title: 'Cinematic Video Editing', desc: 'Post-production, atmospheric color-grading, and immersive narrative cuts.', price: 'Starts at $600', icon: 'video' }
      ],
      galleryKeywords: ['aesthetic photography', 'cinematic portrait', 'creative studio workspace', 'camera lenses'],
      contact: {
        email: `hello@${businessName.toLowerCase().replace(/\s+/g, '')}.design`,
        phone: '+1 (555) 789-1234',
        address: 'SOHO Art Center, Studio 9B, New York, NY 10012'
      }
    };
  } else if (type === 'store') {
    return {
      type,
      businessName,
      tagline: 'Handmade, Premium, and Curated for You',
      primaryColor,
      secondaryColor,
      fontFamily: 'sans',
      style,
      hero: {
        title: `Welcome to ${businessName}`,
        subtitle: 'Discover high-quality, sustainable artisan products designed to elevate your everyday lifestyle.',
        ctaText: 'Shop the Collection'
      },
      about: {
        title: 'Crafted with Integrity',
        text: `At ${businessName}, sustainability and human connection are woven into every single product. We collaborate with regional craftsmen to deliver top-shelf goods.`,
        listItems: [
          '100% Sustainable & Fair Trade',
          'Premium Lifetime Warranty',
          'Complimentary Worldwide Shipping'
        ]
      },
      features: [
        { title: 'Artisanal Wax Candle', desc: 'Soy wax infused with fresh sandalwood, lavender, and patchouli essential oils.', price: '$32.00', icon: 'sparkles' },
        { title: 'Minimalist Leather Wallet', desc: 'Full-grain Italian leather, RFID blocking, holds up to 8 cards and cash.', price: '$65.00', icon: 'wallet' },
        { title: 'Premium Linen Throw', desc: 'Soft organic flax linen, perfect for cozying up your living space or bedroom.', price: '$98.00', icon: 'home' }
      ],
      galleryKeywords: ['artisan home goods', 'leather crafts', 'sustainable lifestyle', 'cozy boutique store'],
      contact: {
        email: `support@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1 (555) 987-6543',
        address: '12 Boutique Boulevard, Suite 104, Austin, TX 78701'
      }
    };
  } else {
    // Default Agency / Landing
    return {
      type: 'agency',
      businessName,
      tagline: 'We Design the Future, Today',
      primaryColor,
      secondaryColor,
      fontFamily: 'sans',
      style,
      hero: {
        title: `Transform Your Brand with ${businessName}`,
        subtitle: 'A full-service elite digital agency specializing in custom web platforms, product branding, and AI integrations.',
        ctaText: 'Get Free Proposal'
      },
      about: {
        title: 'Our Method',
        text: `We help dynamic startups and Fortune 500 corporations design and scale hyper-modern online experiences that engage millions of customers daily.`,
        listItems: [
          'Data-Driven Design Principles',
          'Expert Full-Stack Architecture',
          'Guaranteed Speed & SEO Performance'
        ]
      },
      features: [
        { title: 'Corporate Branding & Design', desc: 'Distinct, stunning logo suites, typography guides, and pitch-deck templates.', price: 'Consultation', icon: 'layers' },
        { title: 'Custom Web & Mobile Apps', desc: 'Lightning-fast cloud applications with offline-first support and flawless UX.', price: 'Consultation', icon: 'code' },
        { title: 'SEO & Growth Acceleration', desc: 'Performance tuning, organic content hubs, and automated marketing funnels.', price: 'Consultation', icon: 'trending-up' }
      ],
      galleryKeywords: ['minimalist office', 'team collaborating desk', 'modern tech interface', 'brainstorming whiteboard'],
      contact: {
        email: `partner@${businessName.toLowerCase().replace(/\s+/g, '')}.io`,
        phone: '+1 (555) 456-7890',
        address: 'Infinity Tower, Suite 42, San Francisco, CA 94105'
      }
    };
  }
};

// Extracts parameters from user's message using Gemini API
export const extractRequirements = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[AI Agent] No GEMINI_API_KEY detected. Using robust rule-based local generator.');
    return generateMockRequirements(userMessage);
  }

  try {
    console.log('[AI Agent] Requesting Gemini API model "gemini-1.5-flash" to extract structure...');
    
    // Initialize google generative AI using newer GoogleGenAI client or GenerativeModel.
    // The library uses standard new GoogleGenAI API export, but let's check standard SDK usage.
    // For standard SDK, imports are usually: import { GoogleGenAI } from '@google/generativeai'
    // Let's use simple REST API call or standard GoogleGenAI SDK format:
    const ai = new GoogleGenAI({ apiKey });
    
    // Or standard format: new GoogleGenAI().getGenerativeModel({ model: "gemini-1.5-flash" })
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const systemPrompt = `
    You are an elite web architect AI. You extract structured design tokens and generate beautiful, highly customized copywriting in JSON format based on a user's request.
    
    You MUST output a valid JSON object matching the schema below. Fill the copy fields with compelling, fully expanded, authentic content. DO NOT use "lorem ipsum" or dummy texts. Keep everything extremely professional, premium, and related to the business.
    
    User prompt: "${userMessage}"
    
    Output JSON Schema:
    {
      "type": "restaurant" | "portfolio" | "store" | "agency" | "landing",
      "businessName": "Name of the business, capitalized",
      "tagline": "Compelling tagline, e.g. 'Crafting Exquisite Culinary Journeys'",
      "primaryColor": "A beautiful HSL color representation, e.g., '142 70% 45%' (green), '220 90% 56%' (blue), '0 84% 60%' (red), '45 93% 47%' (gold/yellow), etc. Tailor it to the branding request.",
      "secondaryColor": "A matching darker background color, e.g. '220 15% 10%'",
      "fontFamily": "sans" | "serif" | "mono",
      "style": "modern" | "glassmorphism" | "brutalist" | "neon",
      "hero": {
        "title": "Stunning headline for the hero section",
        "subtitle": "Sub-headline explaining the value proposition in 2 sentences",
        "ctaText": "CTA Button label"
      },
      "about": {
        "title": "Section title, e.g., 'Our Story' or 'The Creative Director'",
        "text": "Paragraph describing the brand history, philosophy, or team. Expand into 3-4 rich sentences.",
        "listItems": [
          "Key highlight bullet 1",
          "Key highlight bullet 2",
          "Key highlight bullet 3"
        ]
      },
      "features": [
        {
          "title": "Item/Service name 1",
          "desc": "Rich item description or service details",
          "price": "Price (e.g. '$24' or 'Starts at $50') or leave blank if agency",
          "icon": "Lucide icon name (e.g. 'utensils', 'camera', 'wallet', 'code', 'palette', 'sparkles', 'fish', 'cake', 'home', 'layers')"
        },
        {
          "title": "Item/Service name 2",
          "desc": "Rich item description or service details",
          "price": "Price or leave blank",
          "icon": "Lucide icon name"
        },
        {
          "title": "Item/Service name 3",
          "desc": "Rich item description or service details",
          "price": "Price or leave blank",
          "icon": "Lucide icon name"
        }
      ],
      "galleryKeywords": [
        "Unsplash keyword 1",
        "Unsplash keyword 2",
        "Unsplash keyword 3",
        "Unsplash keyword 4"
      ],
      "contact": {
        "email": "Official contact email",
        "phone": "Official phone number",
        "address": "Physical location address or 'Remote Worldwide'"
      }
    }
    `;

    const result = await model.generateContent(systemPrompt);
    const textResponse = result.response.text();
    const data = JSON.parse(textResponse);
    
    console.log('[AI Agent] Successfully extracted structured requirements via Gemini API.');
    return data;
  } catch (error) {
    console.error('[AI Agent] Gemini API Error:', error.message);
    console.log('[AI Agent] Falling back to robust local rule-based extractor.');
    return generateMockRequirements(userMessage);
  }
};
