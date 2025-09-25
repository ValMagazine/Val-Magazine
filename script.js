// PRODUCTS (JSON integrated) - image files expected in the site root (same folder as index.html)
const PRODUCTS = [
  { "title": "Caneca Personalizada", "price": 59.90, "category": "Canecas", "image": "caneca.jpeg" },
  { "title": "Bolsa Feminina Luxo", "price": 199.90, "category": "Bolsas", "image": "bolsa.jpeg" },
  { "title": "Relógio Digital Futurista", "price": 299.90, "category": "Relógios", "image": "relogio.jpeg" }
];

let cart = {};

// helper to remove accents and lower-case
function normalize(str){
  return String(str || '').normalize('NFD').replace(/[̀-\u036f]/g,'').toLowerCase();
}

// DOM refs
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsWrap = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');

const imgModal = document.getElementById('img-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const closeModal = document.getElementById('close-modal');

// render products
function renderProducts(list = PRODUCTS){
  productsGrid.innerHTML = '';
  list.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media" data-index="${idx}">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-title">${p.title}</div>
        <div class="product-category">${p.category}</div>
      </div>
      <div class="product-bottom">
        <div class="price">R$ ${p.price.toFixed(2)}</div>
        <div class="card-actions">
          <button class="btn add" data-index="${idx}" aria-label="Adicionar ao carrinho">Adicionar</button>
          <button class="btn primary buy" data-index="${idx}" aria-label="Comprar agora via WhatsApp">Comprar</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// filters + search
function applyFilters(){
  const q = normalize(searchInput.value.trim());
  const cat = categoryFilter.value;
  const filtered = PRODUCTS.filter(p => {
    const matchesCat = (cat === 'Todos') || p.category === cat;
    const combined = `${p.title} ${p.category}`;
    const matchesQ = normalize(combined).includes(q);
    return matchesCat && matchesQ;
  });
  renderProducts(filtered);
}

// cart UI update
function updateCartUI(){
  const items = Object.values(cart);
  const total = items.reduce((s,it)=> s + it.price*it.qty, 0);
  cartTotalEl.textContent = total.toFixed(2);
  const count = items.reduce((s,it)=> s + it.qty, 0);
  cartCount.textContent = count;

  cartItemsWrap.innerHTML = '';
  if(items.length === 0){
    cartItemsWrap.innerHTML = `<p style="color:var(--muted)">Seu carrinho está vazio.</p>`;
    return;
  }

  items.forEach(it => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${it.image}" alt="${it.title}" loading="lazy">
      <div style="flex:1">
        <div style="font-weight:600">${it.title}</div>
        <div style="color:var(--muted);font-size:0.9rem">R$ ${it.price.toFixed(2)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="qty-controls">
          <button aria-label="Diminuir quantidade" data-decrease="${it.id}">-</button>
          <div aria-live="polite" style="padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.04)">${it.qty}</div>
          <button aria-label="Aumentar quantidade" data-increase="${it.id}">+</button>
        </div>
        <button aria-label="Remover item" data-remove="${it.id}" style="margin-top:6px">Remover</button>
      </div>
    `;
    cartItemsWrap.appendChild(el);
  });
}

// add to cart
function addToCart(product){
  const id = normalize(product.title + product.price);
  if(cart[id]) cart[id].qty += 1;
  else cart[id] = {...product, qty:1, id};
  updateCartUI();
}

// open/close cart
function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCart(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

// events
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);

productsGrid.addEventListener('click', (e) => {
  const media = e.target.closest('.product-media');
  if(media){
    const idx = Number(media.dataset.index);
    const p = PRODUCTS[idx];
    modalImage.src = p.image;
    modalImage.alt = p.title;
    modalCaption.textContent = `${p.title} — R$ ${p.price.toFixed(2)}`;
    imgModal.classList.add('show');
    imgModal.setAttribute('aria-hidden','false');
    return;
  }

  const addBtn = e.target.closest('button.add');
  if(addBtn){
    const idx = Number(addBtn.dataset.index);
    addToCart(PRODUCTS[idx]);
    return;
  }

  const buyBtn = e.target.closest('button.buy');
  if(buyBtn){
    const idx = Number(buyBtn.dataset.index);
    const p = PRODUCTS[idx];
    const text = encodeURIComponent(`Olá, quero comprar: ${p.title} - R$ ${p.price.toFixed(2)}.`);
    window.open(`https://wa.me/5577981543503?text=${text}`, '_blank');
    return;
  }
});

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
clearCartBtn.addEventListener('click', ()=>{ cart = {}; updateCartUI(); });

cartItemsWrap.addEventListener('click', (e) => {
  const inc = e.target.dataset.increase;
  const dec = e.target.dataset.decrease;
  const rem = e.target.dataset.remove;
  if(inc){
    cart[inc].qty += 1; updateCartUI();
  }
  if(dec){
    cart[dec].qty -= 1;
    if(cart[dec].qty <= 0) delete cart[dec];
    updateCartUI();
  }
  if(rem){
    delete cart[rem]; updateCartUI();
  }
});

checkoutBtn.addEventListener('click', ()=> {
  const items = Object.values(cart);
  if(items.length === 0){ alert('Carrinho vazio. Adicione itens antes de finalizar.'); return; }
  let text = 'Olá, gostaria de comprar:%0A';
  items.forEach(it => text += `${it.qty}x ${it.title} - R$ ${it.price.toFixed(2)}%0A`);
  text += `%0ATotal: R$ ${items.reduce((s,i)=> s + i.price*i.qty,0).toFixed(2)}`;
  window.open(`https://wa.me/5577981543503?text=${text}`, '_blank');
});

// modal close
closeModal.addEventListener('click', () => {
  imgModal.classList.remove('show');
  imgModal.setAttribute('aria-hidden','true');
});

// close modal & cart with ESC
window.addEventListener('keydown', (e)=> {
  if(e.key === 'Escape'){
    imgModal.classList.remove('show');
    imgModal.setAttribute('aria-hidden','true');
    closeCart();
  }
});

// init
renderProducts(PRODUCTS);
updateCartUI();

// footer year
document.getElementById('year').textContent = new Date().getFullYear();
