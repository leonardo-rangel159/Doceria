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
