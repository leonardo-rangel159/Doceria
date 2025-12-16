// js/enviarpedido.js - VERSÃO COMPLETA COM TODOS OS DADOS

console.log('📦 enviarpedido.js carregado');

/**
 * Coleta TODOS os dados do formulário
 */
function coletarTodosDados() {
  console.log('📋 Coletando todos os dados do formulário...');
  
  // 1. Dados básicos do cliente
  const dados = {
    // Dados pessoais
    nome: document.querySelector('input[name="nome"]')?.value.trim() || '',
    telefone: document.querySelector('input[name="telefone"]')?.value.trim() || '',
    
    // Itens do carrinho
    doces_escolhidos: document.getElementById('lista-carrinho')?.value.trim() || '',
    
    // Data e observações
    data: document.querySelector('input[name="data"]')?.value.trim() || '',
    obs: document.querySelector('textarea[name="obs"]')?.value.trim() || '',
    
    // Valor total
    total: document.getElementById('total')?.value.trim() || '',
    
    // Método de pagamento (RADIO BUTTON)
    metodo_pagamento: document.querySelector('input[name="metodo_pagamento"]:checked')?.value || '',
    
    // Tipo de serviço (RADIO BUTTON)
    tipo_servico: document.querySelector('input[name="tipo_servico"]:checked')?.value || '',
    
    // Campos de endereço (podem estar vazios se for retirada)
    rua: document.querySelector('input[name="rua"]')?.value.trim() || '',
    bairro: document.querySelector('input[name="bairro"]')?.value.trim() || '',
    numero: document.querySelector('input[name="numero"]')?.value.trim() || '',
    cidade: document.querySelector('input[name="cidade"]')?.value.trim() || 'São Fidelis',
    referencia: document.querySelector('input[name="referencia"]')?.value.trim() || ''
  };
  
  // 2. Processa os doces para um formato mais limpo
  if (dados.doces_escolhidos && dados.doces_escolhidos !== 'Nenhum doce escolhido.') {
    // Remove linhas vazias e formata melhor
    dados.doces_formatados = dados.doces_escolhidos
      .split('\n')
      .map(item => item.trim())
      .filter(item => item && item !== 'Nenhum doce escolhido.')
      .join(' | ');
  } else {
    dados.doces_formatados = 'Nenhum doce selecionado';
  }
  
  // 3. Formata o endereço completo
  if (dados.tipo_servico === 'entrega' && dados.rua && dados.bairro) {
    dados.endereco_completo = `${dados.rua}, ${dados.numero || 'S/N'} - ${dados.bairro}, ${dados.cidade}`;
    if (dados.referencia && dados.referencia.trim() !== '') {
      dados.endereco_completo += ` (Ref: ${dados.referencia})`;
    }
  } else {
    dados.endereco_completo = 'Retirada na loja';
  }
  
  // 4. Formata o método de pagamento para exibição
  const pagamentoMap = {
    'dinheiro': 'Dinheiro',
    'cartao': 'Cartão (débito/crédito)',
    'pix': 'PIX'
  };
  dados.metodo_pagamento_formatado = pagamentoMap[dados.metodo_pagamento] || dados.metodo_pagamento;
  
  // 5. Formata o tipo de serviço para exibição
  dados.tipo_servico_formatado = dados.tipo_servico === 'retirada' ? 'Retirada na loja' : 'Entrega';
  
  console.log('✅ Dados coletados completos:', dados);
  return dados;
}

/**
 * Validação completa dos dados
 */
