function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let lista = document.getElementById("lista-carrinho");
    let total = 0;

    lista.innerHTML = "";

    carrinho.forEach((item, index) => {
        let precoNum = parseFloat(item.preco.replace("R$", "").replace(",", "."));
        total += precoNum * item.quantidade;

        let div = document.createElement("div");
        div.classList.add("item-carrinho");

        div.innerHTML = `
            <span class="item-info">${item.quantidade}x ${item.nome} — ${item.preco}</span>
            <button class="remove-btn" data-index="${index}">Remover</button>
        `;

        lista.appendChild(div);
    });

    document.getElementById("total").textContent = 
        "Total: R$ " + total.toFixed(2).replace(".", ",");

    removerItens();
}

function removerItens() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            let index = btn.getAttribute("data-index");
            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            carrinho.splice(index, 1);

            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            carregarCarrinho();
        });
    });
}

document.getElementById("finalizar").addEventListener("click", () => {
    window.location.href = "pedido.html";
});

carregarCarrinho();
