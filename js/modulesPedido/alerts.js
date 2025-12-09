// Em alerts.js (sugestão anterior)
export function showSuccessAlert() {
  alert(CONFIG.mensagens.sucesso);
  
  // Opcional: Limpar formulário após sucesso
  setTimeout(() => {
    if (typeof clearForm === 'function') {
      clearForm();
    }
    
    // 🔥 ESTE É O COMANDO QUE LIMPA O CARRINHO:
    localStorage.removeItem('carrinho');
    
    // Redirecionar para página inicial
    window.location.href = 'index.html';
  }, 2000);
}