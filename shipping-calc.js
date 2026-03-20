// ══════════════════════════════════════════════════════════════
//  GnA Ethnic Wears — Real Australia Post Shipping Calculator
//  Rates: Official AusPost International Post Guide, 1 July 2025
// ══════════════════════════════════════════════════════════════

// ── PRODUCT WEIGHTS (grams) — realistic ethnic wear weights ──
// Kurti (folded + poly bag + cardboard stiffener)
// Coord Set / 3pc suit (heavier — multiple pieces + dupatta)
const PRODUCT_WEIGHTS = {
  'sk': 350,   // Short Kurti
  'lk': 450,   // Long Kurti
  'cs': 600,   // Cord Set (top + bottom)
  '3p': 750,   // 3 Piece Suit (kurti + salwar + dupatta)
  'pw': 900,   // Party Wear 3 Piece Suit (heavier embroidery)
};

// ── AUSPOST ZONES ──
const AUSPOST_ZONES = {
  AU: 'AU',   // Domestic Australia
  NZ: 1,      // Zone 1
  // Zone 2 — Asia Pacific
  SG: 2, MY: 2, IN: 2, ID: 2, PH: 2, TH: 2, VN: 2, JP: 2, CN: 2,
  HK: 2, KR: 2, BD: 2, PK: 2, LK: 2, NP: 2, MV: 2, AE: 2, SA: 2,
  QA: 2, KW: 2, BH: 2, OM: 2, FJ: 2, PG: 2, WS: 2, TO: 2,
  // Zone 3 — US & Canada
  US: 3, CA: 3,
  // Zone 4 — UK, Europe & others (incl Russia, South Africa per AusPost)
  UK: 4, GB: 4, IE: 4, DE: 4, FR: 4, IT: 4, ES: 4, NL: 4, BE: 4,
  AT: 4, CH: 4, SE: 4, NO: 4, DK: 4, FI: 4, PT: 4, PL: 4, CZ: 4,
  HU: 4, RO: 4, GR: 4, ZA: 4, RU: 4, NG: 4, KE: 4, GH: 4, EG: 4,
  // Zone 5 — Rest of World
  OTHER: 5,
};

// ── DOMESTIC AUSTRALIA RATES (own packaging, 1 July 2025) ──
const AU_DOMESTIC = {
  standard: [
    { maxWeight: 250,  price: 9.70  },
    { maxWeight: 500,  price: 11.15 },
    { maxWeight: 1000, price: 15.25 },
    { maxWeight: 3000, price: 19.30 },
    { maxWeight: 5000, price: 23.30 },
  ],
  express: [
    { maxWeight: 250,  price: 12.70 },
    { maxWeight: 500,  price: 14.65 },
    { maxWeight: 1000, price: 19.25 },
    { maxWeight: 3000, price: 23.80 },
    { maxWeight: 5000, price: 31.80 },
  ],
};
const AU_FREE_THRESHOLD = 150; // AUD — free standard shipping over this

// ── INTERNATIONAL STANDARD RATES by weight & zone (AUD, 1 July 2025) ──
// Source: Australia Post International Post Charges Easy Guide, 1 July 2025
// Columns: Zone1(NZ), Zone2(AsiaPac), Zone3(US/CA), Zone4(UK/EU), Zone5(RoW)
const INTL_STANDARD = [
  { maxWeight: 250,  rates: [16.30, 19.95, 22.30, 27.50, 33.35] },
  { maxWeight: 500,  rates: [19.65, 26.00, 29.00, 34.40, 42.40] },
  { maxWeight: 1000, rates: [26.40, 38.15, 42.20, 48.30, 60.50] },
  { maxWeight: 1500, rates: [33.15, 50.30, 55.55, 62.15, 78.55] },
  { maxWeight: 2000, rates: [39.90, 62.45, 68.85, 76.00, 96.65] },
  // Every additional 500g after 2kg:
  // Zone1: +4.60, Zone2: +6.55, Zone3: +7.75, Zone4: +8.65, Zone5: +10.10
];
const INTL_EXTRA_500G = [4.60, 6.55, 7.75, 8.65, 10.10]; // per 500g above 2kg

