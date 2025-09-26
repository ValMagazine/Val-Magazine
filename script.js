const JSON_URL = "https://script.google.com/macros/s/AKfycbygLaGLpkI6K_SN8XdG02V-DPW38q9Af8ihtGHV53l_Y9ME69-Wsc7J6wBjZW40WMcJ/exec?callback=handleProducts";

let products = [];
let cart = [];

// Função chamada pelo JSONP
function handleProducts(data) {
    products = data;
    displayProducts(products);
}

// Corrige links do Google Drive
function formatDriveLink(url) {
    if (!url) return "img/placeholder.png";

    // Caso o link seja ".../d/ID/..."
    let match = url.match(/\/d\/([^/]+)\//);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    // Caso o link seja "...?id=ID"
    match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    return url;
}

// Exibir os produtos
function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(product => {
        const imgLink = formatDriveLink(product.Imagem);

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${imgLink}" alt="${product.Nome}" class="product-image" onerror="this.src='img/placeholder.png'">
            <h3>${product.Nome}</h3>
            <p>${product.Categoria}</p>
            <span>R$ ${parseFloat(product.Preço).toFixed(2)}</span>
            <button onclick="addToCart('${product.Nome}', ${product.Preço})">Adicionar</button>
        `;

        container.appendChild(card);
    });
}

// Adicionar ao carrinho
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

function updateCart() {
    const count = document.getElementById("cart-count");
    count.textContent = cart.length;
}

// Buscar produtos do Apps Script
function fetchProducts() {
    const script = document.createElement("script");
    script.src = JSON_URL;
    document.body.appendChild(script);
}

// Chamar no carregamento da página
window.onload = fetchProducts;
