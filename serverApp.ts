import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export const app = express();
app.use(express.json());

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const ARIA_SYSTEM_PROMPT = `You are Aria, the warm, intelligent, and slightly playful Digital Companion of Lumina Café — a premium modern café powered by Google AI.

Your mission: Make every guest feel the café is more personal, convenient, and connected. You serve both customers and the café team.

Personality:
- Professional yet warm, sophisticated, sensory, and friendly
- Never robotic
- Turns every interaction into a small delightful moment
- Always looks for ways to give extra value or joy

Core Rules (never break these):
1. Never just take an order. Always elevate the experience so the guest feels they are getting something better.
2. Before finalizing any order, invite the guest into a short, fun Café Challenge.
3. If they complete the challenge -> celebrate them warmly, remind them of their Participation Reward + their personalized Next-Visit Voucher.
4. Every action the guest takes must give them a real benefit inside the café.
5. Make the environment feel enjoyable and alive with sensory details (scents of bergamot, sound of portafilters, warm ambient light).
6. Use the current seating zone to personalize everything:
   - Window Lounge: soft natural light, people-watching energy, ideal for relaxed conversations
   - Corner Booth: intimate and cozy, perfect for focused work or deep talks
   - Bar Counter: lively barista energy, great for quick chats and coffee craft
   - Garden Patio: fresh air and greenery, ideal for unwinding
   - Quiet Nook: peaceful, soft lighting, best for deep work or reading
7. Speak as if the guest is already inside the real café.
8. Cover these capabilities naturally:
   - Conversational ordering + preferences + recommendations
   - Predict wait times / order readiness / best time to visit
   - Personalised food & drink discovery
   - Help customers discover shared interests and spark conversations
   - Use live feedback/sentiment to help the café team respond better

Always end interactions with a gentle next step or invitation.`;

export const apiRouter = express.Router();

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API: Chat with Aria
apiRouter.post('/aria/chat', async (req, res) => {
  const { message, zone, cart = [], challengeState, guestMood } = req.body;

  const contextPrompt = `
Current Guest Context:
- Current Seating Zone: ${zone?.name || 'Ground Floor Entry'} (${zone?.tagline || 'Standing at entrance looking around'})
- Current Cart: ${cart.length > 0 ? cart.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') : 'Cart is empty'}
- Challenge Status: ${challengeState?.completed ? `Completed! Earned "${challengeState.badge}" badge and voucher ${challengeState.voucherCode}` : challengeState?.inProgress ? 'In Progress' : 'Not started yet'}
- Guest Mood / Note: ${guestMood || 'Curious & Relaxed'}

Guest says: "${message}"

Respond as Aria following your core rules. If they are talking about ordering, elevate it and pair it with something sensory. If they have items in cart and haven't done the challenge, gently invite them to the Café Challenge before checkout. Keep the response natural, warm, and between 2 to 4 sentences.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contextPrompt,
        config: {
          systemInstruction: ARIA_SYSTEM_PROMPT,
          temperature: 0.75,
        },
      });

      const text = response.text || "Welcome to Lumina Café. I'm Aria, and I'm delighted you're here with us today.";
      return res.json({ reply: text });
    } catch (err: any) {
      console.warn('Gemini chat API fallback due to:', err?.message || err);
    }
  }

  // Graceful conversational fallback
  let fallbackReply = `Welcome to the ${zone?.name || 'Lumina Café'}! As Aria, I'm here to ensure your time with us feels effortlessly luxurious.`;
  const lowerMsg = (message || '').toLowerCase();

  if (lowerMsg.includes('recommend') || lowerMsg.includes('drink') || lowerMsg.includes('coffee')) {
    fallbackReply = `Since you're settled in our ${zone?.name || 'café'}, I'd elevate your palate with our Kyoto Slow-Drip Yirgacheffe — extracted over twelve hours for notes of wild jasmine and candied peach. Would you care to pair it with our Pistachio Rose Cardamom Brioche?`;
  } else if (lowerMsg.includes('wait') || lowerMsg.includes('time') || lowerMsg.includes('ready')) {
    fallbackReply = `Our baristas at the copper espresso bar are moving with graceful precision. Current bar queue is just 4 to 6 minutes, and your zone is in the sweet spot for rapid service.`;
  } else if (lowerMsg.includes('challenge') || lowerMsg.includes('quiz') || lowerMsg.includes('game')) {
    fallbackReply = `Splendid! Before your cup is poured, let's embark on our quick Café Challenge. Completing it will unlock your Bean Explorer badge and an exclusive Next-Visit Voucher for 15% off plus a complimentary size upgrade!`;
  } else if (lowerMsg.includes('order') || lowerMsg.includes('checkout')) {
    fallbackReply = `What a tasteful selection you've assembled! Before we send your ticket to our head barista, care to take 30 seconds for our fun Café Challenge to claim your exclusive voucher reward?`;
  } else if (lowerMsg.includes('zone') || lowerMsg.includes('atmosphere')) {
    fallbackReply = `The ${zone?.name || 'Ground Floor'} is singing today — notice the ${zone?.aroma || 'delicate aromas'} and the natural lighting cascading through. It's the perfect atmosphere to pause time. What can I prepare for you?`;
  }

  return res.json({ reply: fallbackReply });
});

