async function verificarData() {
    const inputData = document.querySelector('input[name="data"]');
    let data = inputData.value;

    if (!data) return;

    let resp = await fetch(`${API_URL}?data=${data}`);
    let status = await resp.text();

    if (status === "indisponivel") {
        alert("⚠️ Essa data está cheia de encomendas. Escolha outra!");
        inputData.value = "";
    }
}

// Evita datas passadas
let hoje = new Date().toISOString().split("T")[0];
document.querySelector('input[name="data"]').setAttribute("min", hoje);

// Verifica a disponibilidade sempre que o usuário muda a data
document.querySelector('input[name="data"]').addEventListener("change", verificarData);
