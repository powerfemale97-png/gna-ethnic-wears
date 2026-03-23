// nav-footer.js — shared navigation and footer HTML injected into every page
(function(){
  // Inject mobile menu & overlay
  const mobileMenu = `
    <div class="mobile-menu" id="mobileMenu">
      <span class="mobile-close" onclick="toggleMenu()">✕</span>
      <a href="index.html">Home</a>
      <a href="short-kurti.html">Short Kurti</a>
      <a href="long-kurti.html">Long Kurti</a>
      <a href="cord-set.html">Cord Set</a>
      <a href="3piece-suit.html">3 Piece Suit</a>
      <a href="party-wear.html">Party Wear 3 Piece Suit</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="cart.html" style="color:var(--gold);">🛒 Cart (<span class="cartCount">0</span>)</a>
    </div>
    <div class="overlay-bg" id="overlayBg"></div>
  `;
  document.body.insertAdjacentHTML('afterbegin', mobileMenu);
  document.querySelector('.overlay-bg')?.addEventListener('click', toggleMenu);
})();

// Inject floating WhatsApp button on every page
(function(){
  const btn = document.createElement('a');
  btn.href = 'https://wa.me/61404722166?text=Hi%20GnA%20Ethnic%20Wears!%20I%20would%20like%20to%20enquire%20about%20your%20collection.';
  btn.target = '_blank';
  btn.title = 'Chat with us on WhatsApp';
  btn.style.cssText = `
    position:fixed;bottom:2rem;right:2rem;z-index:9000;
    width:58px;height:58px;border-radius:50%;
    background:#25D366;color:white;
    display:flex;align-items:center;justify-content:center;
    font-size:1.8rem;text-decoration:none;
    box-shadow:0 4px 20px rgba(37,211,102,0.5);
    transition:transform 0.3s,box-shadow 0.3s;
    animation:waBounce 2s ease-in-out infinite;
  `;
  btn.innerHTML = '💬';
  btn.onmouseover = ()=>{btn.style.transform='scale(1.15)';btn.style.boxShadow='0 6px 28px rgba(37,211,102,0.7)';};
  btn.onmouseout  = ()=>{btn.style.transform='scale(1)';btn.style.boxShadow='0 4px 20px rgba(37,211,102,0.5)';};

  // Add bounce animation
  const style = document.createElement('style');
  style.textContent = '@keyframes waBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}';
  document.head.appendChild(style);
  document.body.appendChild(btn);

  // Add tooltip
  const tip = document.createElement('div');
  tip.style.cssText = `
    position:fixed;bottom:5.8rem;right:1.5rem;z-index:8999;
    background:#1C0A00;color:#C9A84C;padding:0.5rem 1rem;
    font-family:'Raleway',sans-serif;font-size:0.75rem;font-weight:600;
    white-space:nowrap;opacity:0;transition:opacity 0.3s;
    border:1px solid rgba(201,168,76,0.3);pointer-events:none;
  `;
  tip.textContent = 'Order via WhatsApp';
  document.body.appendChild(tip);
  btn.onmouseover = ()=>{btn.style.transform='scale(1.1)';tip.style.opacity='1';};
  btn.onmouseout  = ()=>{btn.style.transform='scale(1)';tip.style.opacity='0';};
})();

// ── FLOATING WHATSAPP BUTTON ──
(function(){
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/61404722166?text=Hi GnA Ethnic Wears! I am interested in your collection.';
  wa.target = '_blank';
  wa.className = 'whatsapp-float';
  wa.title = 'Order on WhatsApp';
  wa.innerHTML = '<span style="position:relative">💬<span class="whatsapp-float-tooltip">Order on WhatsApp</span></span>';
  document.body.appendChild(wa);
})();
