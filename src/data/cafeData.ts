export interface Zone {
  id: string;
  name: string;
  shortDesc: string;
  tagline: string;
  detailedAtmosphere: string;
  lightProfile: string;
  soundscape: string;
  decibels: number;
  aroma: string;
  idealFor: string;
  occupancyPercent: number;
  temperature: string;
  mapCoords: { x: number; y: number; width: number; height: number };
  accentColor: string;
  recommendedPairingIds: string[];
  imageUrl: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'brews' | 'espresso' | 'pastries' | 'savory' | 'elixirs';
  price: number;
  tagline: string;
  story: string;
  origin: string;
  tastingNotes: string[];
  dietaryTags: string[];
  waitTimeMinutes: number;
  pairedItemId?: string;
  pairingReason?: string;
  elevationTip: string;
  badgeHighlight?: string;
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customization?: string;
}

export interface Voucher {
  code: string;
  discount: string;
  discountPercentage?: number;
  perk: string;
  badgeEarned: string;
  issuedAt: string;
  expiresIn: string;
  zone: string;
  attemptUsed?: number;
}

export interface GuestConnection {
  id: string;
  pseudonym: string;
  zoneId: string;
  currentVibe: string;
  topic: string;
  currentDrink: string;
  icebreaker: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  isVerified?: boolean;
  verifiedAt?: number;
}

export interface SeatingSelection {
  zone: Zone;
  tableNumber: string;
}

export interface InvoiceData {
  orderId: string;
  invoiceNumber: string;
  createdAt: string;
  customer: CustomerProfile;
  seating: {
    zone: string;
    table: string;
  };
  items: CartItem[];
  subtotal: number;
  voucher?: {
    code: string;
    discountPercentage: number;
    discountAmount: number;
  } | null;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  totalTax: number;
  grandTotal: number;
  payment: {
    method: 'upi' | 'card';
    provider?: string;
    status: 'PAID' | 'COMPLETED';
    transactionId: string;
  };
  dispatch: {
    emailSent: boolean;
    emailTo: string;
    whatsappSent: boolean;
    whatsappTo: string;
    invoiceUrl: string;
  };
}

