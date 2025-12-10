// Botões de quantidade
document.querySelectorAll(".item").forEach(item => {
    let input = item.querySelector("input");
    let mais = item.querySelector(".mais");
    let menos = item.querySelector(".menos");

    mais.addEventListener("click", () => {
        input.value = Number(input.value) + 1;
    });

    menos.addEventListener("click", () => {
        if (input.value > 1) input.value = Number(input.value) - 1;
    });
});

// Carrinho simples (só guarda no localStorage)
document.querySelectorAll(".add-carrinho").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let item = btn.parentElement;
        let nome = item.querySelector("h3").textContent;
        let preco = item.querySelector(".preco").textContent;
        let qtd = item.querySelector("input").value;

        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: qtd
        });

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        alert("Item adicionado ao carrinho!");
    });
});
