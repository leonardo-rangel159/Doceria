// js/init.js

import { initEnvioPedido, enviarPedido } from './enviarpedido.js';

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnvioPedido);
} else {
  initEnvioPedido();
}

// Compatibilidade global (se necessário)
window.enviarPedido = enviarPedido;
window.initEnvioPedido = initEnvioPedido;

console.log('Módulo de envio de pedidos carregado');