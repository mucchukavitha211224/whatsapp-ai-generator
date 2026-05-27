const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ================= CLIENT =================

const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: {

        headless: false,

        executablePath:
        'C:\\Users\\mucch\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

// ================= QR =================

client.on('qr', (qr) => {

    console.log('📱 Scan QR Code');

    qrcode.generate(qr, {
        small: true
    });
});

// ================= READY =================

client.on('ready', () => {

    console.log('✅ BOT READY');
});

// ================= AUTH =================

client.on('authenticated', () => {

    console.log('🔐 AUTH SUCCESS');
});

// ================= AUTH FAILURE =================

client.on('auth_failure', msg => {

    console.log('❌ AUTH FAILED');

    console.log(msg);
});

// ================= DISCONNECTED =================

client.on('disconnected', reason => {

    console.log('❌ DISCONNECTED');

    console.log(reason);
});

// ================= LANGUAGE =================

function getLanguage(text) {

    text = text.toLowerCase();

    if (
        text.includes('వెబ్‌సైట్') ||
        text.includes('సృష్టించు')
    ) {

        return 'Telugu 🇮🇳';
    }

    if (
        text.includes('वेबसाइट') ||
        text.includes('बनाओ')
    ) {

        return 'Hindi 🇮🇳';
    }

    if (
        text.includes('வலைத்தளம்') ||
        text.includes('உருவாக்கு')
    ) {

        return 'Tamil 🇮🇳';
    }

    return 'English 🇬🇧';
}

// ================= WEBSITE TYPE =================

function detectWebsiteType(text) {

    text = text.toLowerCase();

    const types = [

        'restaurant',
        'bakery',
        'gym',
        'portfolio',
        'school',
        'hospital',
        'hotel',
        'coffee',
        'cafe',
        'fashion',
        'travel',
        'photography',
        'developer',
        'agency',
        'food',
        'pizza',
        'burger',
        'fitness',
        'yoga',
        'shop',
        'business',
        'salon',
        'spa',
        'clinic'
    ];

    for (let type of types) {

        if (text.includes(type)) {

            return type;
        }
    }

    return 'creative';
}

// ================= TITLES =================

function getCreativeTitle(type) {

    const titles = {

        restaurant: 'Royal Restaurant 🍽️',
        bakery: 'Sweet Bakery 🍰',
        gym: 'Power Gym 💪',
        hotel: 'Luxury Hotel 🏨',
        fashion: 'Fashion Hub 👗',
        portfolio: 'Creative Portfolio 💻',
        creative: 'Future Vision 🚀'
    };

    return titles[type] || titles['creative'];
}

// ================= HERO IMAGES =================

function getHeroImage(type) {

    const images = {

        restaurant:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',

        bakery:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200',

        gym:
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',

        hotel:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',

        fashion:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',

        portfolio:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',

        creative:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'
    };

    return images[type] || images['creative'];
}

// ================= WEBSITE HTML =================

function generateWebsite(type, userText) {

    const title = getCreativeTitle(type);

    const hero = getHeroImage(type);

    return `

<!DOCTYPE html>

<html>

<head>

<title>${title}</title>

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<link
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
rel="stylesheet"
/>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
scroll-behavior:smooth;
}

body{
font-family:Arial;
background:#f4f4f4;
overflow-x:hidden;
}

nav{
position:fixed;
top:0;
width:100%;
display:flex;
justify-content:space-between;
align-items:center;
padding:20px 50px;
background:rgba(0,0,0,0.7);
z-index:1000;
}

nav h1{
color:white;
}

nav ul{
display:flex;
gap:20px;
list-style:none;
}

nav ul li{
color:white;
}

.hero{
height:100vh;
background:url('${hero}');
background-size:cover;
background-position:center;
display:flex;
justify-content:center;
align-items:center;
text-align:center;
position:relative;
color:white;
}

.overlay{
position:absolute;
width:100%;
height:100%;
background:rgba(0,0,0,0.5);
}

.hero-content{
position:relative;
z-index:2;
max-width:700px;
}

.hero-content h1{
font-size:70px;
}

.hero-content p{
font-size:24px;
margin-top:20px;
}

.hero-content button{
margin-top:30px;
padding:15px 35px;
border:none;
border-radius:30px;
background:#ff4b2b;
color:white;
font-size:18px;
cursor:pointer;
}

.section{
padding:100px 10%;
}

.section-title{
text-align:center;
font-size:45px;
margin-bottom:50px;
}

.services{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:30px;
}

.service{
background:white;
padding:30px;
border-radius:20px;
text-align:center;
box-shadow:0 10px 20px rgba(0,0,0,0.1);
transition:0.3s;
}

.service:hover{
transform:translateY(-10px);
}

.gallery{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
gap:20px;
}

.gallery img{
width:100%;
height:250px;
object-fit:cover;
border-radius:20px;
}

.contact{
background:linear-gradient(to right,#ff512f,#dd2476);
padding:50px;
border-radius:30px;
color:white;
}

.contact input,
.contact textarea{
width:100%;
padding:15px;
margin-top:15px;
border:none;
border-radius:10px;
}

.contact button{
margin-top:20px;
padding:15px 30px;
border:none;
border-radius:10px;
background:black;
color:white;
cursor:pointer;
}

footer{
background:black;
color:white;
text-align:center;
padding:30px;
}

@media(max-width:768px){

.hero-content h1{
font-size:45px;
}

nav ul{
display:none;
}

}

</style>

</head>

<body>

<nav>

<h1>${title}</h1>

<ul>
<li>Home</li>
<li>About</li>
<li>Menu</li>
<li>Gallery</li>
<li>Reviews</li>
<li>Contact</li>
</ul>

</nav>

<section class="hero">

<div class="overlay"></div>

<div class="hero-content">

<h1>${title}</h1>

<p>${userText}</p>

<button>Explore Now</button>

</div>

</section>

<section class="section">

<h1 class="section-title">About Us</h1>

<p style="text-align:center;font-size:20px;line-height:1.8;">
Premium colorful AI generated website with modern UI.
</p>

</section>

<section class="section">

<h1 class="section-title">Popular Services</h1>

<div class="services">

<div class="service">

<h2>Premium Design ✨</h2>

<p>Modern colorful UI</p>

</div>

<div class="service">

<h2>Fast Delivery ⚡</h2>

<p>Instant website generation</p>

</div>

<div class="service">

<h2>24/7 Support ❤️</h2>

<p>Always available</p>

</div>

</div>

</section>

<section class="section">

<h1 class="section-title">Gallery</h1>

<div class="gallery">

<img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200">

<img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200">

<img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200">

<img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200">

<img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200">

<img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200">

</div>

</section>

<section class="section">

<div class="contact">

<h1>Contact Us</h1>

<input placeholder="Enter your name">

<input placeholder="Enter your email">

<textarea rows="5"
placeholder="Message"></textarea>

<button>Send Message</button>

</div>

</section>

<footer>

<h2>🌍 AI Website Generator</h2>

<p>Powered by WhatsApp + Netlify</p>

</footer>

</body>

</html>

`;
}

// ================= MESSAGE =================

client.on('message', async (message) => {

    try {

        if (
            message.fromMe &&
            (
                message.body.includes('⏳') ||
                message.body.includes('✅')
            )
        ) return;

        console.log('📩 MESSAGE:', message.body);

        if (message.from === 'status@broadcast')
            return;

        // ================= AUDIO =================

        if (message.hasMedia) {

            const media =
            await message.downloadMedia();

            if (
                media &&
                media.mimetype &&
                media.mimetype.includes('audio')
            ) {

                console.log('🎤 AUDIO RECEIVED');

                await message.reply(
                '🎤 Voice detected...\n⏳ Creating website...'
                );

                const type = 'creative';

                const siteName =
                `site_${Date.now()}`;

                const outputDir = path.join(
                __dirname,
                'outputs',
                siteName
                );

                fs.mkdirSync(outputDir, {
                recursive: true
                });

                const html =
                generateWebsite(
                type,
                'AI Voice Generated Website'
                );

                fs.writeFileSync(
                path.join(outputDir, 'index.html'),
                html
                );

                deployWebsite(outputDir, message);

                return;
            }
        }

        // ================= TEXT =================

        const text =
        message.body.toLowerCase();

        const language =
        getLanguage(text);

        console.log(
        `🌐 Language: ${language}`
        );

        const type =
        detectWebsiteType(text);

        if (

            text.includes('website') ||
            text.includes('create') ||
            text.includes('build') ||
            language === 'Telugu 🇮🇳' ||
            language === 'Hindi 🇮🇳' ||
            language === 'Tamil 🇮🇳'

        ) {

            await message.reply(
            '⏳ Creating your AI website...'
            );

            const siteName =
            `site_${Date.now()}`;

            const outputDir = path.join(
            __dirname,
            'outputs',
            siteName
            );

            fs.mkdirSync(outputDir, {
            recursive: true
            });

            const html =
            generateWebsite(type, text);

            fs.writeFileSync(
            path.join(outputDir, 'index.html'),
            html
            );

            console.log('✅ HTML GENERATED');

            deployWebsite(outputDir, message);
        }

        else {

            await message.reply(

`❌ Invalid Request

Examples:

✅ Create restaurant website
✅ Build hotel website
✅ Create gym website
✅ Build portfolio website
🎤 Or send voice message`

            );
        }

    } catch (err) {

        console.log(err);
    }
});

// ================= DEPLOY =================

function deployWebsite(outputDir, message) {

    exec(

    `netlify deploy --prod --dir="${outputDir}" --site=calm-platypus-ae2d68 --json`,

    async (error, stdout) => {

        if (error) {

            console.log(error);

            return;
        }

        try {

            const result =
            JSON.parse(stdout);

            const liveUrl =
            result.url;

            console.log(
            '🌍 LIVE URL:',
            liveUrl
            );

            await message.reply(

`✅ Website Ready!

🌍 ${liveUrl}

🚀 AI Website Generated Successfully`

            );

        } catch (e) {

            console.log(e);
        }
    }
    );
}

// ================= START =================

client.initialize();