// ── INTERNATIONAL EXPRESS RATES ──
const INTL_EXPRESS = [
  { maxWeight: 250,  rates: [null,  null,  null,  null,  null ] }, // use satchel rates
  { maxWeight: 500,  rates: [36.65, 43.00, 46.00, 51.40, 59.40] },
  { maxWeight: 1000, rates: [43.40, 55.15, 59.20, 65.30, 77.50] },
  { maxWeight: 2000, rates: [56.90, 79.45, 85.85, 93.00, 113.65] },
  { maxWeight: 5000, rates: [84.55, 118.90,132.35,144.80,183.70] },
];
const INTL_EXPRESS_EXTRA_500G = [6.65, 8.65, 9.75, 10.65, 12.10];

// ── DELIVERY TIMES ──
const DELIVERY_TIMES = {
  AU: { standard: '3–6 business days', express: '1–3 business days' },
  1:  { standard: '6–10 business days (NZ)', express: '3–5 business days (NZ)' },
  2:  { standard: '8–14 business days', express: '3–7 business days' },
  3:  { standard: '10–18 business days', express: '4–8 business days' },
  4:  { standard: '12–20 business days', express: '5–9 business days' },
  5:  { standard: '14–25 business days', express: '7–12 business days' },
};

// ── COUNTRY LIST FOR DROPDOWN ──
const COUNTRIES = [
  { code: 'AU', name: '🇦🇺 Australia', zone: 'AU' },
  { code: 'NZ', name: '🇳🇿 New Zealand', zone: 1 },
  { code: 'SG', name: '🇸🇬 Singapore', zone: 2 },
  { code: 'IN', name: '🇮🇳 India', zone: 2 },
  { code: 'MY', name: '🇲🇾 Malaysia', zone: 2 },
  { code: 'AE', name: '🇦🇪 UAE', zone: 2 },
  { code: 'JP', name: '🇯🇵 Japan', zone: 2 },
  { code: 'HK', name: '🇭🇰 Hong Kong', zone: 2 },
  { code: 'FJ', name: '🇫🇯 Fiji', zone: 2 },
  { code: 'PK', name: '🇵🇰 Pakistan', zone: 2 },
  { code: 'BD', name: '🇧🇩 Bangladesh', zone: 2 },
  { code: 'LK', name: '🇱🇰 Sri Lanka', zone: 2 },
  { code: 'SA', name: '🇸🇦 Saudi Arabia', zone: 2 },
  { code: 'US', name: '🇺🇸 United States', zone: 3 },
  { code: 'CA', name: '🇨🇦 Canada', zone: 3 },
  { code: 'GB', name: '🇬🇧 United Kingdom', zone: 4 },
  { code: 'IE', name: '🇮🇪 Ireland', zone: 4 },
  { code: 'DE', name: '🇩🇪 Germany', zone: 4 },
  { code: 'FR', name: '🇫🇷 France', zone: 4 },
  { code: 'IT', name: '🇮🇹 Italy', zone: 4 },
  { code: 'ES', name: '🇪🇸 Spain', zone: 4 },
  { code: 'NL', name: '🇳🇱 Netherlands', zone: 4 },
  { code: 'CH', name: '🇨🇭 Switzerland', zone: 4 },
  { code: 'SE', name: '🇸🇪 Sweden', zone: 4 },
  { code: 'ZA', name: '🇿🇦 South Africa', zone: 4 },
  { code: 'OTHER', name: '🌍 Other Country', zone: 5 },
];

// ── WEIGHT CALCULATION ──
function getProductWeight(productId) {
  const prefix = productId.substring(0, 2);
  return PRODUCT_WEIGHTS[prefix] || 500; // default 500g
}