function validarDadosCompletos(dados) {
  console.log('🔍 Validando dados...');
  const erros = [];
  
  // 1. Validação de nome
  if (!dados.nome || dados.nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  // 2. Validação de telefone
  const telefoneLimpo = dados.telefone.replace(/\D/g, '');
  if (!telefoneLimpo || telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    erros.push('Telefone inválido. Use formato: (00) 90000-0000');
  }
  
  // 3. Validação de itens do carrinho
  if (!dados.doces_escolhidos || dados.doces_escolhidos === 'Nenhum doce escolhido.') {
    erros.push('Nenhum doce selecionado no carrinho');
  }
  
  // 4. Validação de data
  if (!dados.data) {
    erros.push('Data de retirada/entrega é obrigatória');
  }
  
  // 5. Validação de valor total
  if (!dados.total || dados.total === 'R$ 0,00' || dados.total.includes('0,00')) {
    erros.push('Valor total inválido. Carrinho vazio?');
  }
  
  // 6. Validação de método de pagamento
  if (!dados.metodo_pagamento) {
    erros.push('Selecione um método de pagamento');
  }
  
  // 7. Validação de tipo de serviço
  if (!dados.tipo_servico) {
    erros.push('Selecione o tipo de serviço (retirada ou entrega)');
  }
  
  // 8. Validação específica para entrega
  if (dados.tipo_servico === 'entrega') {
    if (!dados.rua || dados.rua.trim() === '') {
      erros.push('Rua é obrigatória para entrega');
    }
    if (!dados.bairro || dados.bairro.trim() === '') {
      erros.push('Bairro é obrigatório para entrega');
    }
    if (!dados.numero || dados.numero.trim() === '') {
      erros.push('Número é obrigatório para entrega');
    }
  }
  
  console.log(`✅ Validação concluída: ${erros.length} erro(s) encontrado(s)`);
  return erros;
}

/**
 * Envia dados para Google Sheets
 */
async function enviarParaGoogleSheets(dados) {
  console.log('📤 Preparando envio para Google Sheets...');
  
  // Modo teste - apenas simula
  if (CONFIG.testMode) {
    console.log('⚠️ MODO TESTE - Dados não serão enviados realmente');
    console.log('📋 Dados que seriam enviados:', dados);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { sucesso: true, modo: 'teste' };
  }
  
  try {
    // Prepara todos os dados para envio
    const dadosParaEnviar = {
      // Timestamp e status
      timestamp: new Date().toLocaleString('pt-BR'),
      status: 'novo',
      
      // Dados do cliente
      nome_cliente: dados.nome,
      telefone_cliente: dados.telefone,
      
      // Itens do pedido
      doces_brutos: dados.doces_escolhidos,
      doces_formatados: dados.doces_formatados,
      
      // Data e observações
      data_entrega: dados.data,
      observacoes: dados.obs || 'Nenhuma',
      
      // Valores e pagamento
      valor_total: dados.total,
      metodo_pagamento: dados.metodo_pagamento,
      metodo_pagamento_formatado: dados.metodo_pagamento_formatado,
      
      // Tipo de serviço
      tipo_servico: dados.tipo_servico,
      tipo_servico_formatado: dados.tipo_servico_formatado,
      
      // Endereço (completo e em partes)
      endereco_completo: dados.endereco_completo,
      rua: dados.rua || '',
      bairro: dados.bairro || '',
      numero: dados.numero || '',
      cidade: dados.cidade || '',
      referencia: dados.referencia || '',
      
      // Informações extras
      origem: 'Site Sweet Delícia',
      data_processamento: new Date().toISOString()
    };
    
    console.log('📨 Dados preparados para envio:', dadosParaEnviar);
    
    // Cria FormData
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(dadosParaEnviar)) {
      formData.append(key, value);
    }
    
    // Envia para API
    console.log(`🌐 Enviando para: ${CONFIG.googleScriptUrl}`);
    const response = await fetch(CONFIG.googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: formData.toString()
    });
    
    console.log('✅ Requisição enviada (no-cors)');
    
    // Nota: Com 'no-cors' não podemos ler a resposta
    // Mas se chegou aqui, assumimos sucesso
    return { 
      sucesso: true, 
      dados_enviados: dadosParaEnviar,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar para API:', error);
    throw new Error(`Falha na comunicação: ${error.message}`);
  }
}

/**
 * Formata mensagem detalhada para WhatsApp
 */
