document.addEventListener('DOMContentLoaded', function() {
    // Função para obter parâmetros da URL
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    // Dados fictícios dos produtos
    const produtos = [
        { id: 1, nome: "Item 1", preco: 100.00, descricao: "Descrição detalhada do produto 1.", imagens: ["placeholder.jpg", "placeholder2.jpg"] },
        { id: 2, nome: "Item 2", preco: 150.00, descricao: "Descrição detalhada do produto 2.", imagens: ["placeholder2.jpg", "placeholder.jpg"] },
        { id: 3, nome: "Item 3", preco: 200.00, descricao: "Descrição detalhada do produto 3.", imagens: ["placeholder.jpg", "placeholder2.jpg"] }
    ];

    const queryParams = getQueryParams();
    const produtoId = parseInt(queryParams.id, 10);
    const produto = produtos.find(p => p.id === produtoId);

    if (produto) {
        document.getElementById('produto-nome').textContent = produto.nome;
        document.getElementById('produto-preco').textContent = `R$ ${produto.preco.toFixed(2)}`;
        document.getElementById('produto-descricao').textContent = produto.descricao;
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
            showNotification(`Adicionado 1 do ${produto.nome} ao carrinho!`); // Adiciona a notificação aqui
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
});

// Função para mostrar notificação de adicionado ao carrinho
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
