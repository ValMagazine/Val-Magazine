// ======================= CONFIGURAÇÃO =======================
const JSON_URL = "https://script.google.com/macros/s/AKfycbxgkvO8bVl0YlMxBubq0d6tEcwvWDAvPcLDHXzdDl9d/dev?callback=handleProducts";

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

  let fileId = "";

  // Caso seja do tipo "...open?id=XXXX"
  if (url.includes("open?id=")) {
    fileId = url.split("open?id=")[1].split("&")[0];
  }
  // Caso seja do tipo ".../d/XXXX/"
  else if (url.includes("/d/")) {
    fileId = url.split("/d/")[1].split("/")[0];
  }

  return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
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

    // 🔎 Debug no console
    console.log("Produto:", prod.Nome);
    console.log("Imagem original:", prod.Imagem);
    console.log("Imagem formatada:", imgLink);

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

    // Clica na imagem -> abre modal
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