function getTotalWeight(cartItems) {
  // Sum item weights + 100g packaging per parcel
  const itemWeight = cartItems.reduce((total, item) => {
    return total + (getProductWeight(item.id) * item.qty);
  }, 0);
  const packagingWeight = 100; // standard poly bag + cardboard
  return itemWeight + packagingWeight;
}

// ── DOMESTIC AU SHIPPING ──
function calcAUShipping(weightGrams, method = 'standard') {
  const table = method === 'express' ? AU_DOMESTIC.express : AU_DOMESTIC.standard;
  for (const tier of table) {
    if (weightGrams <= tier.maxWeight) return tier.price;
  }
  return table[table.length - 1].price; // 5kg cap
}

// ── INTERNATIONAL SHIPPING ──
function calcIntlShipping(weightGrams, zone, method = 'standard') {
  const zoneIdx = zone - 1; // zone 1 = index 0
  const table = method === 'express' ? INTL_EXPRESS : INTL_STANDARD;
  const extraPerHalfKg = method === 'express' ? INTL_EXPRESS_EXTRA_500G : INTL_EXTRA_500G;

  // Find bracket
  for (const tier of table) {
    if (weightGrams <= tier.maxWeight) {
      const rate = tier.rates[zoneIdx];
      return rate !== null ? rate : null;
    }
  }

  // Over 2kg — calculate additional 500g increments
  const base = table[table.length - 1];
  const baseWeight = base.maxWeight;
  const baseRate = base.rates[zoneIdx];
  const extraWeight = weightGrams - baseWeight;
  const extra500Blocks = Math.ceil(extraWeight / 500);
  return baseRate + (extra500Blocks * extraPerHalfKg[zoneIdx]);
}

// ── MAIN SHIPPING CALCULATOR ──
function calculateShipping(cartItems, countryCode, method = 'standard') {
  const zone = AUSPOST_ZONES[countryCode] || 5;
  const weightGrams = getTotalWeight(cartItems);
  const subtotal = cartItems.reduce((a, b) => a + (b.price * b.qty), 0);

  // Free AU standard shipping over threshold
  if (zone === 'AU' && method === 'standard' && subtotal >= AU_FREE_THRESHOLD) {
    return { price: 0, isFree: true, weight: weightGrams, zone };
  }

  let price;
  if (zone === 'AU') {
    price = calcAUShipping(weightGrams, method);
  } else {
    price = calcIntlShipping(weightGrams, zone, method);
  }

  return { price: price ? parseFloat(price.toFixed(2)) : null, isFree: false, weight: weightGrams, zone };
}

// ── GET DELIVERY TIMES ──
function getDeliveryTime(countryCode, method) {
  const zone = AUSPOST_ZONES[countryCode] || 5;
  const times = DELIVERY_TIMES[zone] || DELIVERY_TIMES[5];
  return times[method] || times.standard;
}

// ── RENDER COUNTRY OPTIONS ──
function renderCountryOptions(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select your country —</option>' +
    COUNTRIES.map(c => `<option value="${c.code}"${c.code === 'AU' ? ' selected' : ''}>${c.name}</option>`).join('');
}

// ── UPDATE CART SHIPPING DISPLAY ──
function updateCartSummary() {
  const country = document.getElementById('shippingCountryCart')?.value || 'AU';
  const method = document.querySelector('input[name="cartShipMethod"]:checked')?.value || 'standard';
  const result = calculateShipping(cart, country, method);
  const subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  const total = subtotal + (result.price || 0);

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('cartSubtotal', `AUD $${subtotal.toFixed(2)}`);
  setText('cartWeight', `${(result.weight / 1000).toFixed(2)} kg`);

  if (result.isFree) {
    setText('cartShipping', 'FREE 🎉');
  } else if (result.price === null) {
    setText('cartShipping', 'Contact us for rate');
  } else {
    setText('cartShipping', `AUD $${result.price.toFixed(2)}`);
  }
  setText('cartTotal', `AUD $${total.toFixed(2)}`);

  // Free shipping progress bar (AU only)
  const freeBar = document.getElementById('freeShipBar');
  const freeNote = document.getElementById('freeShipNote');
  if (country === 'AU' && freeBar && freeNote) {
    const pct = Math.min((subtotal / AU_FREE_THRESHOLD) * 100, 100);
    freeBar.style.display = 'block';
    freeBar.querySelector('.bar-fill').style.width = pct + '%';
    if (subtotal >= AU_FREE_THRESHOLD) {
      freeNote.textContent = '🎉 You qualify for FREE standard shipping in Australia!';
      freeNote.style.color = '#1B5E20';
    } else {
      const rem = (AU_FREE_THRESHOLD - subtotal).toFixed(2);
      freeNote.textContent = `Add AUD $${rem} more for FREE Australian shipping!`;
      freeNote.style.color = 'var(--rust)';
    }
  } else if (freeBar) {
    freeBar.style.display = 'none';
  }
}