export const ZONES: Zone[] = [
  {
    id: 'main-indoor-hall',
    name: 'Main Indoor Hall (AC)',
    shortDesc: 'Climate-controlled elegance & soft natural daylight',
    tagline: 'Climate-controlled comfort, gentle ambient music, and plush seating',
    detailedAtmosphere: 'Step into serene, air-conditioned bliss. Natural sunlight softly filters through floor-to-ceiling glass, illuminating fluted oak pillars and comfortable velvet armchairs.',
    lightProfile: 'Sun-dappled Amber (4000K daylight warmth)',
    soundscape: 'Gentle conversational hum & soft acoustic guitar',
    decibels: 52,
    aroma: 'Sweet bergamot steam, roasted hazelnuts & fresh morning drizzle',
    idealFor: 'Casual dining, family gatherings, relaxed conversations & daytime meetings',
    occupancyPercent: 78,
    temperature: '21.5°C — Climate Controlled',
    mapCoords: { x: 5, y: 10, width: 32, height: 42 },
    accentColor: '#F59E0B',
    recommendedPairingIds: ['kyoto-slow-drip', 'pistachio-brioche'],
    imageUrl: '/images/zone_window_lounge.jpg',
  },
  {
    id: 'balcony-rooftop',
    name: 'Open-Air Balcony / Rooftop',
    shortDesc: 'Panoramic open-sky breeze with boulevard skyline views',
    tagline: 'Fresh breeze, elevated vantage point, and vibrant skyline scenery',
    detailedAtmosphere: 'Perched high above the city avenue. Golden hour breezes rustle through perimeter planter boxes, while warm fairy canopy lanterns glow against the evening sky.',
    lightProfile: 'Open Sky Horizon with warm fairy lantern glow',
    soundscape: 'Breezy ambient chimes, city murmur & upbeat lo-fi rhythms',
    decibels: 58,
    aroma: 'Fresh citrus blossoms, roasted espresso crema & cool twilight breeze',
    idealFor: 'Sunset coffee dates, scenic social catch-ups & relaxed open-air chilling',
    occupancyPercent: 86,
    temperature: '23.8°C — Fresh Open Breeze',
    mapCoords: { x: 68, y: 10, width: 28, height: 40 },
    accentColor: '#EC4899',
    recommendedPairingIds: ['cardamom-cold-brew', 'citrus-olive-cake'],
    imageUrl: '/images/hero_cafe.jpg',
  },
  {
    id: 'garden-patio',
    name: 'Garden Patio',
    shortDesc: 'Botanical sanctuary surrounded by lush olive trees & fountain',
    tagline: 'Fresh air, shaded greenery, and limestone fountain tranquility',
    detailedAtmosphere: 'Surrounded by potted mature olive trees, fragrant climbing jasmine, and the hypnotic trickle of a hand-carved limestone fountain. A tranquil outdoor oasis.',
    lightProfile: 'Dappled Sunlight through green foliage canopy',
    soundscape: 'Rustling olive foliage, birdsong & soothing stone water fountain',
    decibels: 48,
    aroma: 'Wild Provencal lavender, fresh crushed mint & citrus blossom',
    idealFor: 'Unwinding with cold brews, mindful reading & sunny brunch dates',
    occupancyPercent: 65,
    temperature: '24.2°C — Open Breeze',
    mapCoords: { x: 5, y: 56, width: 35, height: 38 },
    accentColor: '#10B981',
    recommendedPairingIds: ['cardamom-cold-brew', 'avocado-tartine'],
    imageUrl: '/images/zone_garden_patio.jpg',
  },
  {
    id: 'work-pods',
    name: 'Work Pods / Private Lounge',
    shortDesc: 'Acoustic velvet pods with high-speed ports for deep focus',
    tagline: 'Quiet sanctuary, high-speed power ports, and ergonomic focus zones',
    detailedAtmosphere: 'Designed for makers and deep thinkers. Acoustically treated walnut alcoves, ergonomic seating, dedicated power outlets, and individual dimmable brass task lamps.',
    lightProfile: 'Focused Warm Task Lighting (3000K warm linen)',
    soundscape: 'Acoustically dampened sub-40dB cocoon with subtle tape loops',
    decibels: 38,
    aroma: 'Smoked bourbon vanilla bean, aged cedar & dark cocoa',
    idealFor: 'Deep strategic work, video calls, coding sessions & confidential talks',
    occupancyPercent: 92,
    temperature: '21.0°C — Quiet Sanctuary',
    mapCoords: { x: 68, y: 54, width: 28, height: 42 },
    accentColor: '#8B5CF6',
    recommendedPairingIds: ['smoked-flat-white', 'truffle-ricotta-toast'],
    imageUrl: '/images/zone_quiet_nook.jpg',
  },
  {
    id: 'takeaway-counter',
    name: 'Takeaway / Counter Pickup',
    shortDesc: 'Fast-lane barista counter for espresso on the move',
    tagline: 'Express pickup station, barista craft banter, and rapid takeaway',
    detailedAtmosphere: 'Front-row seat to our dual Synesso espresso station. Watch our head roasters tamp, extract, and steam with lightning precision for guests on the go.',
    lightProfile: 'Sleek Barista Spotlights (3500K crisp clarity)',
    soundscape: 'Rhythmic portafilter knocks, crisp steam wands & espresso bar energy',
    decibels: 66,
    aroma: 'Freshly ground Ethiopian heirloom beans & caramelized oat sugar',
    idealFor: 'Quick grab-and-go, morning rush pickups & takeaway orders',
    occupancyPercent: 55,
    temperature: '22.0°C — Active Station',
    mapCoords: { x: 38, y: 35, width: 28, height: 32 },
    accentColor: '#06B6D4',
    recommendedPairingIds: ['lavender-cortado', 'pistachio-brioche'],
    imageUrl: '/images/zone_bar_counter.jpg',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'kyoto-slow-drip',
    name: 'Kyoto 12-Hour Slow Drip Yirgacheffe',
    category: 'brews',
    price: 7.5,
    tagline: 'Extracted drop-by-drop through ice towers for pure stone-fruit clarity',
    story: 'Harvested from heirloom trees at 2,100m elevation in the misty hills of Yirgacheffe, Ethiopia. Slowly steeped drop-by-drop through handblown glass towers over twelve unhurried hours.',
    origin: 'Gedeo Zone, Yirgacheffe, Ethiopia (Natural Anaerobic)',
    tastingNotes: ['Wild Jasmine Bloom', 'Candied Bergamot', 'White Peach Nectar'],
    dietaryTags: ['Vegan', 'Single-Origin', 'Cold Crafted'],
    waitTimeMinutes: 3,
    pairedItemId: 'citrus-olive-cake',
    pairingReason: 'The bright bergamot acidity mirrors the candied Meyer lemon glaze in our olive oil cake.',
    elevationTip: 'Aria recommends swirling twice in the tulip snifter before sipping to awaken the delicate floral aromatics.',
    badgeHighlight: 'Bean Explorer Pick',
    imageUrl: '/images/menu_kyoto_slow_drip.jpg',
  },
  {
    id: 'smoked-flat-white',
    name: 'Smoked Maldon Sea Salt Flat White',
    category: 'espresso',
    price: 6.8,
    tagline: 'Double ristretto with oat microfoam & smoked salt flake crown',
    story: 'A tribute to artisanal contrast. We extract an ultra-dense ristretto from our washed Colombian Huila roast, fold in micro-textured oat velvet, and crown it with hand-flaked Maldon sea salt smoked over aged oak chips.',
    origin: 'Huila, Colombia (Washed Pink Bourbon)',
    tastingNotes: ['Salted Caramel Truffle', 'Dark Cocoa Nib', 'Smoked Oak Sugar'],
    dietaryTags: ['Dairy-Free Available', 'Organic Oat', 'Barista Reserve'],
    waitTimeMinutes: 5,
    pairedItemId: 'pistachio-brioche',
    pairingReason: 'The salty savory edge balances the buttery floral notes of the pistachio rose brioche perfectly.',
    elevationTip: 'Do not stir immediately — let the smoked flakes dissolve on your tongue alongside the velvet microfoam.',
    badgeHighlight: 'Flavour Curator Favorite',
    imageUrl: '/images/menu_smoked_flat_white.jpg',
  },
  {
    id: 'lavender-cortado',
    name: 'Golden Hour Wild Lavender Cortado',
    category: 'espresso',
    price: 6.2,
    tagline: 'Equal parts single-origin espresso and milk infused with French lavender & raw honey',
    story: 'Balanced in equal proportions (1:1) in a heavy fluted glass. Infused gently with small-batch raw wildflower honey and organic Provence lavender blossom, never cloying, just effortlessly aromatic.',
    origin: 'Antioquia, Colombia & French Provence Herbs',
    tastingNotes: ['Wildflower Honey', 'Provence Lavender', 'Roasted Macadamia'],
    dietaryTags: ['Vegetarian', 'Artisan Syrup Free'],
    waitTimeMinutes: 4,
    pairedItemId: 'pistachio-brioche',
    pairingReason: 'Enhances the floral cardamom perfume for a sublime Mediterranean afternoon pairing.',
    elevationTip: 'Best enjoyed warm at the Bar Counter while admiring the espresso extraction.',
    imageUrl: '/images/menu_lavender_cortado.jpg',
  },
  {
    id: 'matcha-cloud-latte',
    name: 'Ceremonial Uji Matcha Cloud Latte',
    category: 'brews',
    price: 7.2,
    tagline: 'First-harvest Kyoto ceremonial matcha crowned with chilled salted vanilla cloud',
    story: 'Directly sourced from centuries-old family tea gardens in Uji, Kyoto. Ceremonial first-harvest tencha is stone-ground on site and whisked with bamboo chasen, then layered with an airy chilled coconut-vanilla froth.',
    origin: 'Uji, Kyoto Prefecture, Japan',
    tastingNotes: ['Sweet Umami', 'Fresh Spring Grass', 'Toasted Pine Nut Cream'],
    dietaryTags: ['Vegan', 'Antioxidant Rich', 'Low Glycemic'],
    waitTimeMinutes: 5,
    pairedItemId: 'citrus-olive-cake',
    pairingReason: 'The gentle sweet umami grounds the bright citrus vibrancy.',
    elevationTip: 'Drink through the cloud lid without a straw for the layered temperature contrast.',
    badgeHighlight: 'Mindful Sips',
    imageUrl: '/images/menu_matcha_cloud_latte.jpg',
  },
  {
    id: 'cardamom-cold-brew',
    name: 'Botanical Cardamom Cold Brew Tonic',
    category: 'elixirs',
    price: 6.9,
    tagline: 'Double-concentrate cold brew, handcrafted tonic, burnt rosemary & dehydrated blood orange',
    story: 'An effervescent afternoon revitalizer designed for our Garden Patio. Crisp botanical tonic infused with gentian root and crushed green cardamom, cut cleanly with a floating crown of single-origin cold brew.',
    origin: 'Sidama, Ethiopia & Mediterranean Botanicals',
    tastingNotes: ['Sparkling Citrus Zest', 'Crushed Green Cardamom', 'Crisp Herbaceous Tonic'],
    dietaryTags: ['Vegan', 'Gluten-Free', 'Zero Refined Sugar'],
    waitTimeMinutes: 4,
    pairedItemId: 'avocado-tartine',
    pairingReason: 'The sparkling citrus cut cleanses the palate between rich bites of avocado.',
    elevationTip: 'Gently press the burnt rosemary sprig into the glass to release fragrant pine oils.',
    badgeHighlight: 'Patio Dreamer Choice',
    imageUrl: '/images/menu_cardamom_cold_brew.jpg',
  },
  {
    id: 'pistachio-brioche',
    name: 'Bronte Pistachio & Persian Rose Brioche',
    category: 'pastries',
    price: 5.9,
    tagline: '72-hour fermented pastry, stone-ground Sicilian pistachio cream, candied rose petals',
    story: 'Laminated with cultured Normandy butter over three days. Filled generously with unctuous stone-ground pistachio paste from Mount Etna slopes and kissed with organic Damascus rosewater glaze.',
    origin: 'Bronte, Sicily (DOP Pistachios) & Normandy Butter',
    tastingNotes: ['Nutty Sweet Cream', 'Flaky Caramelized Butter', 'Damascus Rose Perfume'],
    dietaryTags: ['Vegetarian', 'Artisan Lamination'],
    waitTimeMinutes: 2,
    pairedItemId: 'smoked-flat-white',
    pairingReason: 'The crisp salt in the flat white cuts through the rich laminated butter layers.',
    elevationTip: 'Our team will warm this in the stone hearth oven for 30 seconds to melt the pistachio center.',
    badgeHighlight: 'Pastry Masterpiece',
    imageUrl: '/images/menu_pistachio_brioche.jpg',
  },
  {
    id: 'truffle-ricotta-toast',
    name: 'Wild Summer Truffle & Whipped Lemon Ricotta Tartine',
    category: 'savory',
    price: 12.5,
    tagline: '36-hour fermented sourdough, citrus-whipped ricotta, Umbrian truffle carpaccio & hazelnut crumble',
    story: 'Thick cut heirloom country sourdough toasted on olive oil hearth coals. Topped with whipped whole-milk lemon ricotta, freshly shaved Italian black summer truffle, toasted Oregon hazelnuts, and micro mountain thyme.',
    origin: 'Norcia, Umbria (Summer Truffles) & Local Artisan Dairy',
    tastingNotes: ['Earthy Forest Truffle', 'Bright Lemon Zest', 'Crisp Sourdough Crust'],
    dietaryTags: ['Vegetarian', 'Organic Ancient Grain'],
    waitTimeMinutes: 8,
    pairedItemId: 'kyoto-slow-drip',
    pairingReason: 'The clean clarity of cold drip cuts the savory umami of the truffle.',
    elevationTip: 'Aria notes this is the ultimate brain-fuel dish for focused sessions in our Corner Booth.',
    badgeHighlight: 'Chef Curated',
    imageUrl: '/images/menu_truffle_ricotta_toast.jpg',
  },
  {
    id: 'avocado-tartine',
    name: 'Heirloom Avocado Green Goddess Tartine',
    category: 'savory',
    price: 10.8,
    tagline: 'Smashed Hass avocado, tarragon-dill herb emulsion, quick-pickled shallots & toasted nigella seeds',
    story: 'Fresh Californian Hass avocados hand-crushed with sea salt and cold-pressed lime juice over toasted sprouted seeded sourdough. Finished with micro arugula, pickled pink shallots, and fragrant Egyptian nigella seeds.',
    origin: 'Ventura County, California & Ancient Sprouted Sourdough',
    tastingNotes: ['Creamy Herbaceous Umami', 'Tangy Pickled Shallot', 'Crunchy Nigella Seed'],
    dietaryTags: ['Vegan', 'Fiber Rich', 'Dairy-Free'],
    waitTimeMinutes: 7,
    pairedItemId: 'cardamom-cold-brew',
    pairingReason: 'Herbal notes in the emulsion pair harmoniously with the botanical tonic.',
    elevationTip: 'Enjoy out in the sun on the Garden Patio for peak crisp freshness.',
    imageUrl: '/images/menu_avocado_tartine.jpg',
  },
  {
    id: 'citrus-olive-cake',
    name: 'Meyer Lemon & Extra Virgin Olive Oil Teacake',
    category: 'pastries',
    price: 5.5,
    tagline: 'Tuscan cold-pressed EVOO crumb, Meyer lemon syrup glaze, sprinkled with thyme flowers',
    story: 'Moist and tender crumb made with single-estate unfiltered olive oil from Chianti and freshly grated organic California Meyer lemons. Delicately crowned with candied lemon peel and purple thyme blossom.',
    origin: 'Chianti, Tuscany (EVOO) & Ojai, California (Meyer Lemons)',
    tastingNotes: ['Grassy Green Olive Oil', 'Crisp Meyer Lemon Zest', 'Floral Honey Glaze'],
    dietaryTags: ['Dairy-Free', 'Vegetarian'],
    waitTimeMinutes: 2,
    pairedItemId: 'kyoto-slow-drip',
    pairingReason: 'Matches the stone-fruit and bergamot acidity of the Ethiopian beans.',
    elevationTip: 'Take a small sip of cold drip before each forkful to amplify the citrus blossom aroma.',
    imageUrl: '/images/menu_citrus_olive_cake.jpg',
  },
];

