// modules/alerts.js

import { CONFIG } from './config.js';

export function showErrorAlert(erros) {
  const mensagem = Array.isArray(erros) 
    ? `${CONFIG.mensagens.erroTitulo}\n\n${erros.join('\n')}`
    : `❌ ${erros}`;
  
  alert(mensagem);
}

export function showSuccessAlert() {
  alert(CONFIG.mensagens.sucesso);
}