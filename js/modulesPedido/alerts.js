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

function limparCarrinhoERedirecionar() {
  // Confirma com o usuário (opcional)
  const confirmar = confirm('Pedido enviado com sucesso! Deseja voltar à página inicial?');
  
  if (confirmar) {
    // Limpa apenas o carrinho, mantendo outras configurações
    localStorage.removeItem('carrinho');
    
    // Redireciona
    window.location.href = 'index.html';
  } else {
    // Permanece na página, mas limpa o carrinho
    localStorage.removeItem('carrinho');
    
    // Atualiza a exibição do carrinho na página atual
    if (typeof carregarCarrinho === 'function') {
      carregarCarrinho();
    }
  }
}

// Usar assim após envio bem-sucedido:
limparCarrinhoERedirecionar();