function formatarMensagemWhatsAppCompleta(dados) {
  console.log('💬 Formatando mensagem para WhatsApp...');
  
  const emojis = {
    dinheiro: '💰',
    cartao: '💳',
    pix: '⚡',
    retirada: '🏪',
    entrega: '🚚'
  };
  
  const pagamentoEmoji = emojis[dados.metodo_pagamento] || '💳';
  const servicoEmoji = dados.tipo_servico === 'retirada' ? emojis.retirada : emojis.entrega;
  
  let mensagem = '';
  
  // Cabeçalho
  mensagem += `*🍰 NOVO PEDIDO - SWEET DELÍCIA 🍰*\n\n`;
  
  // Dados do cliente
  mensagem += `*👤 CLIENTE:* ${dados.nome}\n`;
  mensagem += `*📱 TELEFONE:* ${dados.telefone}\n\n`;
  
  // Tipo de serviço
  mensagem += `*${servicoEmoji} TIPO DE SERVIÇO:* ${dados.tipo_servico_formatado}\n`;
  
  // Se for entrega, mostra endereço
  if (dados.tipo_servico === 'entrega' && dados.endereco_completo !== 'Retirada na loja') {
    mensagem += `*📍 ENDEREÇO:* ${dados.endereco_completo}\n`;
  }
  mensagem += `\n`;
  
  // Itens do pedido
  mensagem += `*🛒 ITENS DO PEDIDO:*\n`;
  mensagem += `${dados.doces_escolhidos}\n\n`;
  
  // Data e pagamento
  mensagem += `*📅 DATA DESEJADA:* ${dados.data}\n`;
  mensagem += `*${pagamentoEmoji} PAGAMENTO:* ${dados.metodo_pagamento_formatado}\n`;
  mensagem += `*💰 VALOR TOTAL:* ${dados.total}\n\n`;
  
  // Observações (se houver)
  if (dados.obs && dados.obs.trim() !== '') {
    mensagem += `*📝 OBSERVAÇÕES:*\n`;
    mensagem += `${dados.obs}\n\n`;
  }
  
  // Rodapé
  mensagem += `---\n`;
  mensagem += `📋 *Pedido recebido via site Sweet Delícia*\n`;
  mensagem += `⏰ *Hora do pedido:* ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}\n`;
  mensagem += `🔢 *ID aproximado:* ${Date.now().toString().slice(-6)}`;
  
  console.log('✅ Mensagem formatada:', mensagem);
  return mensagem;
}

/**
 * Abre WhatsApp com a mensagem
 */
function abrirWhatsAppComMensagem(mensagem) {
  console.log('📱 Preparando para abrir WhatsApp...');
  
  const telefoneEmpresa = CONFIG.telefoneEmpresa; // Do config.js
  const mensagemCodificada = encodeURIComponent(mensagem);
  const urlWhatsApp = `https://wa.me/${telefoneEmpresa}?text=${mensagemCodificada}`;
  
  console.log(`🌐 URL WhatsApp: ${urlWhatsApp.substring(0, 100)}...`);
  
  // Abre em nova aba
  window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
  
  return true;
}

/**
 * Limpa tudo após envio bem-sucedido
 */
function limparAposEnvio() {
  console.log('🧹 Limpando dados após envio...');
  
  // 1. Limpa carrinho do localStorage
  localStorage.removeItem('carrinho');
  
  // 2. Limpa formulário
  const form = document.getElementById('form-pedido');
  if (form) {
    form.reset();
  }
  
  // 3. Reseta campos específicos
  document.getElementById('lista-carrinho').value = 'Nenhum doce escolhido.';
  document.getElementById('total').value = 'R$ 0,00';
  
  // 4. Esconde campos de endereço se estiverem visíveis
  const camposEndereco = document.getElementById('campos-endereco');
  if (camposEndereco) {
    camposEndereco.style.display = 'none';
  }
  
  // 5. Reseta radios para padrão
  const retiradaRadio = document.getElementById('servico-retirada');
  if (retiradaRadio) {
    retiradaRadio.checked = true;
  }
  
  const dinheiroRadio = document.getElementById('pagamento-dinheiro');
  if (dinheiroRadio) {
    dinheiroRadio.checked = true;
  }
  
  console.log('✅ Limpeza concluída');
}

/**
 * Função principal de envio
 */
