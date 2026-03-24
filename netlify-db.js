// ══════════════════════════════════════════════════════════════
//  GnA Ethnic Wears — Firebase Realtime Database
//  Free, reliable, works from any browser instantly
// ══════════════════════════════════════════════════════════════

const GNA_FIREBASE_URL = 'https://gna-ethnic-wears-default-rtdb.firebaseio.com';

// ── LOAD all products from Firebase ──
async function netlifyDBLoad() {
  try {
    const res = await fetch(GNA_FIREBASE_URL + '/products.json');
    if (!res.ok) return [];
    const data = await res.json();
    if (!data) return [];
    // Firebase returns object with keys, convert to array
    if (Array.isArray(data)) return data;
    return Object.values(data);
  } catch(e) {
    console.error('Firebase load error:', e);
    return [];
  }
}

// ── SAVE all products to Firebase ──
async function netlifyDBSave(products) {
  try {
    const res = await fetch(GNA_FIREBASE_URL + '/products.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
    return res.ok;
  } catch(e) {
    console.error('Firebase save error:', e);
    return false;
  }
}

// ── ADD or UPDATE a product ──
async function netlifyDBAddProduct(product) {
  let products = await netlifyDBLoad();
  const idx = products.findIndex(p => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  const ok = await netlifyDBSave(products);
  try { localStorage.setItem('gna_products', JSON.stringify(products)); } catch(e) {}
  return ok;
}

// ── DELETE a product ──
async function netlifyDBDeleteProduct(id) {
  let products = await netlifyDBLoad();
  products = products.filter(p => p.id !== id);
  const ok = await netlifyDBSave(products);
  try { localStorage.setItem('gna_products', JSON.stringify(products)); } catch(e) {}
  return ok;
}

// ── LOAD products for a collection page ──
async function netlifyDBLoadCollection(collectionName, gridId, emptyId) {
  const grid = document.getElementById(gridId);
  const empty = document.getElementById(emptyId);
  if (!grid) return;

  // Show from localStorage instantly first
  try {
    const local = JSON.parse(localStorage.getItem('gna_products') || '[]');
    const filtered = local.filter(p =>
      (p.collection||'').toLowerCase().indexOf(collectionName.toLowerCase()) !== -1 ||
      (p.cat||'').toLowerCase().indexOf(collectionName.toLowerCase()) !== -1
    );
    if (filtered.length > 0) {
      if (empty) empty.style.display = 'none';
      grid.style.display = '';
      grid.innerHTML = filtered.map(gnaRenderCard).join('');
    }
  } catch(e) {}

  // Then fetch fresh from Firebase
  try {
    const all = await netlifyDBLoad();
    if (!all || all.length === 0) {
      if (grid.innerHTML === '') {
        if (empty) empty.style.display = 'block';
      }
      return;
    }

    // Update localStorage
    try { localStorage.setItem('gna_products', JSON.stringify(all)); } catch(e) {}

    const filtered = all.filter(p =>
      (p.collection||'').toLowerCase().indexOf(collectionName.toLowerCase()) !== -1 ||
      (p.cat||'').toLowerCase().indexOf(collectionName.toLowerCase()) !== -1
    );

    if (filtered.length === 0) {
      if (grid.innerHTML === '') {
        grid.style.display = 'none';
        if (empty) empty.style.display = 'block';
      }
      return;
    }

    if (empty) empty.style.display = 'none';
    grid.style.display = '';
    grid.innerHTML = filtered.map(gnaRenderCard).join('');
  } catch(e) {
    console.warn('Firebase load failed:', e);
  }
}

// ── RENDER a product card ──
function gnaRenderCard(p) {
  var bg = p.bg || 'linear-gradient(155deg,#C9184A,#6B0020)';
  var price = parseFloat(p.price) || 0;
  var oldp = parseFloat(p.oldPrice) || 0;
  var badge = p.badge || '';
  var src = '';
  try {
    var ph = typeof p.photos === 'string' ? JSON.parse(p.photos||'[]') : (p.photos||[]);
    if (ph.length > 0) src = typeof ph[0] === 'string' ? ph[0] : (ph[0].data||ph[0].url||'');
    if (!src) src = p.photoData || p.photoUrl || '';
  } catch(e) { src = p.photoData || p.photoUrl || ''; }

  var imgHTML = src && src.length > 10
    ? '<img src="'+src+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.style.opacity=0"/>'
    : '';

  var url = 'product.html?id=' + p.id;

  return '<a href="'+url+'" class="product-card reveal" style="text-decoration:none;display:block;cursor:pointer">'+
    '<div class="product-img" style="position:relative;background:'+bg+'">'+
    imgHTML+
    '<span class="product-emoji" style="position:relative;z-index:1">'+(imgHTML?'':(p.emoji||'👗'))+'</span>'+
    (badge?'<span class="product-badge">'+badge+'</span>':'')+
    '<div class="product-hover-btn">View Product →</div>'+
    '</div>'+
    '<div class="product-info">'+
    '<div class="product-cat">'+(p.cat||p.collection||'')+'</div>'+
    '<div class="product-name">'+p.name+'</div>'+
    '<div class="product-footer"><div class="product-price">'+
    (oldp?'<span class="old">AUD $'+oldp.toFixed(2)+'</span>':'')+
    'AUD $'+price.toFixed(2)+
    '</div></div></div></a>';
}

// ── OPEN MODAL ──
function gnaOpenModal(productJson) {
  try {
    var p = typeof productJson === 'string' ? JSON.parse(productJson) : productJson;
    if (typeof window.gnaCurrentProduct !== 'undefined') {
      window.gnaCurrentProduct = p;
      document.getElementById('mTitle').textContent = p.name;
      document.getElementById('mPrice').textContent = 'AUD $' + parseFloat(p.price).toFixed(2);
      document.getElementById('mDesc').textContent = p.desc || '';
      var src = '';
      try {
        var ph = typeof p.photos==='string'?JSON.parse(p.photos||'[]'):(p.photos||[]);
        if(ph.length>0) src = typeof ph[0]==='string'?ph[0]:(ph[0].data||ph[0].url||'');
        if(!src) src = p.photoData||p.photoUrl||'';
      } catch(e){}
      var mPhoto = document.getElementById('mPhoto');
      if(mPhoto) mPhoto.innerHTML = src ? '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover"/>' : (p.emoji||'👗');
      var sizes = p.sizes || [];
      var sDiv = document.getElementById('mSizes');
      if(sDiv) sDiv.innerHTML = sizes.map(function(s,i){
        return '<button class="gna-size-btn'+(i===0?' active':'')+'" onclick="gnaPickSz(this,this.textContent)">'+s+'</button>';
      }).join('');
      if(sizes.length) window.gnaSelectedSize = sizes[0];
      document.getElementById('gnaModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  } catch(e) { console.error('Modal error:', e); }
}
