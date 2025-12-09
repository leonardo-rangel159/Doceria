// js/enviarpedido.js (VERSÃO CORRIGIDA)
//import { CONFIG } from './modulesPedido/config.js';
import { DOM, cacheElementos } from './modulesPedido/dom-cache.js';
import { setupEventListeners, clearForm } from './modulesPedido/form-utils.js';
import { coletarDadosPedido } from './modulesPedido/data-collector.js';
import { validarPedido } from './modulesPedido/validator.js';
//import { formatarMensagemWhatsApp } from './modulesPedido/whatsapp-formatter.js';
import { showErrorAlert, showSuccessAlert } from './modulesPedido/alerts.js';

// Funções que precisam ser criadas ou ajustadas
let enviarParaWhatsApp, formatarMensagemWhatsApp;

try {
  const whatsappModule = await import('./modulesPedido/whatsapp-formatter.js');
  formatarMensagemWhatsApp = whatsappModule.formatarMensagemWhatsApp || whatsappModule.default;
} catch (e) {
  console.warn('Módulo whatsapp-formatter.js não encontrado');
  formatarMensagemWhatsApp = (dados) => `Pedido: ${dados.nome} - ${dados.total}`;
}

// Função para enviar WhatsApp (mock por enquanto)
enviarParaWhatsApp = async (dados) => {
  console.log('Simulando envio WhatsApp:', dados);
  // Implementação real virá depois
  return true;
};

/**
 * Função principal para enviar pedido
 */
async function handleEnviarPedido(event) {
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
export function initEnvioPedido() {
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
}