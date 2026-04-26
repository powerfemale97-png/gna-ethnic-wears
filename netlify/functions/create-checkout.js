// netlify/functions/create-checkout.js
// ══════════════════════════════════════════════════════════════
//  GnA Ethnic Wears — Stripe Checkout Session Creator
//  Netlify Function — runs securely on server
// ══════════════════════════════════════════════════════════════

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = JSON.parse(event.body);
    const { items, customerName, customerEmail, shippingCost, shippingMethod, country } = body;

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No items in cart' })
      };
    }

    // Build line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.name,
          description: `Size: ${item.size || 'N/A'} | Colour: ${item.colour || 'N/A'}`,
          // Only include images if they are valid https URLs
          ...(item.image && item.image.startsWith('https://') ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));

    // Add shipping as a line item if applicable
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: `Shipping (${shippingMethod || 'Standard'}) to ${country || 'Australia'}`,
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      metadata: {
        customerName: customerName || '',
        country: country || 'AU',
        shippingMethod: shippingMethod || 'standard',
      },
      success_url: `https://www.gnaethnicwears.com.au/checkout.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.gnaethnicwears.com.au/checkout.html?payment=cancelled`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id })
    };

  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
