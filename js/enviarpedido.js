// js/enviarpedido.js

// Importações
import { CONFIG } from './modulesPedido/config.js';
import { DOM, cacheElementos } from './modulesPedido/dom-cache.js';
import { setupEventListeners, clearForm } from './modulesPedido/form-utils.js';
import { coletarDadosPedido } from './modulesPedido/data-collector.js';
import { validarPedido } from './modulesPedido/validator.js';
import { enviarParaGoogleScript } from './modulesPedido/enviogoogle.js';
import { formatarMensagemWhatsApp } from './modulesPedido/whatsapp-formatter.js';
import { enviarParaWhatsApp } from './modulesPedido/whatsapp-sender.js'; // Criar este
import { showErrorAlert, showSuccessAlert } from './modulesPedido/alerts.js';

/**
 * Função principal para enviar pedido
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
    
    // Envia para Google Apps Script e WhatsApp
    await enviarParaGoogleScript(dados);
    await enviarParaWhatsApp(dados);
    
    showSuccessAlert();
    
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
  setupEventListeners(DOM.form, handleEnviarPedido);
}

// Mantém compatibilidade com o código original
export function enviarPedido(event) {
  handleEnviarPedido(event);
}
