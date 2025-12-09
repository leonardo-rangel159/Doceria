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
  
  // Opcional: Limpar formulário após sucesso
  setTimeout(() => {
    if (typeof clearForm === 'function') {
      clearForm();
    }
    
    // Redirecionar ou limpar carrinho
    localStorage.removeItem('carrinho');
    window.location.href = 'index.html';
  }, 2000);
}

