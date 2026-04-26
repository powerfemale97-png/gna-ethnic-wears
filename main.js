// ══════════════════════════════════════
//   GnA Ethnic Wears — Main JavaScript
// ══════════════════════════════════════

// ── PRODUCT DATA ──
// Products are loaded from Google Sheets via db-connector.js
// Add products through the Admin Panel at gna-owner-panel.html
const PRODUCTS = {
  'short-kurti': [],
  'long-kurti': [],
  'cord-set': [],
  'daily-wear': [],
  'plus-size': [],
  'premium-suit': [],
};
// ── SHIPPING RATES (AUD) ──
const SHIPPING = {
  AU: {label:'Australia',standard:{price:9.95,days:'3–7 business days'},express:{price:19.95,days:'1–3 business days'},free:{threshold:150}},
  NZ: {label:'New Zealand',standard:{price:18,days:'5–10 business days'},express:{price:35,days:'3–5 business days'}},
  US: {label:'United States',standard:{price:28,days:'10–18 business days'},express:{price:55,days:'5–8 business days'}},
  UK: {label:'United Kingdom',standard:{price:30,days:'10–18 business days'},express:{price:58,days:'5–8 business days'}},
  CA: {label:'Canada',standard:{price:28,days:'10–18 business days'},express:{price:52,days:'5–8 business days'}},
  SG: {label:'Singapore',standard:{price:22,days:'7–14 business days'},express:{price:42,days:'3–6 business days'}},
  IN: {label:'India',standard:{price:20,days:'8–15 business days'},express:{price:38,days:'4–7 business days'}},
  OTHER:{label:'Rest of World',standard:{price:35,days:'12–21 business days'},express:{price:65,days:'7–12 business days'}},
};

const COUNTRIES = [
  {code:'AU',name:'Australia'},{code:'NZ',name:'New Zealand'},{code:'US',name:'United States'},
  {code:'UK',name:'United Kingdom'},{code:'CA',name:'Canada'},{code:'SG',name:'Singapore'},
  {code:'IN',name:'India'},{code:'AE',name:'UAE'},{code:'MY',name:'Malaysia'},
  {code:'DE',name:'Germany'},{code:'FR',name:'France'},{code:'JP',name:'Japan'},
  {code:'ZA',name:'South Africa'},{code:'FJ',name:'Fiji'},{code:'OTHER',name:'Other Countries'},
];

// ── CART MANAGEMENT ──
let cart = [];
try { cart = JSON.parse(localStorage.getItem('gna_cart') || '[]'); } catch(e){ cart = []; }

function saveCart(){localStorage.setItem('gna_cart',JSON.stringify(cart));updateCartCount();}
function updateCartCount(){
  const total = cart.reduce((a,b)=>a+b.qty,0);
  document.querySelectorAll('#cartCount,.cartCount').forEach(el=>el.textContent=total);
}
function addToCart(product, size, qty=1){
  const existing = cart.find(i=>i.id===product.id && i.size===size);
  if(existing) existing.qty+=qty;
  else cart.push({...product,size,qty});
  saveCart();
  showToast(`✓ ${product.name} added to cart!`);
}
function removeFromCart(idx){cart.splice(idx,1);saveCart();}
function updateQty(idx,delta){
  cart[idx].qty=Math.max(1,cart[idx].qty+delta);
  saveCart();
}

