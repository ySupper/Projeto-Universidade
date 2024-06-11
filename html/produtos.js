document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: 1, name: "Item 1", price: 10.00, description: "Descrição do Item 1 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 2, name: "Item 2", price: 15.00, description: "Descrição do Item 2 aqui.", imagens: ["placeholder2.jpg", "placeholder.jpg"] },
        { id: 3, name: "Item 3", price: 20.00, description: "Descrição do Item 3 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 4, name: "Item 4", price: 25.00, description: "Descrição do Item 4 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 5, name: "Item 5", price: 30.00, description: "Descrição do Item 5 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 6, name: "Item 6", price: 35.00, description: "Descrição do Item 6 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 7, name: "Item 7", price: 40.00, description: "Descrição do Item 7 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 8, name: "Item 8", price: 45.00, description: "Descrição do Item 8 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 9, name: "Item 9", price: 50.00, description: "Descrição do Item 9 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 10, name: "Item 10", price: 55.00, description: "Descrição do Item 10 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 11, name: "Item 11", price: 60.00, description: "Descrição do Item 11 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 12, name: "Item 12", price: 65.00, description: "Descrição do Item 12 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 13, name: "Item 13", price: 70.00, description: "Descrição do Item 13 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 14, name: "Item 14", price: 75.00, description: "Descrição do Item 14 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 15, name: "Item 15", price: 80.00, description: "Descrição do Item 15 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 16, name: "Item 16", price: 85.00, description: "Descrição do Item 16 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 17, name: "Item 17", price: 90.00, description: "Descrição do Item 17 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 18, name: "Item 18", price: 95.00, description: "Descrição do Item 18 aqui.", imagens: ["placeholder.jpg", "placeholder2.jpg"] }
        
    ];

    function displayProducts(products) {
        const itemsContainer = document.getElementById('itemsContainer');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'item';
            productDiv.innerHTML = `
                <img src="${product.imagens[0]}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                <input type="number" min="1" value="1" id="qty-${product.id}" class="quantity">
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Adicionar ao Carrinho</button>
                <button onclick="window.location.href='detalhes_produto.html?id=${product.id}'">Ver Detalhes</button>
            `;
            itemsContainer.appendChild(productDiv);
        });

        // Adiciona os eventos de clique nos botões de adicionar ao carrinho
        const buttons = document.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                const quantity = parseInt(document.getElementById(`qty-${id}`).value, 10);

                const product = {
                    id: id,
                    name: name,
                    price: price,
                    quantity: quantity
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const found = cart.find(p => p.id === id);
                if (found) {
                    found.quantity += quantity;
                } else {
                    cart.push(product);
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                showNotification(`Adicionado ${quantity} do ${name} ao carrinho!`);
            });
        });
    }

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    displayProducts(products);

    function filterItems() {
        const searchText = document.getElementById('searchBox').value.toLowerCase();
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchText));
        displayProducts(filteredProducts);
    }

    // Função para obter parâmetros da URL
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    // Carregar detalhes do produto na página de detalhes
    if (document.querySelector('.produto')) {
        const queryParams = getQueryParams();
        const produtoId = parseInt(queryParams.id, 10);
        const produto = products.find(p => p.id === produtoId);

        if (produto) {
            document.getElementById('produto-nome').textContent = produto.name;
            document.getElementById('produto-preco').textContent = `R$ ${produto.price.toFixed(2)}`;
            document.getElementById('produto-descricao').textContent = produto.description;
            document.getElementById('imagem-principal').src = produto.imagens[0];

            const miniaturas = document.querySelector('.miniaturas');
            produto.imagens.forEach(imagem => {
                const img = document.createElement('img');
                img.src = imagem;
                img.alt = "Miniatura";
                img.onclick = () => trocarImagem(imagem);
                miniaturas.appendChild(img);
            });

            // Função para trocar a imagem principal
            window.trocarImagem = function(imagem) {
                document.getElementById('imagem-principal').src = imagem;
            };

            // Função para adicionar ao carrinho
            window.adicionarAoCarrinho = function() {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const itemIndex = cart.findIndex(item => item.id === produto.id);
                if (itemIndex > -1) {
                    cart[itemIndex].quantity += 1;
                } else {
                    cart.push({ ...produto, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                showNotification('Produto adicionado ao carrinho!');
            };

            // Função para submeter uma avaliação
            window.submitReview = function(event) {
                event.preventDefault();
                const nome = document.getElementById('avaliacao-nome').value;
                const comentario = document.getElementById('avaliacao-comentario').value;
                const listaAvaliacoes = document.getElementById('lista-avaliacoes');

                const avaliacao = document.createElement('li');
                avaliacao.textContent = `${nome}: ${comentario}`;
                listaAvaliacoes.appendChild(avaliacao);

                document.getElementById('form-avaliacao').reset();
            };
        } else {
            alert("Produto não encontrado");
            window.location.href = 'inicial.html';
        }
    }

    // Expondo funções globais
    window.filterItems = filterItems;
    window.submitReview = submitReview;
});