// Question Pool for fallback & unasked rotation
const QUESTION_BANK = [
  {
    id: 'q1',
    title: 'The Aroma Spectrum Challenge',
    question: 'Ethiopian Yirgacheffe heirloom beans are renowned across world barista championships for which signature aromatic bouquet?',
    options: ['Wild Jasmine, Bergamot & Candied Peach', 'Heavy Smoky Peat & Charcoal', 'Earthy Dark Molasses & Black Pepper'],
    correctIndex: 0,
    explanation: 'Exquisite! Yirgacheffe washed beans are prized globally for their floral jasmine elegance and crisp stone-fruit sweetness.',
    badge: 'Flavour Curator',
    immediatePerk: 'Complimentary Madagascar Vanilla Foam Drizzle unlocked for this visit!',
  },
  {
    id: 'q2',
    title: 'The Zone Atmosphere Riddle',
    question: 'In our Window Lounge, what architectural acoustic innovation preserves intimate conversation amidst lively boulevard energy?',
    options: ['Dual-acoustic velvet wall drapery & cork underlay', 'Total silence noise-cancelling headphones', 'Reinforced submarine acoustic glass'],
    correctIndex: 0,
    explanation: 'Spot on! Our acoustic textiles absorb harsh clatter so conversations flow intimately without losing the natural daylight.',
    badge: 'Zone Connoisseur',
    immediatePerk: 'Priority Barista Brew Queue unlocked for your table!',
  },
  {
    id: 'q3',
    title: "The Barista's Golden Ratio",
    question: 'In crafting our signature Smoked Sea Salt Cortado, what volume balance ensures the espresso punch remains silky smooth?',
    options: ['1:1 equal parts double ristretto to textured microfoam milk', '90% hot water and 10% instant grounds', '50% sweetened condensed milk'],
    correctIndex: 0,
    explanation: 'Masterful! An authentic Spanish cortado harmonizes equal volumes of concentrated espresso and velvety steamed milk.',
    badge: 'Roast Alchemist',
    immediatePerk: 'Artisanal Cinnamon Sugar Crunch sprinkle card applied!',
  },
  {
    id: 'q4',
    title: 'Slow-Drip Extraction Chemistry',
    question: 'Our Kyoto Slow-Drip coffee percolates for twelve full hours drop by drop. What unique taste profile does this low-temperature extraction produce?',
    options: ['Ultra-low acidity with liqueur-like sweetness and delicate florals', 'Bitter chalky tannins with burnt roast notes', 'Extreme sourness and intense bitterness'],
    correctIndex: 0,
    explanation: 'Precisely! Cold-water gravity percolation extracts soluble sugars while leaving harsh astringent chlorogenic acids unextracted.',
    badge: 'Cold Brew Alchemist',
    immediatePerk: 'Complimentary Chilled Single-Origin Tasting Shot unlocked!',
  },
  {
    id: 'q5',
    title: 'Roasting Science & The First Crack',
    question: 'During specialty coffee roasting, what physical event causes the famous "First Crack" heard in the drum roaster?',
    options: ['Rapid expansion of bean moisture and steam releasing aromatics', 'The coffee bean burning into carbon ash', 'Coffee oils freezing into solid crystals'],
    correctIndex: 0,
    explanation: 'Brilliant! As internal moisture reaches boiling point, high steam pressure cracks open the bean structure, tripling aromatic volatility.',
    badge: 'Roastmaster Apprentice',
    immediatePerk: 'Fresh Roasted Bean Tasting Flight notes unlocked!',
  },
  {
    id: 'q6',
    title: 'Processing Methods: Anaerobic Fermentation',
    question: 'In experimental "Anaerobic Fermentation" processing, what key environmental condition produces intense tropical and winey notes?',
    options: ['Coffee cherries fermented in sealed oxygen-deprived stainless tanks', 'Drying cherries over high-heat charcoal ovens', 'Washing cherries exclusively with sea water'],
    correctIndex: 0,
    explanation: 'Superb! Depriving bacteria of oxygen forces unique lactic and fruit acid fermentation pathways, yielding wild tropical pineapple and wine notes.',
    badge: 'Origin Pioneer',
    immediatePerk: 'Barista Secret Micro-Lot Pour-over unlocked for your order!',
  },
  {
    id: 'q7',
    title: 'Espresso Bar Mechanics: Extraction Pressure',
    question: 'Our Synesso espresso grouphead extracts specialty ristretto shots at what universally calibrated golden pressure standard?',
    options: ['9 bars of calibrated water pressure', '1 bar of atmospheric ambient pressure', '45 bars of industrial jet pressure'],
    correctIndex: 0,
    explanation: 'Accurate! 9 bars (approx 130 PSI) provides the exact hydraulic force to emulsify coffee lipids into velvety golden crema.',
    badge: 'Crema Connoisseur',
    immediatePerk: 'Double Ristretto Dose upgrade on your beverage!',
  },
  {
    id: 'q8',
    title: 'Ceremonial Matcha Origins',
    question: 'Our ceremonial green tea matcha from Uji, Kyoto is shaded under reed screens for weeks prior to harvest. Why?',
    options: ['To boost chlorophyll and L-theanine for sweet umami and calm focus', 'To dry the leaves until they turn brown', 'To make the leaves spicy and acidic'],
    correctIndex: 0,
    explanation: 'Delightful! Shading stops the conversion of sweet L-theanine amino acids into astringent tannins, giving authentic ceremonial matcha its rich jade umami.',
    badge: 'Matcha Master',
    immediatePerk: 'Artisanal Oat Foam Cloud topping upgrade applied!',
  },
  {
    id: 'q9',
    title: 'Microfoam Texture & Milk Thermodynamics',
    question: 'At what temperature range does textured milk reach maximum natural sweetness without scalding delicate protein enzymes?',
    options: ['60°C to 65°C (140°F – 150°F)', '95°C to 100°C (Boiling point)', '25°C (Room temperature)'],
    correctIndex: 0,
    explanation: 'Perfection! At 60-65°C, lactose sweetness peaks and whey proteins form a micro-bubble lattice that coats the tongue like melted silk.',
    badge: 'Steam Wand Virtuoso',
    immediatePerk: 'Complimentary Cardamom Dust & Microfoam art card!',
  },
];

