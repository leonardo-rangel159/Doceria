// js/init.js
console.log('🔧 init.js carregado');

import { initEnvioPedido, enviarPedido } from './enviarpedido.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM carregado, inicializando módulo...');
  try {
    initEnvioPedido();
    console.log('✅ Módulo inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar módulo:', error);
  }
});

console.log('Módulo de envio de pedidos carregado');