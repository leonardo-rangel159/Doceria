// modules/whatsapp-formatter.js

import { CONFIG } from './config.js';

export function formatarMensagemWhatsApp(dados) {
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