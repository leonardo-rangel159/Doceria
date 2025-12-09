// js/enviarpedido.js (VERSÃO CORRIGIDA)
import { CONFIG } from './modulesPedido/config.js';
import { DOM, cacheElementos } from './modulesPedido/dom-cache.js';
import { setupEventListeners } from './modulesPedido/form-utils.js';
import { coletarDadosPedido } from './modulesPedido/data-collector.js';
import { validarPedido } from './modulesPedido/validator.js';
import { enviarParaGoogleScript } from './modulesPedido/enviogoogle.js';
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
    // ... (código existente de coleta e validação)
    
    // Envia para Google Apps Script
    await enviarParaGoogleScript(dados);
    
    // Envia para WhatsApp (se configurado)
    if (formatarMensagemWhatsApp) {
      const mensagem = formatarMensagemWhatsApp(dados);
      await enviarParaWhatsApp(mensagem);
    }
    
    // MOSTRA ALERTA DE SUCESSO
    alert('✅ Pedido enviado com sucesso! Em breve entraremos em contato para confirmar.');
    
    // 🔥 LIMPA O CARRINHO (LOCALSTORAGE)
    localStorage.removeItem('carrinho');
    
    // 🔥 REDIRECIONA PARA A PÁGINA INICIAL
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500); // Espera 1.5 segundos antes de redirecionar
    
  } catch (error) {
    console.error('Erro no envio:', error);
    alert('❌ Erro ao enviar pedido: ' + error.message);
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

