const JSON_URL = "https://script.google.com/macros/s/AKfycbygLaGLpkI6K_SN8XdG02V-DPW38q9Af8ihtGHV53l_Y9ME69-Wsc7J6wBjZW40WMcJ/exec?callback=handleProducts";

let products = [];
let cart = [];

// Função chamada pelo JSONP
function handleProducts(data) {
    products = data;
    displayProducts(products);
}

// Exibir os produtos
function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.Imagem}" alt="${product.Nome}" class="product-image" onerror="this.src='img/placeholder.png'">
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
