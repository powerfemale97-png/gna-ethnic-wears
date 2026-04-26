// netlify/functions/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  try {
    const body = JSON.parse(event.body);
    const { items, customerName, customerEmail, shippingCost, shippingMethod, country } = body;
    if (!items || items.length === 0) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'No items in cart' }) };
    }
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.name,
          description: `Size: ${item.size || 'N/A'} | Colour: ${item.colour || 'N/A'}`,
          ...(item.image && item.image.startsWith('https://') ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: `Shipping (${shippingMethod || 'Standard'}) to ${country || 'Australia'}` },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      metadata: { customerName: customerName || '', country: country || 'AU', shippingMethod: shippingMethod || 'standard' },
      success_url: `https://gnaethnicwears.com/checkout.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://gnaethnicwears.com/checkout.html?payment=cancelled`,
    });
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ url: session.url, sessionId: session.id }) };
  } catch (error) {
    console.error('Stripe error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};
