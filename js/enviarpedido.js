// js/enviarpedido.js

/**
 * Coleta todos os dados do formulário e formata para envio
 */

// js/enviarpedido.js

function coletarDadosPedido() {
    const form = document.getElementById('itens-carrinho');
    
    // Função auxiliar para obter o valor de um campo de forma segura (evita o erro 'undefined')
    const getFormValue = (field) => {
        // Se o elemento existe (form[field]), retorna o seu valor. Caso contrário, retorna uma string vazia.
        return form[field] ? form[field].value : '';
    };

    // 1. Prepara a string de endereço combinado
    let enderecoCompleto = "";
    const tipoServico = document.querySelector('input[name="tipo_servico"]:checked').value;
    
    if (tipoServico === 'entrega') {
        // Usando a função auxiliar para garantir que as variáveis nunca sejam 'undefined'
        const rua = getFormValue('rua') || 'N/A';
        const bairro = getFormValue('bairro') || 'N/A';
        const numero = getFormValue('numero') || 'S/N'; // 'S/N' é uma string de fallback, não 'N/A'
        const cidade = getFormValue('cidade') || 'N/A';
        const referencia = getFormValue('referencia') || '';
        
        // Formato: (rua, bairro - numero; referencia)
        enderecoCompleto = `${rua}, ${bairro} - ${numero} (${cidade})`;
        if (referencia) {
            enderecoCompleto += ` | Ref: ${referencia}`;
        }
    }
    
    // 2. Coleta dados e usa o novo campo de endereço
    const dados = {
        // Usando a função auxiliar para garantir que os campos básicos também existam, se necessário
        nome: getFormValue('nome'),
        telefone: getFormValue('telefone'),
        
        doces_escolhidos: getFormValue('doces_escolhidos')
            .split('\n') 
            .map(item => {
                if (item.trim() === '') return null;
                const partes = item.split(' — ');
                return partes[0].trim(); 
            })
            .filter(item => item !== null)
            .join(', '),
        
        data: getFormValue('data'),
        obs: getFormValue('obs'),
        total: getFormValue('total'),
        metodo_pagamento: document.querySelector('input[name="metodo_pagamento"]:checked') ? document.querySelector('input[name="metodo_pagamento"]:checked').value : '',
        tipo_servico: tipoServico,
        
        // Novo campo para o Apps Script
        endereco_completo: enderecoCompleto 
    };
    
    return dados;
}

/**
 * Formata a mensagem para WhatsApp
 */
function formatarMensagemWhatsApp(dados) {
    const emojis = {
        dinheiro: '💰',
        cartao: '💳',
        pix: '⚡',
        retirada: '🏪',
        entrega: '🚚'
    };
    
    let mensagem = `*NOVO PEDIDO - SWEET DELÍCIA* 🍰\n\n`;
    mensagem += `*Cliente:* ${dados.nome}\n`;
    mensagem += `*Telefone:* ${dados.telefone}\n\n`;
    
    mensagem += `*Tipo de Serviço:* ${emojis[dados.tipo_servico]} ${dados.tipo_servico === 'retirada' ? 'Retirada na Loja' : 'Entrega'}\n`;
    
    if (dados.tipo_servico === 'entrega') {
        mensagem += `*Endereço:* ${dados.rua}, ${dados.numero} - ${dados.bairro}, ${dados.cidade}\n`;
        if (dados.referencia) {
            mensagem += `*Referência:* ${dados.referencia}\n`;
        }
    }
    
    mensagem += `\n*Doces Escolhidos:*\n${dados.doces_escolhidos}\n\n`;
    mensagem += `*Data Desejada:* ${dados.data}\n`;
    mensagem += `*Método de Pagamento:* ${emojis[dados.metodo_pagamento]} ${dados.metodo_pagamento.charAt(0).toUpperCase() + dados.metodo_pagamento.slice(1)}\n`;
    mensagem += `*Valor Total:* R$ ${dados.total}\n`;
    
    if (dados.obs) {
        mensagem += `\n*Observações:*\n${dados.obs}\n`;
    }
    
    mensagem += `\n---\nPedido recebido via site Sweet Delícia`;
    
    return mensagem;
}

/**
 * Valida se todos os campos obrigatórios estão preenchidos
 */
function validarPedido(dados) {
    const erros = [];
    
    if (!dados.nome.trim()) erros.push('Nome é obrigatório');
    if (!dados.telefone.trim()) erros.push('Telefone é obrigatório');
    if (!dados.doces_escolhidos.trim()) erros.push('Nenhum doce selecionado');
    if (!dados.data.trim()) erros.push('Data é obrigatória');
    if (!dados.total.trim() || dados.total === 'R$ 0,00') erros.push('Valor total inválido');
    
    if (dados.tipo_servico === 'entrega') {
        if (!dados.rua.trim()) erros.push('Rua é obrigatória para entrega');
        if (!dados.bairro.trim()) erros.push('Bairro é obrigatório para entrega');
        if (!dados.numero.trim()) erros.push('Número é obrigatório para entrega');
    }
    
    return erros;
}

/**
 * Função principal para enviar pedido
 */
async function enviarPedido(event) {
    event.preventDefault();
    
    const botao = event.target;
    const textoOriginal = botao.textContent;
    
    try {
        // 1. Coleta dados
        const dados = coletarDadosPedido();

        // ADICIONE ESTE LOG AQUI PARA VERIFICAR OS DADOS COLETADOS
        console.log('Dados COLETADOS do formulário:', dados);
        
        // 2. Valida dados
        const erros = validarPedido(dados);
        if (erros.length > 0) {
            alert(`❌ Erros encontrados:\n\n${erros.join('\n')}`);
            return;
        }
        
        // 3. Desabilita botão e mostra loading
        botao.disabled = true;
        botao.textContent = 'Enviando...';
        
        // 4. Envia para Google Apps Script
        await enviarParaGoogleScript(dados);
        
        // 5. Envia para WhatsApp
        await enviarParaWhatsApp(dados);
        
        // 6. Feedback de sucesso
        alert('✅ Pedido enviado com sucesso! Em breve entraremos em contato para confirmar.');
        
        // 7. Limpa formulário (opcional)
        // document.getElementById('itens-carrinho').reset();
        
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        alert(`❌ Erro ao enviar pedido: ${error.message}`);
    } finally {
        // Reabilita botão
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

// Adiciona evento ao formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('itens-carrinho');
    const botaoEnviar = form.querySelector('button[type="submit"]');
    
    if (botaoEnviar) {
        botaoEnviar.addEventListener('click', enviarPedido);
    }
});

