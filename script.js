// script.js
// Produtos carregados de products.json
async function carregarProdutos() {
  const resposta = await fetch('products.json');
  const produtos = await resposta.json();
  renderizarProdutos(produtos);
}

function renderizarProdutos(produtos) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', carregarProdutos);