export const HOURLY_FLOW = [
  { hour: '07:00', label: '7 AM', load: 30, waitMin: 3, status: 'Gentle Dawn Calm' },
  { hour: '08:30', label: '8:30 AM', load: 85, waitMin: 7, status: 'Morning Commute Surge' },
  { hour: '10:00', label: '10 AM', load: 55, waitMin: 4, status: 'Sweet Spot Harmony' },
  { hour: '12:30', label: '12:30 PM', load: 90, waitMin: 8, status: 'Lunch Rush Peak' },
  { hour: '14:30', label: '2:30 PM', load: 60, waitMin: 5, status: 'Afternoon Creative Window' },
  { hour: '16:00', label: '4 PM', load: 40, waitMin: 3, status: 'Golden Hour Serenity' },
  { hour: '18:00', label: '6 PM', load: 35, waitMin: 3, status: 'Twilight Mellow Wind-down' },
];

export const MOCK_KINDRED_GUESTS: GuestConnection[] = [
  {
    id: 'guest-1',
    pseudonym: 'Architect in the Nook',
    zoneId: 'quiet-nook',
    currentVibe: 'Drafting spatial concepts & reading brutalist design monographs',
    topic: 'Architecture & Spatial AI',
    currentDrink: 'Kyoto 12-Hour Slow Drip',
    icebreaker: 'Ask them what inspired their favorite building or how spatial light shapes their thinking.',
  },
  {
    id: 'guest-2',
    pseudonym: 'Writer in the Corner',
    zoneId: 'corner-booth',
    currentVibe: 'Penning speculative fiction chapters with noise-cancelling headphones',
    topic: 'Speculative Sci-Fi & Creative Flow',
    currentDrink: 'Smoked Maldon Sea Salt Flat White',
    icebreaker: 'Ask what world they are currently building or what music soundtrack powers their writing.',
  },
  {
    id: 'guest-3',
    pseudonym: 'Botanist on the Patio',
    zoneId: 'garden-patio',
    currentVibe: 'Sketches of Mediterranean flora & sipping iced tonic',
    topic: 'Urban Greenery & Specialty Herbs',
    currentDrink: 'Botanical Cardamom Cold Brew Tonic',
    icebreaker: 'Ask which herb note they detected first in the cold brew tonic.',
  },
  {
    id: 'guest-4',
    pseudonym: 'Coffee Geek at the Bar',
    zoneId: 'bar-counter',
    currentVibe: 'Discussing anaerobic fermentation bean processing with our head barista',
    topic: 'Specialty Roasting & Processing',
    currentDrink: 'Golden Hour Lavender Cortado',
    icebreaker: 'Ask what surprised them most about washed vs anaerobic processing notes.',
  },
];