// ── UPDATE CHECKOUT TOTALS ──
function updateCheckoutTotals() {
  const country = document.getElementById('checkoutCountry')?.value || 'AU';
  const method = document.querySelector('input[name="shippingMethod"]:checked')?.value || 'standard';
  const result = calculateShipping(cart, country, method);
  const resultExpress = calculateShipping(cart, country, 'express');
  const subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  const total = subtotal + (result.price || 0);
  const weightKg = (result.weight / 1000).toFixed(2);
  const zone = AUSPOST_ZONES[country] || 5;

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('coSubtotal', `AUD $${subtotal.toFixed(2)}`);
  setText('coTotal', `AUD $${total.toFixed(2)}`);
  setText('coWeight', `Parcel weight: ~${weightKg} kg`);

  // Standard shipping option
  const stdPrice = document.getElementById('stdShipPrice');
  const stdInfo = document.getElementById('stdShipLabel');
  const stdTime = getDeliveryTime(country, 'standard');
  if (stdPrice) stdPrice.textContent = result.isFree ? 'FREE 🎉' : (result.price !== null ? `AUD $${result.price.toFixed(2)}` : 'N/A');
  if (stdInfo) stdInfo.innerHTML = `<h4>Standard Shipping</h4><p>${stdTime}</p>`;

  // Express shipping option
  const expPrice = document.getElementById('expShipPrice');
  const expInfo = document.getElementById('expShipLabel');
  const expTime = getDeliveryTime(country, 'express');
  if (expPrice) expPrice.textContent = resultExpress.price !== null ? `AUD $${resultExpress.price.toFixed(2)}` : 'N/A';
  if (expInfo) expInfo.innerHTML = `<h4>Express Shipping</h4><p>${expTime}</p>`;

  // Shipping label in summary
  const coShip = document.getElementById('coShipping');
  if (coShip) {
    if (result.isFree) coShip.textContent = 'FREE 🎉';
    else if (result.price !== null) coShip.textContent = `AUD $${result.price.toFixed(2)}`;
    else coShip.textContent = 'Contact us';
  }

  // Free ship note
  const freeNote = document.getElementById('freeShipNote');
  if (freeNote) {
    if (country === 'AU' && subtotal < AU_FREE_THRESHOLD) {
      freeNote.style.display = 'block';
      freeNote.textContent = `🎉 Add AUD $${(AU_FREE_THRESHOLD - subtotal).toFixed(2)} more for FREE Australian shipping!`;
    } else {
      freeNote.style.display = 'none';
    }
  }

  // AusPost zone label
  const zoneLabel = document.getElementById('auspostZone');
  if (zoneLabel) {
    const zoneNames = { AU: 'Domestic Australia', 1: 'Zone 1 (NZ)', 2: 'Zone 2 (Asia Pacific)', 3: 'Zone 3 (US & Canada)', 4: 'Zone 4 (UK & Europe)', 5: 'Zone 5 (Rest of World)' };
    zoneLabel.textContent = `AusPost ${zoneNames[zone] || 'International'} · ~${weightKg} kg`;
  }
}