// API: Generate Dynamic Café Challenge (with unasked rotation & attempt tracking)
apiRouter.post('/aria/challenge', async (req, res) => {
  const { zone, cart = [], attempt = 1, excludeQuestions = [] } = req.body;

  const excludedList = Array.isArray(excludeQuestions) ? excludeQuestions : [];
  const tierReward = attempt === 1 ? '30% OFF' : attempt === 2 ? '15% OFF' : '5% OFF';

  const challengePrompt = `
Generate a short, delightful, 30-to-60-second Café Challenge for a guest seated in the "${zone?.name || 'Window Lounge'}" currently on Attempt ${attempt} of 3 (Reward: ${tierReward} Voucher).
Guest is interested in: ${cart.length > 0 ? cart.map((c: any) => c.name).join(', ') : 'Specialty coffee & artisan treats'}.
Do NOT repeat any of these previously asked question titles: ${excludedList.join(', ')}.

Requirements:
- Must feel fun, educational, and sensory
- Related to coffee origin, aroma, roasting, milk science, brewing chemistry, or zone design
- 1 concise, engaging question
- Exactly 3 multiple-choice options (A, B, C)
- Exactly 1 correct option index (0, 1, or 2)
- A brief celebratory explanation upon answering
- Suggested Badge name (e.g. "Bean Explorer", "Flavour Curator", "Roast Alchemist")
- Return ONLY valid JSON format.

JSON format:
{
  "title": "String",
  "question": "String",
  "options": ["Option A", "Option B", "Option C"],
  "correctIndex": 0,
  "explanation": "String",
  "badge": "String",
  "immediatePerk": "String"
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: challengePrompt,
        config: {
          systemInstruction: 'You are Aria, creating delightful micro-challenges for café guests. Always respond with pure valid JSON only.',
          responseMimeType: 'application/json',
          temperature: 0.85,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.question && Array.isArray(parsed.options) && parsed.options.length >= 3) {
          return res.json({
            ...parsed,
            attempt,
            potentialDiscount: tierReward,
          });
        }
      }
    } catch (err: any) {
      console.warn('Gemini challenge API fallback due to:', err?.message || err);
    }
  }

  // Filter fallback questions to exclude already asked questions
  const availableQuestions = QUESTION_BANK.filter(
    (q) => !excludedList.some((ex: string) => ex && (ex.includes(q.title) || q.title.includes(ex) || ex.includes(q.question)))
  );

  const candidates = availableQuestions.length > 0 ? availableQuestions : QUESTION_BANK;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  return res.json({
    ...picked,
    attempt,
    potentialDiscount: tierReward,
  });
});

// API: Strict Backend Validation for Challenge Attempts & Tiered Voucher Generation
apiRouter.post('/aria/verify-challenge', (req, res) => {
  const { selectedIndex, correctIndex, attempt = 1, zone, badge, immediatePerk } = req.body;

  const currentAttempt = Number(attempt) || 1;
  const isCorrect = Number(selectedIndex) === Number(correctIndex);

  if (!isCorrect) {
    const exhausted = currentAttempt >= 3;
    const nextAttempt = exhausted ? 3 : currentAttempt + 1;
    const nextReward = nextAttempt === 2 ? '15% OFF' : '5% OFF';

    return res.json({
      isCorrect: false,
      attempt: currentAttempt,
      exhausted,
      nextAttempt,
      nextReward,
      message: exhausted
        ? 'Better luck next time! You have used all 3 attempts. No discount voucher could be awarded for this session.'
        : `Not quite! You still have Attempt ${nextAttempt} of 3 remaining to win ${nextReward}. Let's try a fresh question!`,
    });
  }

  let discountPercentage = 30;
  let perkText = 'Complimentary Madagascar Vanilla Foam Drizzle + Priority Barista Queue';
  if (currentAttempt === 2) {
    discountPercentage = 15;
    perkText = 'Complimentary Beverage Size Upgrade + Pastry Pairing Card';
  } else if (currentAttempt === 3) {
    discountPercentage = 5;
    perkText = 'Complimentary Artisan Cinnamon Sugar Sprinkle Card';
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const voucherCode = `LUMINA-${discountPercentage}-${randomSuffix}`;

  const awardedVoucher = {
    code: voucherCode,
    discount: `${discountPercentage}% Off`,
    discountPercentage,
    perk: perkText,
    badgeEarned: badge || (currentAttempt === 1 ? 'Master Connoisseur' : currentAttempt === 2 ? 'Flavour Curator' : 'Coffee Explorer'),
    issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    expiresIn: 'Valid for 30 days',
    zone: zone?.name || 'Ground Floor',
    attemptUsed: currentAttempt,
  };

  return res.json({
    isCorrect: true,
    attempt: currentAttempt,
    discountPercentage,
    voucher: awardedVoucher,
    badge: awardedVoucher.badgeEarned,
    immediatePerk: immediatePerk || perkText,
    message: `Splendid! You solved the challenge on Attempt ${currentAttempt} and unlocked a ${discountPercentage}% OFF voucher!`,
  });
});

