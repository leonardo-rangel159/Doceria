// js/enviarpedido.js

/**
 * Configurações e constantes
 */
const CONFIG = {
  emojis: {
    dinheiro: '💰',
    cartao: '💳',
    pix: '⚡',
    retirada: '🏪',
    entrega: '🚚'
  },
  fallbacks: {
    endereco: 'N/A',
    numero: 'S/N',
    referencia: ''
  }
};

/**
 * Cache de elementos DOM
 */
const DOM = {
  form: null,
  elementos: {}
};

/**
 * Inicializa o módulo
 */
function initEnvioPedido() {
  DOM.form = document.getElementById('itens-carrinho');
  
  if (!DOM.form) {
    console.error('Formulário não encontrado');
    return;
  }
  
  cacheElementos();
  setupEventListeners();
}

/**
 * Cache de elementos frequentemente acessados
 */
function cacheElementos() {
  const campos = ['nome', 'telefone', 'doces_escolhidos', 'data', 'obs', 
                  'total', 'rua', 'bairro', 'numero', 'cidade', 'referencia'];
  
  campos.forEach(campo => {
    DOM.elementos[campo] = DOM.form.querySelector(`[name="${campo}"]`);
  });
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
  const botaoEnviar = DOM.form.querySelector('button[type="submit"]');
  
  if (botaoEnviar) {
    botaoEnviar.addEventListener('click', handleEnviarPedido);
  }
}

/**
 * Obtém valor seguro de um campo do formulário
 */
function getFormValue(fieldName) {
  const elemento = DOM.elementos[fieldName];
  return elemento ? elemento.value.trim() : '';
}

/**
 * Obtém valor de radio button selecionado
 */
function getRadioValue(name) {
  const radio = DOM.form.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : '';
}

/**
 * Formata endereço completo
 */
function formatarEnderecoCompleto() {
  const tipoServico = getRadioValue('tipo_servico');
  
  if (tipoServico !== 'entrega') return '';
  
  const rua = getFormValue('rua') || CONFIG.fallbacks.endereco;
  const bairro = getFormValue('bairro') || CONFIG.fallbacks.endereco;
  const numero = getFormValue('numero') || CONFIG.fallbacks.numero;
  const cidade = getFormValue('cidade') || CONFIG.fallbacks.endereco;
  const referencia = getFormValue('referencia');
  
  let endereco = `${rua}, ${bairro} - ${numero} (${cidade})`;
  
  if (referencia) {
    endereco += ` | Ref: ${referencia}`;
  }
  
  return endereco;
}

/**
 * Processa os doces escolhidos
 */
function processarDocesEscolhidos(docesStr) {
  return docesStr
    .split('\n')
    .map(item => item.trim())
    .filter(item => item !== '')
    .map(item => {
      const partes = item.split(' — ');
      return partes[0]?.trim() || '';
    })
    .filter(item => item !== '')
    .join(', ');
}

/**
 * Coleta todos os dados do formulário
 */
function coletarDadosPedido() {
  const tipoServico = getRadioValue('tipo_servico');
  const metodoPagamento = getRadioValue('metodo_pagamento');
  
  return {
    nome: getFormValue('nome'),
    telefone: getFormValue('telefone'),
    doces_escolhidos: processarDocesEscolhidos(getFormValue('doces_escolhidos')),
    data: getFormValue('data'),
    obs: getFormValue('obs'),
    total: getFormValue('total'),
    metodo_pagamento: metodoPagamento,
    tipo_servico: tipoServico,
    endereco_completo: formatarEnderecoCompleto(),
    // Mantém campos individuais para validação
    rua: getFormValue('rua'),
    bairro: getFormValue('bairro'),
    numero: getFormValue('numero'),
    cidade: getFormValue('cidade'),
    referencia: getFormValue('referencia')
  };
}

/**
 * Validação de campos obrigatórios
 */
