function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    // Altere a referência para o elemento textarea (que agora tem o ID lista-carrinho)
    let textareaDoces = document.getElementById("lista-carrinho"); 
    
    let totalElemento = document.getElementById("total");
    let total = 0;
    
    // Inicializa as strings que serão preenchidas
    let itensParaTextarea = "";

    carrinho.forEach((item, index) => {
        // 1. Cálculo do preço e total (mantido)
        let precoNum = parseFloat(item.preco.replace("R$", "").replace(",", "."));
        let subtotalItem = precoNum * item.quantidade;
        total += subtotalItem;
        
        // Formato para o textarea: Quantidade x Nome — R$ Valor Unitário
        itensParaTextarea += `${item.quantidade}x ${item.nome} — ${item.preco}\n`;
    });

    // 2. Preenche o <textarea>
    // Se o carrinho estiver vazio, exibe uma mensagem.
    if (itensParaTextarea === "") {
        textareaDoces.value = "Nenhum doce escolhido.";
    } else {
        textareaDoces.value = itensParaTextarea.trim();
    }
    
    // 3. Preenche o <input id="total">
    let totalFormatado = "R$ " + total.toFixed(2).replace(".", ",");
    
    // Se o <input id="total"> for usado apenas para exibição
    totalElemento.value = totalFormatado; 
    
    // Se o <input id="total"> for usado para o formulário, mas você quer o valor numérico puro
    // O valor do input deve ser o valor numérico, o R$ é apenas para exibição.
    // Use o `total.toFixed(2).replace(".", ",")` para o valor que será enviado, se preferir.
    // Exemplo para o valor ser enviado no formato pt-BR (R$ 10,50):
    // totalElemento.value = total.toFixed(2).replace(".", ",");
}

carregarCarrinho();