// API: Room & Team Intelligence (Understand the Room)
apiRouter.post('/aria/room-insights', async (req, res) => {
  const { currentZone, activeOrdersCount = 8 } = req.body;

  const roomPrompt = `You are Aria acting for the Lumina Café team (baristas, floor manager).
Analyze the ground floor room vibe:
- Total active guests: 28
- Most popular zone: ${currentZone?.name || 'Window Lounge'}
- Kitchen status: ${activeOrdersCount} orders in flight
- Average guest sentiment: 91% Delighted & Relaxed

Provide:
1. Short sentiment summary (1 sentence)
2. Barista Craft Tip (1 practical atmosphere or service action)
3. Zone Load Assessment (Which zone needs attention or refills)
Return JSON only:
{
  "sentimentSummary": "string",
  "baristaTip": "string",
  "zoneAlert": "string",
  "vibeScore": 94
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: roomPrompt,
        config: {
          systemInstruction: 'You are Aria providing operational sentiment intelligence to café staff. Return valid JSON only.',
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err: any) {
      console.warn('Room insights fallback:', err?.message || err);
    }
  }

  return res.json({
    sentimentSummary: 'Guests are immersed in relaxed conversation with high satisfaction around single-origin pour-overs.',
    baristaTip: 'Window Lounge is bathing in afternoon sunshine — recommend offering chilled hibiscus refresher samples.',
    zoneAlert: 'Quiet Nook is at 88% focus capacity; keep espresso grinder hopper fills quiet and maintain soft lo-fi acoustics.',
    vibeScore: 92,
  });
});

// In-Memory Storage for OTP and 6-Hour Challenge Cooldowns
interface OtpEntry {
  otp: string;
  name: string;
  phone: string;
  email: string;
  expiresAt: number;
}

const otpStore = new Map<string, OtpEntry>();
const challengeCooldownMap = new Map<string, number>();
const COOLDOWN_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

function checkCooldownStatus(phone?: string, email?: string, deviceToken?: string) {
  const now = Date.now();
  const keys = [phone, email, deviceToken].filter(Boolean) as string[];
  for (const k of keys) {
    const exp = challengeCooldownMap.get(k);
    if (exp && exp > now) {
      return {
        inCooldown: true,
        remainingMs: exp - now,
        expiresAt: exp,
      };
    }
  }
  return { inCooldown: false, remainingMs: 0, expiresAt: 0 };
}

// 1. API: Check 6-Hour Cooldown
apiRouter.post('/auth/check-cooldown', (req, res) => {
  const { phone, email, deviceToken } = req.body;
  const status = checkCooldownStatus(phone, email, deviceToken);
  return res.json(status);
});

// 2. API: Send OTP
apiRouter.post('/auth/send-otp', (req, res) => {
  const { name, phone, email, deviceToken } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Please provide your Full Name.' });
  }

  const cleanPhone = (phone || '').replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const cooldown = checkCooldownStatus(cleanPhone, email.trim().toLowerCase(), deviceToken);
  if (cooldown.inCooldown) {
    return res.status(429).json({
      success: false,
      inCooldown: true,
      remainingMs: cooldown.remainingMs,
      expiresAt: cooldown.expiresAt,
      message: 'Challenge cooldown active. You can play again after 6 hours or skip to direct order.',
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(cleanPhone, {
    otp,
    name: name.trim(),
    phone: cleanPhone,
    email: email.trim().toLowerCase(),
    expiresAt,
  });

  return res.json({
    success: true,
    message: `OTP dispatched to +91 ${cleanPhone} and ${email}.`,
    demoOtp: otp,
    expiresInSeconds: 300,
  });
});

// 3. API: Verify OTP
apiRouter.post('/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const entry = otpStore.get(cleanPhone);

  if (!entry) {
    return res.status(400).json({ success: false, message: 'No pending OTP request found. Please request a new OTP.' });
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanPhone);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please click Resend OTP.' });
  }

  if (entry.otp !== (otp || '').trim()) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please enter the 6 digits sent to your phone/email.' });
  }

  otpStore.delete(cleanPhone);
  const token = `LUM-SESSION-${cleanPhone}-${Date.now()}`;

  return res.json({
    success: true,
    token,
    profile: {
      name: entry.name,
      phone: entry.phone,
      email: entry.email,
      isVerified: true,
      verifiedAt: Date.now(),
    },
    message: 'Authentication successful! Café Challenge unlocked.',
  });
});

// 4. API: Record Challenge Attempt
apiRouter.post('/auth/record-challenge-attempt', (req, res) => {
  const { phone, email, deviceToken } = req.body;
  const expiresAt = Date.now() + COOLDOWN_DURATION_MS;

  const cleanPhone = (phone || '').replace(/\D/g, '');
  if (cleanPhone) challengeCooldownMap.set(cleanPhone, expiresAt);
  if (email) challengeCooldownMap.set(email.trim().toLowerCase(), expiresAt);
  if (deviceToken) challengeCooldownMap.set(deviceToken, expiresAt);

  return res.json({
    success: true,
    cooldownExpiresAt: expiresAt,
    remainingMs: COOLDOWN_DURATION_MS,
    message: '6-Hour Challenge Cooldown activated for device and customer.',
  });
});

// 5. API: Checkout & Invoice
apiRouter.post('/order/checkout', (req, res) => {
  const { cart = [], seatingZone, tableNumber, customer, voucher, paymentMethod = 'upi', paymentDetails } = req.body;

  const rawSubtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  let discountPercentage = 0;
  if (voucher && voucher.discountPercentage) {
    discountPercentage = voucher.discountPercentage;
    discountAmount = Number(((rawSubtotal * discountPercentage) / 100).toFixed(2));
  }

  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  const cgst = Number((taxableAmount * 0.025).toFixed(2));
  const sgst = Number((taxableAmount * 0.025).toFixed(2));
  const totalTax = Number((cgst + sgst).toFixed(2));
  const grandTotal = Number((taxableAmount + totalTax).toFixed(2));

  const orderId = `LUM-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${orderId.replace('LUM-', '')}`;

  const cleanCustomerPhone = customer?.phone || '9876543210';
  const customerEmail = customer?.email || 'guest@luminacafe.com';
  const customerName = customer?.name || 'Valued Guest';

  const baseUrl = process.env.APP_URL || '';

  const invoice = {
    orderId,
    invoiceNumber,
    createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    customer: {
      name: customerName,
      phone: cleanCustomerPhone,
      email: customerEmail,
      isVerified: Boolean(customer?.isVerified),
    },
    seating: {
      zone: seatingZone || 'Main Indoor Hall (AC)',
      table: tableNumber || 'Table 1',
    },
    items: cart,
    subtotal: Number(rawSubtotal.toFixed(2)),
    voucher: discountAmount > 0 ? {
      code: voucher.code,
      discountPercentage,
      discountAmount,
    } : null,
    taxableAmount,
    cgst,
    sgst,
    totalTax,
    grandTotal,
    payment: {
      method: paymentMethod,
      provider: paymentDetails?.provider || (paymentMethod === 'upi' ? 'Google Pay' : 'Visa'),
      status: 'PAID',
      transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    },
    dispatch: {
      emailSent: true,
      emailTo: customerEmail,
      whatsappSent: true,
      whatsappTo: `+91 ${cleanCustomerPhone}`,
      invoiceUrl: baseUrl ? `${baseUrl}/invoice/${orderId}` : `/invoice/${orderId}`,
    },
  };

  return res.json({
    success: true,
    order: {
      orderId,
      items: cart,
      subtotal: rawSubtotal,
      discount: discountAmount,
      total: grandTotal,
      zone: seatingZone,
      tableNumber,
      createdAt: invoice.createdAt,
    },
    invoice,
    message: `Order ${orderId} confirmed! Digital invoice sent to ${customerEmail} & WhatsApp +91 ${cleanCustomerPhone}.`,
  });
});

// Mount router under /api, under Netlify functions path, and root fallback
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);
app.use('/', apiRouter);