function validarPedido(dados) {
  const erros = [];
  const camposObrigatorios = [
    { campo: dados.nome, mensagem: 'Nome é obrigatório' },
    { campo: dados.telefone, mensagem: 'Telefone é obrigatório' },
    { campo: dados.doces_escolhidos, mensagem: 'Nenhum doce selecionado' },
    { campo: dados.data, mensagem: 'Data é obrigatória' },
    { campo: dados.total, mensagem: 'Valor total inválido' }
  ];
  
  // Valida campos gerais
  camposObrigatorios.forEach(({ campo, mensagem }) => {
    if (!campo || (typeof campo === 'string' && !campo.trim())) {
      erros.push(mensagem);
    }
  });
  
  // Valida valor total
  if (dados.total === 'R$ 0,00' || dados.total === '0,00') {
    erros.push('Valor total inválido');
  }
  
  // Valida entrega
  if (dados.tipo_servico === 'entrega') {
    const camposEntrega = [
      { campo: dados.rua, mensagem: 'Rua é obrigatória para entrega' },
      { campo: dados.bairro, mensagem: 'Bairro é obrigatório para entrega' },
      { campo: dados.numero, mensagem: 'Número é obrigatório para entrega' }
    ];
    
    camposEntrega.forEach(({ campo, mensagem }) => {
      if (!campo || !campo.trim()) erros.push(mensagem);
    });
  }
  
  // Valida método de pagamento
  if (!dados.metodo_pagamento) {
    erros.push('Método de pagamento é obrigatório');
  }
  
  return erros;
}

/**
 * Formata mensagem para WhatsApp
 */
function formatarMensagemWhatsApp(dados) {
  const { emojis } = CONFIG;
  const lines = [];
  
  lines.push(`*NOVO PEDIDO - SWEET DELÍCIA* 🍰\n`);
  lines.push(`*Cliente:* ${dados.nome}`);
  lines.push(`*Telefone:* ${dados.telefone}\n`);
  
  const tipoServico = dados.tipo_servico === 'retirada' ? 'Retirada na Loja' : 'Entrega';
  lines.push(`*Tipo de Serviço:* ${emojis[dados.tipo_servico]} ${tipoServico}`);
  
  if (dados.tipo_servico === 'entrega') {
    lines.push(`*Endereço:* ${dados.endereco_completo.replace(' | Ref:', '\n*Referência:*')}`);
  }
  
  lines.push(`\n*Doces Escolhidos:*\n${dados.doces_escolhidos}\n`);
  lines.push(`*Data Desejada:* ${dados.data}`);
  
  const metodoPagamentoFormatado = dados.metodo_pagamento 
    ? `${dados.metodo_pagamento.charAt(0).toUpperCase()}${dados.metodo_pagamento.slice(1)}`
    : 'Não informado';
    
  lines.push(`*Método de Pagamento:* ${emojis[dados.metodo_pagamento] || ''} ${metodoPagamentoFormatado}`);
  lines.push(`*Valor Total:* R$ ${dados.total}`);
  
  if (dados.obs) {
    lines.push(`\n*Observações:*\n${dados.obs}`);
  }
  
  lines.push(`\n---\nPedido recebido via site Sweet Delícia`);
  
  return lines.join('\n');
}

/**
 * Handle do envio do pedido
 */
async function handleEnviarPedido(event) {
  event.preventDefault();
  
  const botao = event.currentTarget;
  const textoOriginal = botao.textContent;
  
  try {
    // Coleta e valida dados
    const dados = coletarDadosPedido();
    console.log('Dados coletados:', dados);
    
    const erros = validarPedido(dados);
    
    if (erros.length > 0) {
      showErrorAlert(erros);
      return;
    }
    
    // Prepara botão para envio
    botao.disabled = true;
    botao.textContent = 'Enviando...';
    
    // Executa envios em paralelo (se possível)
    await Promise.allSettled([
      enviarParaGoogleScript(dados),
      enviarParaWhatsApp(dados)
    ]);
    
    showSuccessAlert();
    
  } catch (error) {
    console.error('Erro no envio:', error);
    showErrorAlert([error.message || 'Erro desconhecido']);
  } finally {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  }
}

/**
 * Alertas melhorados
 */
function showErrorAlert(erros) {
  const mensagem = Array.isArray(erros) 
    ? `❌ Erros encontrados:\n\n${erros.join('\n')}`
    : `❌ ${erros}`;
  
  alert(mensagem);
}

function showSuccessAlert() {
  alert('✅ Pedido enviado com sucesso! Em breve entraremos em contato para confirmar.');
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnvioPedido);
} else {
  initEnvioPedido();
}

// Exporta funções principais se estiver usando módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    coletarDadosPedido,
    formatarMensagemWhatsApp,
    validarPedido,
    handleEnviarPedido
  };
}