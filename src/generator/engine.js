import fs from 'fs';
import path from 'path';

// Curator of stunning high-res images for instant loading & premium visuals
const STUNNING_GALLERY = {
  restaurant: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80', // Cozy restaurant
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80', // Plated meal
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Chef plating
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80', // Sparkling drinks
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'  // Fine dining
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80', // DSLR Camera
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', // Photographer studio
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=800&q=80', // Creative editing desk
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', // Portrait shot
    'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80'  // Lens reflection
  ],
  store: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', // Store shelves
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80', // Boutique shop front
    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80', // Cozy decor goods
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80', // Elegant craft accessories
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'  // Fashion items
  ],
  agency: [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', // Modern workspace
    'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80', // Collaboration team
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', // Developer desk
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', // Analytics chart screen
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'  // Abstract digital screen
  ],
  landing: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Glowing abstract tech
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', // Collaboration tools
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', // Cyber code wall
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', // Code display
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80'  // Office team meeting
  ]
};

// Generates theme variables & HTML template based on the structured JSON
export const compileWebsite = (reqs) => {
  const {
    type,
    businessName,
    tagline,
    primaryColor = '220 90% 56%',
    secondaryColor = '220 15% 10%',
    fontFamily = 'sans',
    style = 'modern',
    hero,
    about,
    features = [],
    galleryKeywords = [],
    contact
  } = reqs;

  // Font mappings
  let googleFontImport = '@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap");';
  let bodyFont = '"Plus Jakarta Sans", sans-serif';
  let headingFont = '"Plus Jakarta Sans", sans-serif';

  if (fontFamily === 'serif') {
    googleFontImport = '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap");';
    headingFont = '"Playfair Display", Georgia, serif';
    bodyFont = '"Plus Jakarta Sans", sans-serif';
  } else if (fontFamily === 'mono') {
    googleFontImport = '@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap");';
    headingFont = '"Outfit", sans-serif';
    bodyFont = '"Fira Code", monospace';
  }

  // Load curated images matching category
  const images = STUNNING_GALLERY[type] || STUNNING_GALLERY['landing'];
  const heroImage = images[0];
  const aboutImage = images[1];

  // Compile CSS Style tokens based on Layout Style choice
  let cssCustomConfig = '';
  let containerClass = 'bg-slate-50 text-slate-800';
  let cardClass = 'bg-white border border-slate-100 shadow-sm rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md';
  let navClass = 'bg-white/80 backdrop-blur-md border-b border-slate-100';
  let btnClass = 'bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 px-6 py-3 rounded-full font-semibold';
  
  if (style === 'glassmorphism') {
    cssCustomConfig = `
      .glass-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .dark-glass-card {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      body {
        background: linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(9, 11, 16) 100%);
        color: #f1f5f9;
      }
    `;
    containerClass = 'bg-[#0b0f19] text-slate-200';
    cardClass = 'dark-glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]';
    navClass = 'bg-slate-900/60 backdrop-blur-lg border-b border-slate-800/50';
    btnClass = 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 transition-all hover:scale-105 px-6 py-3 rounded-full font-semibold';
  } else if (style === 'brutalist') {
    cssCustomConfig = `
      .neo-brutal {
        border: 4px solid #000000;
        box-shadow: 4px 4px 0px 0px #000000;
        transition: all 0.2s ease-in-out;
      }
      .neo-brutal:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px 0px #000000;
      }
      .neo-brutal-btn {
        background: var(--primary-color);
        color: #000000;
        border: 3px solid #000000;
        box-shadow: 3px 3px 0px 0px #000000;
        font-weight: 800;
        transition: all 0.1s ease;
      }
      .neo-brutal-btn:hover {
        transform: translate(-1px, -1px);
        box-shadow: 4px 4px 0px 0px #000000;
      }
      .neo-brutal-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 0px 0px 0px 0px #000000;
      }
    `;
    containerClass = 'bg-[#f4f2eb] text-[#1a1a1a]';
    cardClass = 'bg-white neo-brutal p-6 rounded-none';
    navClass = 'bg-white border-b-4 border-black';
    btnClass = 'neo-brutal-btn px-6 py-3 rounded-none inline-block text-center';
  } else if (style === 'neon') {
    cssCustomConfig = `
      body {
        background-color: #050508;
        color: #e2e8f0;
      }
      .neon-glow {
        box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.35);
        border: 1px solid rgba(var(--primary-rgb), 0.5);
      }
      .neon-glow:hover {
        box-shadow: 0 0 25px rgba(var(--primary-rgb), 0.6);
        border: 1px solid rgba(var(--primary-rgb), 0.8);
      }
      .neon-text {
        text-shadow: 0 0 8px rgba(var(--primary-rgb), 0.5);
      }
      .neon-btn {
        background: transparent;
        color: #ffffff;
        border: 2px solid rgba(var(--primary-rgb), 1);
        box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
        text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.5);
        transition: all 0.3s ease;
      }
      .neon-btn:hover {
        background: rgba(var(--primary-rgb), 1);
        box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.7);
        color: #000000;
        text-shadow: none;
        transform: scale(1.05);
      }
    `;
    containerClass = 'bg-[#040406] text-slate-300';
    cardClass = 'bg-slate-950/80 border border-slate-900 neon-glow p-6 rounded-xl transition-all duration-300 hover:-translate-y-1';
    navClass = 'bg-slate-950/90 backdrop-blur-md border-b border-slate-900';
    btnClass = 'neon-btn px-6 py-3 rounded-md font-bold inline-block text-center';
  }

  // Feature cards render
  const featuresHtml = features.map((feat) => `
    <div class="${cardClass}">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <i data-lucide="${feat.icon || 'star'}" class="w-6 h-6"></i>
        </div>
        ${feat.price ? `<span class="font-bold text-lg text-primary ${style === 'neon' ? 'neon-text' : ''}">${feat.price}</span>` : ''}
      </div>
      <h3 class="text-xl font-bold mb-2">${feat.title}</h3>
      <p class="text-sm leading-relaxed opacity-75">${feat.desc}</p>
    </div>
  `).join('\n');

  // Gallery items render
  const galleryHtml = images.map((imgUrl, i) => `
    <div class="overflow-hidden group rounded-xl relative ${style === 'brutalist' ? 'border-4 border-black shadow-[4px_4px_0_0_#000]' : ''}">
      <img src="${imgUrl}" alt="Gallery Item ${i + 1}" class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <p class="text-white font-medium capitalize text-sm flex items-center gap-2">
          <i data-lucide="eye" class="w-4 h-4"></i> View High-Res Image
        </p>
      </div>
    </div>
  `).join('\n');

  // Highlight points for About section
  const aboutItemsHtml = about.listItems.map((item) => `
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <i data-lucide="check" class="w-3.5 h-3.5"></i>
      </span>
      <span class="font-medium text-sm leading-snug">${item}</span>
    </li>
  `).join('\n');

  // Custom Primary Color Parsing
  // Check if HSL is valid, else construct HSL properties
  const isHsl = primaryColor.includes('%') || primaryColor.split(' ').length >= 3;
  const rawHsl = isHsl ? primaryColor : '220 90% 56%';
  
  // Helper to extract RGB estimations for neon glows
  let rgbEstimate = '59, 130, 246'; // standard blue
  if (rawHsl.startsWith('0')) rgbEstimate = '239, 68, 68'; // red
  if (rawHsl.startsWith('142')) rgbEstimate = '34, 197, 94'; // green
  if (rawHsl.startsWith('45')) rgbEstimate = '234, 179, 8'; // gold
  if (rawHsl.startsWith('322')) rgbEstimate = '236, 72, 153'; // pink

  // The master template code
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${tagline}</title>
  <meta name="description" content="${about.text.slice(0, 150)}">
  
  <!-- CSS Frameworks -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: 'hsl(var(--primary-color))',
            'primary-hover': 'hsl(var(--primary-hover))',
            secondary: 'hsl(var(--secondary-color))'
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <style>
    ${googleFontImport}
    :root {
      --primary-color: ${rawHsl};
      --primary-hover: ${rawHsl.replace('56%', '46%').replace('60%', '50%').replace('47%', '37%')};
      --primary-rgb: ${rgbEstimate};
      --secondary-color: ${secondaryColor};
    }
    body {
      font-family: ${bodyFont};
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: ${headingFont};
    }
    ${cssCustomConfig}
  </style>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="${containerClass} scroll-smooth antialiased">

  <!-- Header Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 ${navClass}">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" class="text-2xl font-extrabold flex items-center gap-2 ${style === 'neon' ? 'neon-text' : ''}">
        <span class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-base">
          <i data-lucide="layers" class="w-4 h-4"></i>
        </span>
        ${businessName}
      </a>
      <div class="hidden md:flex items-center gap-8 font-semibold">
        <a href="#about" class="hover:text-primary transition-colors text-sm opacity-80 hover:opacity-100">About</a>
        <a href="#services" class="hover:text-primary transition-colors text-sm opacity-80 hover:opacity-100">Services</a>
        <a href="#gallery" class="hover:text-primary transition-colors text-sm opacity-80 hover:opacity-100">Gallery</a>
        <a href="#contact" class="hover:text-primary transition-colors text-sm opacity-80 hover:opacity-100">Contact</a>
      </div>
      <div>
        <a href="#contact" class="${btnClass} text-sm">
          Get Started
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative pt-36 pb-24 overflow-hidden min-h-screen flex items-center">
    <!-- Radial Background lights for Glassmorphism/Neon -->
    ${style === 'glassmorphism' || style === 'neon' ? `
      <div class="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
    ` : ''}

    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <div>
        <span class="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 tracking-wide uppercase ${style === 'brutalist' ? 'border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0_0_#000]' : ''}">
          Premium Web Generation
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          ${hero.title}
        </h1>
        <p class="text-lg opacity-85 leading-relaxed mb-8 max-w-xl">
          ${hero.subtitle}
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a href="#contact" class="${btnClass} text-center">
            ${hero.ctaText}
          </a>
          <a href="#services" class="px-6 py-3 rounded-full font-semibold border border-current opacity-70 hover:opacity-100 text-center transition-all hover:scale-105 flex items-center justify-center gap-2 ${style === 'brutalist' ? 'border-4 border-black text-black bg-white rounded-none shadow-[3px_3px_0_0_#000]' : ''}">
            Learn More <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
      <div class="relative ${style === 'brutalist' ? 'p-2 bg-black' : ''}">
        <div class="relative overflow-hidden rounded-2xl ${style === 'brutalist' ? 'rounded-none' : style === 'neon' ? 'neon-glow' : 'shadow-2xl'}">
          <img src="${heroImage}" alt="${businessName} Hero Image" class="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        ${style === 'brutalist' ? '' : `
          <div class="absolute -bottom-6 -right-6 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg flex items-center gap-3">
            <span class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </span>
            <div>
              <p class="text-xs font-semibold uppercase opacity-60">Verified</p>
              <p class="text-sm font-extrabold">100% Secure Bot</p>
            </div>
          </div>
        `}
      </div>
    </div>
  </section>

  <!-- About Us Section -->
  <section id="about" class="py-24 border-t border-slate-100 dark:border-slate-900/50">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <div class="order-2 md:order-1 ${style === 'brutalist' ? 'p-2 bg-black' : ''}">
        <div class="relative overflow-hidden rounded-2xl ${style === 'brutalist' ? 'rounded-none' : style === 'neon' ? 'neon-glow' : 'shadow-xl'}">
          <img src="${aboutImage}" alt="About Image" class="w-full h-[450px] object-cover" />
        </div>
      </div>
      <div class="order-1 md:order-2">
        <span class="text-primary font-bold tracking-wider uppercase text-sm block mb-3">${about.title}</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">Who We Are & What We Believe</h2>
        <p class="text-lg leading-relaxed opacity-80 mb-8">
          ${about.text}
        </p>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${aboutItemsHtml}
        </ul>
      </div>
    </div>
  </section>

  <!-- Features & Services Section -->
  <section id="services" class="py-24 bg-slate-100/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-900/50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-primary font-bold tracking-wider uppercase text-sm block mb-3">Our Offerings</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mb-4">Handcrafted Selections & Specialties</h2>
        <p class="opacity-70 leading-relaxed text-sm sm:text-base">
          Discover a preview of premium, fully tailored offerings designed specifically to cater to your highest expectations.
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        ${featuresHtml}
      </div>
    </div>
  </section>

  <!-- Gallery Section -->
  <section id="gallery" class="py-24 border-t border-slate-100 dark:border-slate-900/50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-primary font-bold tracking-wider uppercase text-sm block mb-3">Portfolio Highlights</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mb-4">Explore Visual Perfection</h2>
        <p class="opacity-70 leading-relaxed text-sm sm:text-base">
          A curate-selected gallery displaying high-fidelity imagery and products matching your requirements.
        </p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        ${galleryHtml}
      </div>
    </div>
  </section>

  <!-- Contact Us Section -->
  <section id="contact" class="py-24 bg-slate-100/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-900/50">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
      <div>
        <span class="text-primary font-bold tracking-wider uppercase text-sm block mb-3">Connect With Us</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">Get in Touch Today</h2>
        <p class="opacity-80 leading-relaxed mb-8">
          Have an inquiry, reservation request, or customize proposal? Drop us a line! Our digital bot captures your feedback instantly.
        </p>
        
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <span class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <i data-lucide="mail" class="w-5 h-5"></i>
            </span>
            <div>
              <p class="text-xs uppercase opacity-60 font-semibold">Email Us</p>
              <a href="mailto:${contact.email}" class="font-bold hover:text-primary transition-colors">${contact.email}</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <i data-lucide="phone" class="w-5 h-5"></i>
            </span>
            <div>
              <p class="text-xs uppercase opacity-60 font-semibold">Call Support</p>
              <a href="tel:${contact.phone}" class="font-bold hover:text-primary transition-colors">${contact.phone}</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <i data-lucide="map-pin" class="w-5 h-5"></i>
            </span>
            <div>
              <p class="text-xs uppercase opacity-60 font-semibold">Visit Our Office</p>
              <p class="font-bold">${contact.address}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="${cardClass}">
        <h3 class="text-2xl font-bold mb-6">Send Message</h3>
        <form id="contactForm" onsubmit="event.preventDefault(); alert('Message successfully transmitted to WhatsApp Engine!')" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase mb-2 opacity-80">Full Name</label>
            <input type="text" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="John Doe" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase mb-2 opacity-80">Email Address</label>
            <input type="email" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="johndoe@gmail.com" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase mb-2 opacity-80">Your Message</label>
            <textarea required rows="4" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="What are we crafting together?"></textarea>
          </div>
          <button type="submit" class="w-full ${btnClass}">
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 border-t border-slate-100 dark:border-slate-900/50">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm opacity-75">
      <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      <p class="flex items-center gap-1.5">
        Powered by <a href="#" class="font-bold text-primary hover:underline flex items-center gap-1">ElevateBox <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i></a>
      </p>
    </div>
  </footer>

  <script>
    // Initialize Lucide Icons
    lucide.createIcons();
  </script>
</body>
</html>`;
};

// Generates dynamic project site structure and writes files to directory
export const generateWebsiteFiles = (siteId, requirements) => {
  const deployedDir = path.join(process.cwd(), 'deployed_sites', siteId);
  
  if (!fs.existsSync(deployedDir)) {
    fs.mkdirSync(deployedDir, { recursive: true });
  }

  // Compile index.html
  const htmlContent = compileWebsite(requirements);
  fs.writeFileSync(path.join(deployedDir, 'index.html'), htmlContent, 'utf-8');

  console.log(`[Generator] Created website index.html under deployed_sites/${siteId}`);
  return deployedDir;
};
