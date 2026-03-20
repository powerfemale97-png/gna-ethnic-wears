// nav-footer.js — shared navigation and footer HTML injected into every page

// ── MOBILE MENU & OVERLAY ──
(function(){
  const mobileMenu = `
    <div class="mobile-menu" id="mobileMenu">
      <span class="mobile-close" onclick="toggleMenu()">✕</span>
      <a href="index.html">Home</a>
      <a href="short-kurti.html">Short Kurti</a>
      <a href="long-kurti.html">Long Kurti</a>
      <a href="cord-set.html">Cord Set</a>
      <a href="daily-wear.html">Daily Wear 3 Piece Suit</a>
      <a href="plus-size.html">Plus Size 3 Piece Suit</a>
      <a href="premium-suit.html">Premium 3 Piece Suit</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="reviews.html">Reviews ⭐</a>
      <a href="cart.html" style="color:var(--gold);">🛒 Cart (<span class="cartCount">0</span>)</a>
    </div>
    <div class="overlay-bg" id="overlayBg"></div>
  `;
  document.body.insertAdjacentHTML('afterbegin', mobileMenu);
  document.querySelector('.overlay-bg')?.addEventListener('click', toggleMenu);
})();

// ── SINGLE FLOATING WHATSAPP BUTTON ──
// Uses whatsapp-float class from styles.css — prevents duplicates
(function(){
  // Guard: if any inline WA float button already exists, remove it and replace with this clean one
  document.querySelectorAll('.whatsapp-float').forEach(el => el.remove());

  const wa = document.createElement('a');
  wa.href = 'https://wa.me/61404722166?text=Hi%20GnA%20Ethnic%20Wears!%20I%20would%20like%20to%20enquire%20about%20your%20collection.';
  wa.target = '_blank';
  wa.className = 'whatsapp-float';
  wa.title = 'Order on WhatsApp';
  wa.innerHTML = '💬<span class="whatsapp-float-tooltip">Order on WhatsApp</span>';
  document.body.appendChild(wa);
})();
