let carrinho = [];
let produtosGlobal = [];

// Normalizar texto
function normalizarTexto(txt) {
  return String(txt || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Criar card de produto
function criarCard(produto) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" data-name="${produto.nome}" data-price="${produto.preco}">
    <h3>${produto.nome}</h3>
    <p>R$ ${produto.preco.toFixed(2)}</p>
    <button data-name="${produto.nome}">Adicionar ao Carrinho</button>
  `;
  return card;
}

// Renderizar produtos
function renderProdutos(produtos) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  produtos.forEach(p => container.appendChild(criarCard(p)));
}

// 🔹 Carregar produtos do JSON
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    produtosGlobal = data;
    renderProdutos(produtosGlobal);
  })
  .catch(err => console.error("Erro ao carregar produtos:", err));

// Filtro por categoria
document.querySelectorAll('.category').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.getAttribute('data-category');
    if (cat === 'all') renderProdutos(produtosGlobal);
    else renderProdutos(produtosGlobal.filter(p => p.categoria === cat));
  });
});

// Busca
document.getElementById('search').addEventListener('input', (e) => {
  const query = normalizarTexto(e.target.value);
  const filtrados = produtosGlobal.filter(p => normalizarTexto(p.nome).includes(query));
  renderProdutos(filtrados);
});

// Atualizar carrinho
function atualizarCarrinho() {
  document.getElementById('cart-count').innerText = carrinho.length;
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let total = 0;
  carrinho.forEach(p => {
    const div = document.createElement('div');
    div.textContent = `${p.nome} - R$ ${p.preco.toFixed(2)}`;
    cartItems.appendChild(div);
    total += p.preco;
  });
  document.getElementById('cart-total').innerText = total.toFixed(2);
}

// Modal Carrinho
document.getElementById('cart-btn').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'flex';
});
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
});

// Modal Produto
let produtoModal = null;
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.product-card')) {
    const nome = e.target.dataset.name;
    produtoModal = produtosGlobal.find(p => p.nome === nome);
    document.getElementById('modal-img').src = produtoModal.imagem;
    document.getElementById('modal-name').innerText = produtoModal.nome;
    document.getElementById('modal-price').innerText = `R$ ${produtoModal.preco.toFixed(2)}`;
    document.getElementById('product-modal').style.display = 'flex';
  }
});
document.getElementById('close-product-modal').addEventListener('click', () => {
  document.getElementById('product-modal').style.display = 'none';
});

// Adicionar ao carrinho via modal
document.getElementById('modal-add-cart').addEventListener('click', () => {
  carrinho.push(produtoModal);
  atualizarCarrinho();
  alert(`${produtoModal.nome} adicionado ao carrinho!`);
});

// Finalizar no WhatsApp
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (carrinho.length === 0) return alert('Carrinho vazio!');
  let mensagem = 'Olá, quero comprar:%0A';
  carrinho.forEach(p => mensagem += `${p.nome} - R$ ${p.preco.toFixed(2)}%0A`);
  window.open(`https://wa.me/5547996000358?text=${mensagem}`, '_blank');
});
document.getElementById('modal-buy-btn').addEventListener('click', () => {
  carrinho.push(produtoModal);
  let mensagem = 'Olá, quero comprar:%0A';
  carrinho.forEach(p => mensagem += `${p.nome} - R$ ${p.preco.toFixed(2)}%0A`);
  window.open(`https://wa.me/5547996000358?text=${mensagem}`, '_blank');
});