// ── TOAST ──
function showToast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── RENDER PRODUCTS ──
function renderProducts(containerId, collectionKey, limit=null){
  const container=document.getElementById(containerId);
  if(!container)return;
  let items=PRODUCTS[collectionKey]||[];
  if(limit)items=items.slice(0,limit);
  if(items.length===0){
    container.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 2rem">
      <div style="font-size:3rem;margin-bottom:1rem">🌸</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--deep);margin-bottom:0.8rem">No Products Yet</h3>
      <p style="color:var(--muted);margin-bottom:1.5rem">Products will appear here once added. Contact us to order directly!</p>
      <a href="https://wa.me/61494581796" class="btn-gold" style="display:inline-block">💬 WhatsApp to Order</a>
    </div>`;
    return;
  }
  container.innerHTML=items.map(p=>`
    <div class="product-card reveal" onclick="openModal('${p.id}','${collectionKey}')">
      <div class="product-img">
        <div class="product-img-bg" style="background:${p.bg}"></div>
        <span class="product-emoji">${p.emoji}</span>
        ${p.badge?`<span class="product-badge ${p.badge==='New'?'new':p.badge==='Sale'?'sale':''}">${p.badge}</span>`:''}
        <div class="product-hover-btn">Quick View &nbsp;·&nbsp; 💬 Order</div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">
            ${p.oldPrice?`<span class="old">AUD $${p.oldPrice}</span>`:''}AUD $${p.price}
          </div>
          <div class="product-colors">
            ${p.colors.slice(0,3).map(c=>`<div class="color-dot" style="background:${c}"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
  observeReveal();
}

function renderFeatured(containerId, limit=6){
  const container=document.getElementById(containerId);
  if(!container)return;
  const all=Object.values(PRODUCTS).flat().sort(()=>Math.random()-0.5).slice(0,limit);
  // If no products yet show coming soon message
  if(all.length===0){
    container.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 2rem">
      <div style="font-size:3rem;margin-bottom:1rem">🌸</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--deep);margin-bottom:0.8rem">Products Coming Soon</h3>
      <p style="color:var(--muted);margin-bottom:1.5rem">We are adding our beautiful collection. Check back soon!</p>
      <a href="https://wa.me/61494581796" class="btn-gold">💬 WhatsApp to Order</a>
    </div>`;
    return;
  }
  container.innerHTML=all.map(p=>`
    <div class="product-card reveal" onclick="openModal('${p.id}','${getCollectionForProduct(p.id)}')">
      <div class="product-img">
        <div class="product-img-bg" style="background:${p.bg}"></div>
        <span class="product-emoji">${p.emoji}</span>
        ${p.badge?`<span class="product-badge ${p.badge==='New'?'new':p.badge==='Sale'?'sale':''}">${p.badge}</span>`:''}
        <div class="product-hover-btn">Quick View &nbsp;·&nbsp; 💬 Order</div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">
            ${p.oldPrice?`<span class="old">AUD $${p.oldPrice}</span>`:''}AUD $${p.price}
          </div>
          <div class="product-colors">
            ${p.colors.slice(0,3).map(c=>`<div class="color-dot" style="background:${c}"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
  observeReveal();
}

function getCollectionForProduct(id){
  for(const [key,products] of Object.entries(PRODUCTS)){
    if(products.find(p=>p.id===id))return key;
  }
  return 'short-kurti';
}

// ── MODAL ──
function openModal(productId, collectionKey){
  const product = (PRODUCTS[collectionKey]||[]).find(p=>p.id===productId);
  if(!product)return;
  let modal=document.getElementById('productModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='productModal';
    modal.className='modal-overlay';
    modal.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 id="mTitle">Product</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-emoji" id="mEmoji"></div>
          <div class="modal-product-name" id="mName"></div>
          <div class="modal-price" id="mPrice"></div>
          <div class="modal-desc" id="mDesc"></div>
          <div style="margin-bottom:1rem">
            <div style="font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--muted);margin-bottom:0.5rem">Select Size</div>
            <div class="size-row" id="mSizes"></div>
          </div>
          <div style="display:flex;gap:0.7rem;margin-top:1.5rem;flex-wrap:wrap">
            <button class="btn-gold" onclick="addToCartFromModal('${productId}','${collectionKey}')" style="flex:1">Add to Cart</button>
            <a href="checkout.html" class="btn-rust" style="flex:1;text-align:center" onclick="addToCartFromModal('${productId}','${collectionKey}')">Buy Now</a>
          </div>
          <a href="https://wa.me/61494581796?text=Hi%20GnA%20Ethnic%20Wears!%20I%20am%20interested%20in%20ordering:%20${encodeURIComponent(product.name)}%20-%20Please%20help%20me%20with%20sizing%20and%20availability."
            target="_blank"
            style="display:flex;align-items:center;justify-content:center;gap:0.6rem;margin-top:0.7rem;background:#25D366;color:white;padding:0.75rem;font-family:'Raleway',sans-serif;font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;text-decoration:none;transition:background 0.3s;"
            onmouseover="this.style.background='#128C7E'" onmouseout="this.style.background='#25D366'">
            💬 Order via WhatsApp
          </a>
          <div style="font-size:0.7rem;color:var(--muted);text-align:center;margin-top:0.4rem">Chat with us for size help, availability & bulk orders</div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('mTitle').textContent=product.name;
  document.getElementById('mEmoji').textContent=product.emoji;
  document.getElementById('mName').textContent=product.name;
  document.getElementById('mPrice').innerHTML=`${product.oldPrice?`<span style="text-decoration:line-through;color:var(--muted);font-size:0.9rem;font-weight:400">AUD $${product.oldPrice}</span> `:''}AUD $${product.price}`;
  document.getElementById('mDesc').textContent=product.desc;
  document.getElementById('mSizes').innerHTML=product.sizes.map((s,i)=>
    `<button class="size-btn ${i===2?'active':''}" onclick="selectSize(this,'${s}')">${s}</button>`
  ).join('');
  modal._currentProduct=product;
  modal._selectedSize=product.sizes[2]||product.sizes[0];
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function selectSize(btn,size){
  btn.closest('.size-row').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('productModal')._selectedSize=size;
}

function addToCartFromModal(productId, collectionKey){
  const modal=document.getElementById('productModal');
  const product=(PRODUCTS[collectionKey]||[]).find(p=>p.id===productId);
  const size=modal._selectedSize||'M';
  if(product) addToCart(product,size);
  closeModal();
}

function closeModal(){
  const modal=document.getElementById('productModal');
  if(modal){modal.classList.remove('open');document.body.style.overflow='';}
}

// ── SHIPPING CALCULATOR ──
function getShippingRate(countryCode, type='standard'){
  const zone=SHIPPING[countryCode]||SHIPPING['OTHER'];
  return zone[type]||zone.standard;
}

function calcShipping(countryCode, subtotal, type='standard'){
  if(countryCode==='AU' && subtotal>=150) return 0;
  return getShippingRate(countryCode,type).price;
}

function renderCountryOptions(selectId){
  const sel=document.getElementById(selectId);
  if(!sel)return;
  sel.innerHTML=`<option value="">Select Country</option>`+COUNTRIES.map(c=>
    `<option value="${c.code}"${c.code==='AU'?' selected':''}>${c.name}</option>`
  ).join('');
}

// ── CART RENDER ──
function renderCart(){
  const tbody=document.getElementById('cartItems');
  const empty=document.getElementById('cartEmpty');
  const table=document.getElementById('cartTable');
  if(!tbody)return;
  if(cart.length===0){
    if(empty)empty.style.display='block';
    if(table)table.style.display='none';
    return;
  }
  if(empty)empty.style.display='none';
  if(table)table.style.display='';
  tbody.innerHTML=cart.map((item,idx)=>`
    <tr>
      <td><div class="cart-item-img">${item.emoji}</div></td>
      <td><div class="cart-item-info"><h4>${item.name}</h4><span>Size: ${item.size} · ${item.cat}</span></div></td>
      <td>AUD $${item.price}</td>
      <td>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${idx},-1);renderCart()">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${idx},1);renderCart()">+</button>
        </div>
      </td>
      <td>AUD $${(item.price*item.qty).toFixed(2)}</td>
      <td><button class="remove-btn" onclick="removeFromCart(${idx});renderCart()">Remove</button></td>
    </tr>
  `).join('');
  updateCartSummary();
}

function updateCartSummary(){
  const subtotal=cart.reduce((a,b)=>a+(b.price*b.qty),0);
  const country=document.getElementById('shippingCountryCart')?.value||'AU';
  const shipping=calcShipping(country,subtotal,'standard');
  const total=subtotal+shipping;
  const els=['cartSubtotal','cartShipping','cartTotal'];
  const vals=[`AUD $${subtotal.toFixed(2)}`,shipping===0?'FREE — 🎉':`AUD $${shipping.toFixed(2)}`,`AUD $${total.toFixed(2)}`];
  els.forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=vals[i];});
}

// ── CHECKOUT RENDER ──
function renderOrderSummary(){
  const container=document.getElementById('orderItems');
  if(!container)return;
  const subtotal=cart.reduce((a,b)=>a+(b.price*b.qty),0);
  container.innerHTML=cart.length===0?
    '<p style="color:var(--muted);font-size:0.85rem">Your cart is empty.</p>':
    cart.map(item=>`
      <div class="order-item">
        <div class="order-item-img">${item.emoji}</div>
        <div class="order-item-info">
          <h4>${item.name}</h4>
          <span>Size: ${item.size} × ${item.qty}</span>
        </div>
        <div class="order-item-price">AUD $${(item.price*item.qty).toFixed(2)}</div>
      </div>
    `).join('');
  updateCheckoutTotals();
}

function updateCheckoutTotals(){
  const subtotal=cart.reduce((a,b)=>a+(b.price*b.qty),0);
  const country=document.getElementById('checkoutCountry')?.value||'AU';
  const method=document.querySelector('input[name="shippingMethod"]:checked')?.value||'standard';
  const shipping=calcShipping(country,subtotal,method);
  const total=subtotal+shipping;
  const setText=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  setText('coSubtotal',`AUD $${subtotal.toFixed(2)}`);
  setText('coShipping',shipping===0?'FREE 🎉':`AUD $${shipping.toFixed(2)}`);
  setText('coTotal',`AUD $${total.toFixed(2)}`);
  // Update shipping option prices
  const stdLabel=document.getElementById('stdShipLabel');
  const expLabel=document.getElementById('expShipLabel');
  const zone=SHIPPING[country]||SHIPPING['OTHER'];
  if(stdLabel) stdLabel.innerHTML=`<h4>Standard Shipping</h4><p>${zone.standard.days}</p>`;
  if(expLabel) expLabel.innerHTML=`<h4>Express Shipping</h4><p>${zone.express.days}</p>`;
  const stdPrice=document.getElementById('stdShipPrice');
  const expPrice=document.getElementById('expShipPrice');
  const freeNote=document.getElementById('freeShipNote');
  const isFree=country==='AU'&&subtotal>=150;
  if(stdPrice) stdPrice.textContent=isFree?'FREE':(`AUD $${zone.standard.price.toFixed(2)}`);
  if(expPrice) expPrice.textContent=`AUD $${zone.express.price.toFixed(2)}`;
  if(freeNote) freeNote.style.display=country==='AU'&&subtotal<150?'block':'none';
}

// ── NAV ──
function toggleMenu(){
  document.querySelector('.mobile-menu')?.classList.toggle('open');
  document.querySelector('.overlay-bg')?.classList.toggle('open');
}

// ── SCROLL REVEAL ──
function observeReveal(){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>{
    if(!el.classList.contains('visible')) observer.observe(el);
  });
}

// ── FILTER ──
function filterProducts(collectionKey, filterValue){
  document.querySelectorAll('.filter-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.filter===filterValue);
  });
  const container=document.getElementById('productGrid');
  if(!container)return;
  let items=PRODUCTS[collectionKey]||[];
  if(filterValue==='new') items=items.filter(p=>p.badge==='New'||p.badge==='New Arrival');
  else if(filterValue==='sale') items=items.filter(p=>p.badge==='Sale'||p.oldPrice);
  else if(filterValue==='popular') items=items.filter(p=>p.badge==='Bestseller'||p.badge==='Trending');
  const tempKey=collectionKey;
  container.innerHTML=items.map(p=>`
    <div class="product-card reveal" onclick="openModal('${p.id}','${tempKey}')">
      <div class="product-img">
        <div class="product-img-bg" style="background:${p.bg}"></div>
        <span class="product-emoji">${p.emoji}</span>
        ${p.badge?`<span class="product-badge ${p.badge==='New'?'new':p.badge==='Sale'?'sale':''}">${p.badge}</span>`:''}
        <div class="product-hover-btn">Quick View &nbsp;·&nbsp; 💬 Order</div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">
            ${p.oldPrice?`<span class="old">AUD $${p.oldPrice}</span>`:''}AUD $${p.price}
          </div>
          <div class="product-colors">
            ${p.colors.slice(0,3).map(c=>`<div class="color-dot" style="background:${c}"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
  observeReveal();
}

// ── PLACE ORDER ──
function placeOrder(){
  if(cart.length===0){showToast('Your cart is empty!');return;}
  const name=document.getElementById('firstName')?.value||'';
  if(!name){showToast('Please fill in your details.');return;}
  cart=[];saveCart();
  document.getElementById('orderConfirm').style.display='block';
  document.getElementById('checkoutForm').style.display='none';
  window.scrollTo({top:0,behavior:'smooth'});
}

// ── INIT ──
document.addEventListener('DOMContentLoaded',()=>{
  updateCartCount();
  observeReveal();
  // Mobile menu overlay close
  document.querySelector('.overlay-bg')?.addEventListener('click',toggleMenu);
  // Loader hide
  const loader=document.getElementById('loader');
  if(loader) setTimeout(()=>{loader.style.opacity='0';setTimeout(()=>loader.style.display='none',600);},1200);
});
