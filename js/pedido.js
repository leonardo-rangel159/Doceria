function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let lista = document.getElementById("lista-carrinho");
    let total = 0;

    // Limpa o textarea
    lista.value = "Resumo do Pedido:\n\n";

    carrinho.forEach((item) => {
        let precoNum = parseFloat(item.preco.replace("R$", "").replace(",", "."));
        total += precoNum * item.quantidade;

        lista.value += `${item.quantidade}x ${item.nome} — ${item.preco}\n`;
    });

    document.getElementById("total").value =
        "R$ " + total.toFixed(2).replace(".", ",");
    }

    carregarCarrinho();