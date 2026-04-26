// ══════════════════════════════════════════════════════════════
//  GnA Ethnic Wears — Google Sheets Database Connector (JSONP)
// ══════════════════════════════════════════════════════════════

const GNA_API = 'https://script.google.com/macros/s/AKfycbyd-p6bj0sDfg7ReAYRd-k4c_iKS9O7UGcaQ380M4tG1Sz4QKX4b4a5kMt4MixcFlR6/exec';

// ── JSONP GET (bypasses CORS) ──
function apiGet(action, params = {}) {
  return new Promise((resolve, reject) => {
    const cbName = 'gna_cb_' + Date.now();
    const url = new URL(GNA_API);
    url.searchParams.set('action', action);
    url.searchParams.set('callback', cbName);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    window[cbName] = function(data) {
      delete window[cbName];
      document.getElementById(cbName)?.remove();
      resolve(data);
    };

    const script = document.createElement('script');
    script.id = cbName;
    script.src = url.toString();
    script.onerror = () => {
      delete window[cbName];
      script.remove();
      reject(new Error('JSONP failed'));
    };
    setTimeout(() => {
      if (window[cbName]) {
        delete window[cbName];
        script.remove();
        reject(new Error('Timeout'));
      }
    }, 10000);
    document.head.appendChild(script);
  });
}

// ── POST (regular fetch, works for writes) ──
async function apiPost(data) {
  try {
    const res = await fetch(GNA_API, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (e) {
    console.error('API POST error:', e);
    return null;
  }
}

// ── PRODUCTS ──
async function dbGetAllProducts() {
  try {
    const result = await apiGet('getAllProducts');
    return result || [];
  } catch(e) { return []; }
}

async function dbGetProducts(collection) {
  try {
    const result = await apiGet('getProducts', { collection });
    return result || [];
  } catch(e) { return []; }
}

async function dbAddProduct(product) {
  return await apiPost({ action: 'addProduct', product });
}

async function dbUpdateProduct(product) {
  return await apiPost({ action: 'updateProduct', product });
}

async function dbDeleteProduct(id) {
  return await apiPost({ action: 'deleteProduct', id });
}

// ── ORDERS ──
async function dbGetOrders() {
  try { return await apiGet('getOrders') || []; } catch(e) { return []; }
}

async function dbAddOrder(order) {
  return await apiPost({ action: 'addOrder', order });
}

async function dbUpdateOrderStatus(id, status) {
  return await apiPost({ action: 'updateOrderStatus', id, status });
}

// ── REVIEWS ──
async function dbGetReviews() {
  try { return await apiGet('getReviews') || []; } catch(e) { return []; }
}

async function dbAddReview(review) {
  return await apiPost({ action: 'addReview', review });
}

async function dbDeleteReview(id) {
  return await apiPost({ action: 'deleteReview', id });
}

// ── RENDER PRODUCTS FROM GOOGLE SHEETS ──
async function renderProductsFromDB(containerId, collectionName) {
  const grid = document.getElementById(containerId);
  const emptyMsg = document.getElementById('emptyMsg');
  if (!grid) return;

  // First try localStorage
  try {
    const localProducts = JSON.parse(localStorage.getItem('gna_products') || '[]');
    const filtered = localProducts.filter(p =>
      (p.collection||'').toLowerCase() === collectionName.toLowerCase() ||
      (p.cat||'').toLowerCase() === collectionName.toLowerCase()
    );
    if (filtered.length > 0) {
      renderProductCards(grid, emptyMsg, filtered);
    }
  } catch(e) {}

  // Then sync from Sheets in background
  try {
    const products = await dbGetProducts(collectionName);
    if (products && products.length > 0) {
      // Update localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('gna_products') || '[]');
        products.forEach(p => {
          const idx = existing.findIndex(e => e.id === p.id);
          if (idx >= 0) existing[idx] = p;
          else existing.push(p);
        });
        localStorage.setItem('gna_products', JSON.stringify(existing));
      } catch(e) {}
      renderProductCards(grid, emptyMsg, products);
    } else {
      // No products in sheet - show empty
      if (grid.children.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
      }
    }
  } catch(e) {
    console.warn('Could not load from Sheets:', e);
  }
}

function renderProductCards(grid, emptyMsg, products) {
  if (!products || products.length === 0) {
    if (grid) grid.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (grid) grid.style.display = '';

  grid.innerHTML = products.map(function(p) {
    var bg = p.bg || 'linear-gradient(155deg,#C9184A,#6B0020)';
    var emoji = p.emoji || '👗';
    var price = parseFloat(p.price) || 0;
    var oldPrice = parseFloat(p.oldPrice) || null;
    var badge = p.badge || '';
    var cat = p.cat || p.collection || '';

    var mainSrc = '';
    try {
      var photosArr = typeof p.photos === 'string' ? JSON.parse(p.photos || '[]') : (p.photos || []);
      if (photosArr.length > 0) {
        mainSrc = typeof photosArr[0] === 'string' ? photosArr[0] : (photosArr[0].data || photosArr[0].url || '');
      }
      if (!mainSrc) mainSrc = p.photoData || p.photoUrl || '';
    } catch(e) {
      mainSrc = p.photoData || p.photoUrl || '';
    }

    var imgHTML = mainSrc && mainSrc.length > 10
      ? '<img src="' + mainSrc + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.style.opacity=0"/>'
      : '';

    return '<div class="product-card reveal" onclick="openProductModal(' + JSON.stringify(JSON.stringify(p)) + ')">'
      + '<div class="product-img" style="position:relative;background:' + bg + '">'
      + imgHTML
      + '<span class="product-emoji" style="position:relative;z-index:1">' + (imgHTML ? '' : emoji) + '</span>'
      + (badge ? '<span class="product-badge">' + badge + '</span>' : '')
      + '<div class="product-hover-btn">Quick View · 💬 Order</div>'
      + '</div>'
      + '<div class="product-info">'
      + '<div class="product-cat">' + cat + '</div>'
      + '<div class="product-name">' + p.name + '</div>'
      + '<div class="product-footer">'
      + '<div class="product-price">'
      + (oldPrice ? '<span class="old">AUD $' + oldPrice.toFixed(2) + '</span>' : '')
      + 'AUD $' + price.toFixed(2)
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
}

async function loadFeaturedFromDB(containerId, limit) {
  limit = limit || 6;
  const grid = document.getElementById(containerId);
  if (!grid) return;
  try {
    const all = await dbGetAllProducts();
    if (!all || all.length === 0) return;
    const shuffled = all.sort(() => Math.random() - 0.5).slice(0, limit);
    renderProductCards(grid, null, shuffled);
  } catch(e) {
    console.warn('Could not load featured:', e);
  }
}

function openProductModal(productJson) {
  try {
    const product = typeof productJson === 'string' ? JSON.parse(productJson) : productJson;
    // Use the existing modal system from short-kurti etc pages if available
    if (typeof gnaOpenModal === 'function') { gnaOpenModal(product); return; }
    // Simple fallback
    alert(product.name + '\nAUD $' + product.price);
  } catch(e) {}
}
