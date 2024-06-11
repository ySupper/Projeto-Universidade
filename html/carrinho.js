document.addEventListener('DOMContentLoaded', function() {
    const produtos = JSON.parse(localStorage.getItem('cart')) || [];
    const listaProdutos = document.querySelector('.lista-produtos');
    const cartaoSection = document.getElementById('cartao-section');
    const mensagemCompra = document.getElementById('mensagem-compra');
    let totalCarrinho = 0;

    produtos.forEach((produto, index) => {
        const itemProduto = document.createElement('li');
        itemProduto.textContent = `${produto.name} - ${produto.quantity}x R$ ${produto.price.toFixed(2)}`;
        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', () => removerProduto(index, produto.price * produto.quantity));
        itemProduto.appendChild(botaoRemover);
        listaProdutos.appendChild(itemProduto);
        totalCarrinho += produto.price * produto.quantity;
    });

    document.getElementById('total-carrinho').textContent = totalCarrinho.toFixed(2);

    function removerProduto(index, subTotal) {
        if (confirm("Você tem certeza que deseja remover este item do carrinho?")) {
            produtos.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(produtos));
            totalCarrinho -= subTotal;
            document.getElementById('total-carrinho').textContent = totalCarrinho.toFixed(2);
            document.location.reload();
        }
    }

    document.querySelector('.btn-remover-tudo').addEventListener('click', function() {
        if (confirm("Você tem certeza que deseja remover todos os itens do carrinho?")) {
            localStorage.removeItem('cart');
            listaProdutos.innerHTML = '';
            document.getElementById('total-carrinho').textContent = '0.00';
        }
    });

    document.querySelector('.btn-voltar').addEventListener('click', () => {
        window.location.href = 'inicial.html';
    });

    document.querySelector('.btn-finalizar').addEventListener('click', function() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        // Impedir a finalização de uma compra de 0 reais
        if (totalCarrinho === 0) {
            mensagemCompra.textContent = 'Não é possível finalizar uma compra com valor total de R$ 0.00.';
            mensagemCompra.style.display = 'block';
            return;
        }

        // Validação dos campos de endereço
        const requiredFields = document.querySelectorAll('.endereco input[required]');
        let allFieldsValid = true;

        requiredFields.forEach(field => {
            const errorElement = document.getElementById(`error-${field.id}`);
            if (!field.checkValidity()) {
                errorElement.textContent = 'Preencha este campo.';
                errorElement.style.display = 'block';
                allFieldsValid = false;
            } else {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });

        if (!allFieldsValid) {
            return;
        }

        // Validação dos campos do cartão de crédito
        if (paymentMethod === 'credit-card') {
            const nomeCartao = document.getElementById('nome-cartao').value;
            const numeroCartao = document.getElementById('numero-cartao').value;
            const validadeCartao = document.getElementById('validade-cartao').value;
            const cvvCartao = document.getElementById('cvv-cartao').value;

            if (!nomeCartao) {
                document.getElementById('error-nome-cartao').textContent = 'Preencha este campo.';
                document.getElementById('error-nome-cartao').style.display = 'block';
            } else {
                document.getElementById('error-nome-cartao').textContent = '';
                document.getElementById('error-nome-cartao').style.display = 'none';
            }
            if (!numeroCartao) {
                document.getElementById('error-numero-cartao').textContent = 'Preencha este campo.';
                document.getElementById('error-numero-cartao').style.display = 'block';
            } else {
                document.getElementById('error-numero-cartao').textContent = '';
                document.getElementById('error-numero-cartao').style.display = 'none';
            }
            if (!validadeCartao) {
                document.getElementById('error-validade-cartao').textContent = 'Preencha este campo.';
                document.getElementById('error-validade-cartao').style.display = 'block';
            } else {
                document.getElementById('error-validade-cartao').textContent = '';
                document.getElementById('error-validade-cartao').style.display = 'none';
            }
            if (!cvvCartao) {
                document.getElementById('error-cvv-cartao').textContent = 'Preencha este campo.';
                document.getElementById('error-cvv-cartao').style.display = 'block';
            } else {
                document.getElementById('error-cvv-cartao').textContent = '';
                document.getElementById('error-cvv-cartao').style.display = 'none';
            }

            if (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao) {
                return;
            }
        }

        // Exibe a mensagem de compra finalizada
        mensagemCompra.textContent = `Compra finalizada! Total: R$ ${totalCarrinho.toFixed(2)}\nForma de Pagamento: ${paymentMethod}`;
        mensagemCompra.style.display = 'block';

        // Limpa o carrinho após a compra
        localStorage.clear();
        listaProdutos.innerHTML = '';
        document.getElementById('total-carrinho').textContent = '0.00';
    });

    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                cartaoSection.style.display = 'block';
                document.querySelectorAll('.cartao input').forEach(input => input.setAttribute('required', 'required'));
            } else {
                cartaoSection.style.display = 'none';
                document.querySelectorAll('.cartao input').forEach(input => input.removeAttribute('required'));
            }
        });
    });

    // Mostrar a seção de cartão de crédito se a página carregar com "credit-card" selecionado
    if (document.querySelector('input[name="payment-method"]:checked').value === 'credit-card') {
        cartaoSection.style.display = 'block';
        document.querySelectorAll('.cartao input').forEach(input => input.setAttribute('required', 'required'));
    }
});
