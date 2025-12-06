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

    document.getElementById("total").value = "R$ " + total.toFixed(2).replace(".", ",");
}

// Evita datas passadas
let hoje = new Date().toISOString().split("T")[0];
document.querySelector('input[name="data"]').setAttribute("min", hoje);

// Verifica a disponibilidade sempre que o usuário muda a data
document.querySelector('input[name="data"]').addEventListener("change", async function() {
    let data = this.value;
    if (!data) return;

    let resp = await fetch(`${API_URL}?data=${data}`);
    let status = await resp.text();

    if (status === "indisponivel") {
        alert("⚠️ Essa data está cheia de encomendas. Escolha outra!");
        this.value = "";
    }
});

// Envio do formulário
document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    let payload = {
        nome: document.querySelector('input[name="nome"]').value,
        telefone: document.querySelector('input[name="telefone"]').value,
        doces_escolhidos: document.querySelector('#lista-carrinho').value,
        data: document.querySelector('input[name="data"]').value,
        obs: document.querySelector('textarea[name="obs"]').value,
        total: document.querySelector('#total').value
    };

    let resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    let txt = await resp.text();
    console.log("Retorno:", txt);

    if (txt.trim() === "salvo") {
        alert("Pedido enviado com sucesso!");
        localStorage.removeItem("carrinho");
        window.location.href = "index.html";
    } else {
        alert("Erro ao salvar pedido: " + txt);
    }
});

carregarCarrinho();