// ======================= CONFIGURAÇÃO =======================
const JSON_URL = "https://script.google.com/macros/s/AKfycbyw9YMVZlg9ivdbXhxLXUnk1gj5WqiOtj2Im1_rT2KETid00cLtp3X_rDK7GeMrJ_6G/exec";

const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");

const cartBtn = document.getElementById("cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");

// Modal
const imgModal = document.getElementById("img-modal");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const closeModalBtn = document.getElementById("close-modal");

let products = [];
let cart = [];

// ======================= FUNÇÕES =======================

// Corrige links do Google Drive para exibição direta
function formatDriveLink(url) {
  if (!url) return "";
  const match = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url; // Se não for link de Drive, retorna original
}

// Renderiza produtos no grid
function renderProducts(items) {
  productsGrid.innerHTML = "";
  if(items.length === 0){
    productsGrid.innerHTML = "<p style='color:var(--muted)'>Nenhum produto encontrado.</p>";
    return;
  }

  items.forEach(prod => {
    const imgLink = formatDriveLink(prod.Imagem);

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <div class="product-media">
        <img src="${imgLink}" alt="${prod.Nome}">
      </div>
      <div class="product-title">${prod.Nome}</div>
      <div class="product-category">${prod.Categoria || "Sem categoria"}</div>
      <div class="product-bottom">
        <div class="price">R$ ${prod.Preço}</div>
        <button class="btn add-to-cart">Adicionar</button>
      </div>
    `;
    productsGrid.appendChild(card);

    // Modal de imagem
    card.querySelector(".product-media img").addEventListener("click", () => {
      modalImage.src = imgLink;
      modalCaption.textContent = prod.Nome;
      imgModal.classList.add("show");
      imgModal.setAttribute("aria-hidden","false");
    });

    // Botão adicionar ao carrinho
    card.querySelector(".add-to-cart").addEventListener("click", () => {
      addToCart(prod);
    });
  });
}

// Buscar produtos do Apps Script
async function fetchProducts() {
  try {
    const response = await fetch(JSON_URL);
    const data = await response.json();
    products = data;
    renderProducts(products);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    productsGrid.innerHTML = "<p style='color:red'>Erro ao carregar produtos.</p>";
  }
}

// ======================= FILTRO E BUSCA =======================
categoryFilter.addEventListener("change", () => {
  filterAndSearch();
});

searchInput.addEventListener("input", () => {
  filterAndSearch();
});

function filterAndSearch() {
  const cat = categoryFilter.value;
  const term = searchInput.value.toLowerCase();

  const filtered = products.filter(p => {
    const matchCat = cat === "Todos" || p.Categoria === cat;
    const matchSearch = p.Nome.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  renderProducts(filtered);
}

// ======================= CARRINHO =======================
function addToCart(prod) {
  const exist = cart.find(item => item.Nome === prod.Nome);
  if(exist){
    exist.quantidade++;
  } else {
    cart.push({...prod, quantidade: 1});
  }
  updateCart();
  openCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const imgLink = formatDriveLink(item.Imagem);

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${imgLink}" alt="${item.Nome}">
      <div>
        <div>${item.Nome}</div>
        <div>R$ ${item.Preço}</div>
        <div class="qty-controls">
          <button class="minus">-</button>
          <span>${item.quantidade}</span>
          <button class="plus">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(div);

    const priceNum = parseFloat(item.Preço.replace(",","."));
    total += priceNum * item.quantidade;

    // Botões +
    div.querySelector(".plus").addEventListener("click", () => {
      item.quantidade++;
      updateCart();
    });
    div.querySelector(".minus").addEventListener("click", () => {
      item.quantidade--;
      if(item.quantidade <= 0){
        cart = cart.filter(i => i.Nome !== item.Nome);
      }
      updateCart();
    });
  });

  cartTotalEl.textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.reduce((a,b)=>a+b.quantidade,0);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

// Finalizar via WhatsApp
checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0) return;
  let msg = "Olá! Quero comprar:\n";
  cart.forEach(item => {
    msg += `- ${item.Nome} x${item.quantidade} - R$ ${item.Preço}\n`;
  });
  const url = "https://wa.me/5577981543503?text=" + encodeURIComponent(msg);
  window.open(url,"_blank");
});

// ======================= MODAL =======================
closeModalBtn.addEventListener("click", () => {
  imgModal.classList.remove("show");
  imgModal.setAttribute("aria-hidden","true");
});

// ======================= INICIALIZAÇÃO =======================
fetchProducts();