async function handleEnviarPedido(event) {
  console.log('🚀 === INICIANDO PROCESSO DE ENVIO ===');
  
  const botao = event.currentTarget;
  const textoOriginal = botao.textContent;
  
  try {
    // Previne comportamento padrão
    event.preventDefault();
    
    // 1. Coleta TODOS os dados
    const dados = coletarTodosDados();
    
    // 2. Validação completa
    const erros = validarDadosCompletos(dados);
    if (erros.length > 0) {
      alert(`❌ *ERROS ENCONTRADOS:*\n\n${erros.join('\n• ')}\n\nPor favor, corrija os dados e tente novamente.`);
      return;
    }
    
    // 3. Prepara interface
    botao.disabled = true;
    botao.textContent = 'Enviando...';
    botao.style.opacity = '0.7';
    
    // 4. Envia para Google Sheets
    console.log('📤 Enviando para sistema...');
    const resultadoAPI = await enviarParaGoogleSheets(dados);
    console.log('📥 Resposta do sistema:', resultadoAPI);
    
    // 5. Formata mensagem para WhatsApp
    const mensagemWhatsApp = formatarMensagemWhatsAppCompleta(dados);
    
    // 6. Envia para WhatsApp
    console.log('💬 Enviando para WhatsApp...');
    abrirWhatsAppComMensagem(mensagemWhatsApp);
    
    // 7. Feedback para o usuário
    if (CONFIG.testMode) {
      alert(`✅ *MODO TESTE - SIMULAÇÃO CONCLUÍDA!*\n\n📋 *Dados coletados:*\n• Nome: ${dados.nome}\n• Telefone: ${dados.telefone}\n• Data: ${dados.data}\n• Total: ${dados.total}\n• Pagamento: ${dados.metodo_pagamento_formatado}\n• Serviço: ${dados.tipo_servico_formatado}\n\n⚠️ *ATENÇÃO:* Dados NÃO foram enviados para o sistema real.\nPara ativar envio real, configure a API no config.js.`);
    } else {
      alert(`✅ *PEDIDO ENVIADO COM SUCESSO!*\n\n✓ Dados salvos no sistema\n✓ WhatsApp aberto para confirmação\n✓ Carrinho limpo\n\n📞 Em breve entraremos em contato para confirmar seu pedido!`);
    }
    
    // 8. Limpa tudo
    limparAposEnvio();
    
    // 9. Pergunta sobre redirecionamento
    setTimeout(() => {
      const confirmar = confirm('📋 Pedido processado!\n\nDeseja voltar à página inicial ou fazer um novo pedido?');
      if (confirmar) {
        window.location.href = 'index.html';
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ ERRO NO PROCESSO:', error);
    
    alert(`❌ *ERRO AO PROCESSAR PEDIDO*\n\n${error.message}\n\n📞 Por favor, entre em contato conosco diretamente pelo WhatsApp ou tente novamente.`);
    
  } finally {
    // Restaura botão
    botao.disabled = false;
    botao.textContent = textoOriginal;
    botao.style.opacity = '1';
    
    console.log('🏁 === PROCESSO DE ENVIO FINALIZADO ===');
  }
}

/**
 * Testa conexão com a API
 */
async function testarConexaoAPI() {
  console.log('🔍 Testando conexão com API...');
  
  if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.includes('SUA_URL')) {
    console.warn('⚠️ URL da API não configurada');
    CONFIG.testMode = true;
    return false;
  }
  
  try {
    // Testa com uma requisição GET simples
    await fetch(CONFIG.googleScriptUrl, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    console.log('🌐 Conexão com API: OK');
    CONFIG.testMode = false;
    return true;
    
  } catch (error) {
    console.warn('⚠️ Conexão com API falhou, ativando modo teste');
    CONFIG.testMode = true;
    return false;
  }
}

/**
 * Inicialização do sistema
 */
function init() {
  console.log('🔧 Inicializando sistema de pedidos...');
  console.log(`🌐 URL API: ${CONFIG.googleScriptUrl}`);
  console.log(`🔧 Modo: ${CONFIG.testMode ? 'TESTE' : 'PRODUÇÃO'}`);
  console.log(`📱 WhatsApp: ${CONFIG.telefoneEmpresa}`);
  
  // Encontra o botão
  const botaoEnviar = document.getElementById('btn-enviar-pedido');
  
  if (!botaoEnviar) {
    console.error('❌ Botão de envio não encontrado!');
    
    // Fallback: procura qualquer botão .btn
    const botaoFallback = document.querySelector('.btn, button[type="button"], button[type="submit"]');
    if (botaoFallback) {
      console.log('⚠️ Usando botão fallback:', botaoFallback);
      botaoFallback.id = 'btn-enviar-pedido';
      botaoFallback.addEventListener('click', handleEnviarPedido);
    }
    return;
  }
  
  console.log('✅ Botão encontrado, configurando...');
  
  // Adiciona evento
  botaoEnviar.addEventListener('click', handleEnviarPedido);
  
  // Testa conexão com API
  testarConexaoAPI().then(conectado => {
    if (conectado) {
      botaoEnviar.title = 'Modo produção - Dados serão salvos no sistema';
      botaoEnviar.style.backgroundColor = '#ff7a8a';
    } else {
      botaoEnviar.title = 'Modo teste - Dados não serão enviados para o sistema';
      botaoEnviar.style.backgroundColor = '#ffa8b0';
      botaoEnviar.style.opacity = '0.9';
    }
  });
  
  // Adiciona tooltip de ajuda
  botaoEnviar.addEventListener('mouseover', function() {
    if (CONFIG.testMode) {
      this.setAttribute('data-tooltip', 'MODO TESTE: Os dados serão exibidos, mas não enviados ao sistema');
    }
  });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
















// js/enviarpedido.js

/**
 * Configurações e constantes
 */
/*const CONFIG = {
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
/*const DOM = {
  form: null,
  elementos: {}
};

/**
 * Inicializa o módulo
 */
/*function initEnvioPedido() {
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
/*function cacheElementos() {
  const campos = ['nome', 'telefone', 'doces_escolhidos', 'data', 'obs', 
                  'total', 'rua', 'bairro', 'numero', 'cidade', 'referencia'];
  
  campos.forEach(campo => {
    DOM.elementos[campo] = DOM.form.querySelector(`[name="${campo}"]`);
  });
}

/**
 * Configura event listeners
 */
/*function setupEventListeners() {
  const botaoEnviar = DOM.form.querySelector('button[type="submit"]');
  
  if (botaoEnviar) {
    botaoEnviar.addEventListener('click', handleEnviarPedido);
  }
}

/**
 * Obtém valor seguro de um campo do formulário
 */
/*function getFormValue(fieldName) {
  const elemento = DOM.elementos[fieldName];
  return elemento ? elemento.value.trim() : '';
}

/**
 * Obtém valor de radio button selecionado
 */
/*function getRadioValue(name) {
  const radio = DOM.form.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : '';
}

/**
 * Formata endereço completo
 */
/*function formatarEnderecoCompleto() {
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
/*function processarDocesEscolhidos(docesStr) {
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
/*function coletarDadosPedido() {
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
    // Campos adicionais para validação
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
/*function validarPedido(dados) {
  const erros = [];
  const camposObrigatorios = [
    { campo: dados.nome, mensagem: 'Nome é obrigatório' },
    { campo: dados.telefone, mensagem: 'Telefone é obrigatório' },
    { campo: dados.doces_escolhidos, mensagem: 'Nenhum doce selecionado' },
    { campo: dados.data, mensagem: 'Data é obrigatória' }
  ];
  
  // Valida campos gerais
  camposObrigatorios.forEach(({ campo, mensagem }) => {
    if (!campo) {
      erros.push(mensagem);
    }
  });
  
  // Valida valor total
  if (!dados.total || dados.total === 'R$ 0,00' || dados.total === '0,00') {
    erros.push('Valor total inválido');
  }
  
  // Valida método de pagamento
  if (!dados.metodo_pagamento) {
    erros.push('Método de pagamento é obrigatório');
  }
  
  // Valida entrega
  if (dados.tipo_servico === 'entrega') {
    if (!dados.rua || dados.rua.trim() === '') {
      erros.push('Rua é obrigatória para entrega');
    }
    
    if (!dados.bairro || dados.bairro.trim() === '') {
      erros.push('Bairro é obrigatório para entrega');
    }
    
    if (!dados.numero || dados.numero.trim() === '') {
      erros.push('Número é obrigatório para entrega');
    }
  }
  
  return erros;
}

/**
 * Formata mensagem para WhatsApp
 */
/*function formatarMensagemWhatsApp(dados) {
  const { emojis } = CONFIG;
  const lines = [];
  
  lines.push(`*NOVO PEDIDO - SWEET DELÍCIA* 🍰\n`);
  lines.push(`*Cliente:* ${dados.nome}`);
  lines.push(`*Telefone:* ${dados.telefone}\n`);
  
  const tipoServico = dados.tipo_servico === 'retirada' ? 'Retirada na Loja' : 'Entrega';
  lines.push(`*Tipo de Serviço:* ${emojis[dados.tipo_servico]} ${tipoServico}`);
  
  if (dados.tipo_servico === 'entrega' && dados.endereco_completo) {
    lines.push(`*Endereço:* ${dados.endereco_completo}`);
  }
  
  lines.push(`\n*Doces Escolhidos:*\n${dados.doces_escolhidos}\n`);
  lines.push(`*Data Desejada:* ${dados.data}`);
  
  const metodoPagamentoFormatado = dados.metodo_pagamento 
    ? `${dados.metodo_pagamento.charAt(0).toUpperCase()}${dados.metodo_pagamento.slice(1)}`
    : 'Não informado';
    
  lines.push(`*Método de Pagamento:* ${emojis[dados.metodo_pagamento] || ''} ${metodoPagamentoFormatado}`);
  lines.push(`*Valor Total:* R$ ${dados.total}`);
  
  if (dados.obs && dados.obs.trim() !== '') {
    lines.push(`\n*Observações:*\n${dados.obs}`);
  }
  
  lines.push(`\n---\nPedido recebido via site Sweet Delícia`);
  
  return lines.join('\n');
}

/**
 * Handle do envio do pedido
 */
/*async function handleEnviarPedido(event) {
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
    
    // Envia para Google Apps Script e WhatsApp
    await enviarParaGoogleScript(dados);
    await enviarParaWhatsApp(dados);
    
    showSuccessAlert();
    
    // Limpa formulário (opcional)
    // DOM.form.reset();
    
  } catch (error) {
    console.error('Erro no envio:', error);
    showErrorAlert([error.message || 'Erro desconhecido ao enviar pedido']);
  } finally {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  }
}

/**
 * Alertas melhorados
 */
/*function showErrorAlert(erros) {
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

// Mantém compatibilidade com o código original
function enviarPedido(event) {
  handleEnviarPedido(event);
}

// Adiciona evento ao formulário para compatibilidade
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('itens-carrinho');
  const botaoEnviar = form ? form.querySelector('button[type="submit"]') : null;
  
  if (botaoEnviar && !botaoEnviar.hasListener) {
    botaoEnviar.addEventListener('click', enviarPedido);
    botaoEnviar.hasListener = true; // Previne duplicação
  }
});*/














// js/enviarpedido.js (VERSÃO CORRIGIDA)
/*import { CONFIG } from './modulesPedido/config.js';
import { DOM } from './modulesPedido/dom-cache.js';
import { getFormValue } from './modulesPedido/form-utils.js';
import { coletarDadosPedido } from './modulesPedido/data-collector.js';
import { validarPedido } from './modulesPedido/validator.js';
import { showErrorAlert, showSuccessAlert } from './modulesPedido/alerts.js';
import { formatarMensagemWhatsApp } from './modulesPedido/whatsapp-formatter.js';


/**
 * Função principal para enviar pedido
 */
/*async function handleEnviarPedido(event) {
  event.preventDefault();
  
  const botao = event.currentTarget;
  const textoOriginal = botao.textContent;
  
  try {
    // 1. Coleta e valida dados
    const dados = coletarDadosPedido();
    console.log('Dados coletados:', dados);
    
    const erros = validarPedido(dados);
    
    if (erros.length > 0) {
      showErrorAlert(erros);
      return;
    }
    
    // 2. Prepara botão para envio
    botao.disabled = true;
    botao.textContent = 'Enviando...';
    
    // 3. Envia para Google Apps Script
    await enviarParaGoogleScript(dados);
    
    // 4. Envia para WhatsApp (opcional)
    if (formatarMensagemWhatsApp) {
      const mensagem = formatarMensagemWhatsApp(dados);
      await enviarParaWhatsApp(mensagem);
    }
    
    // 5. SUCESSO - ADICIONE AQUI O CÓDIGO
    alert('✅ Pedido enviado com sucesso! Em breve entraremos em contato para confirmar.');
    
    // 🔥 COLE A FUNÇÃO AQUI DENTRO:
    // Confirma com o usuário (opcional)
    const confirmar = confirm('Pedido enviado com sucesso! Deseja voltar à página inicial?');
    
    if (confirmar) {
      // Limpa apenas o carrinho, mantendo outras configurações
      localStorage.removeItem('carrinho');
      
      // Redireciona
      //window.location.href = 'index.html';
    } else {
      // Permanece na página, mas limpa o carrinho
      localStorage.removeItem('carrinho');
      
      // Atualiza a exibição do carrinho na página atual
      if (typeof carregarCarrinho === 'function') {
        carregarCarrinho();
      }
    }

    alert("alert");
    // 🔥 FIM DO CÓDIGO PARA COLAR
    
  } catch (error) {
    console.error('Erro no envio:', error);
    showErrorAlert([error.message || 'Erro desconhecido ao enviar pedido']);
  } finally {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  }
}

/**
 * Inicializa o módulo
 */
/*export function initEnvioPedido() {
  DOM.form = document.getElementById('itens-carrinho');
  
  if (!DOM.form) {
    console.error('Formulário não encontrado');
    return;
  }
  
  cacheElementos(DOM.form);
  const botao = setupEventListeners(DOM.form, handleEnviarPedido);
  
  if (botao) {
    console.log('✅ Módulo de envio inicializado');
  }
}

// Mantém compatibilidade com o código original
export function enviarPedido(event) {
  handleEnviarPedido(event);
}*/