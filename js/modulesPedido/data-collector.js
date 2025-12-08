// modules/data-collector.js

import { getFormValue, getRadioValue } from './form-utils.js';
import { CONFIG } from './config.js';

export function processarDocesEscolhidos(docesStr) {
  if (!docesStr) return '';
  
  return docesStr
    .split('\n')
    .map(item => item.trim())
    .filter(item => item !== '')
    .map(item => {
      const partes = item.split(' — ');
      return partes[0]?.trim() || '';
    })
    .filter(item => item !== '')
    .join(', ');
}

export function formatarEnderecoCompleto() {
  const tipoServico = getRadioValue('tipo_servico');
  
  if (tipoServico !== 'entrega') return '';
  
  const rua = getFormValue('rua') || CONFIG.fallbacks.endereco;
  const bairro = getFormValue('bairro') || CONFIG.fallbacks.endereco;
  const numero = getFormValue('numero') || CONFIG.fallbacks.numero;
  const cidade = getFormValue('cidade') || CONFIG.fallbacks.endereco;
  const referencia = getFormValue('referencia');
  
  let endereco = `${rua}, ${bairro} - ${numero} (${cidade})`;
  
  if (referencia) {
    endereco += ` | Ref: ${referencia}`;
  }
  
  return endereco;
}

export function coletarDadosPedido() {
  const tipoServico = getRadioValue('tipo_servico');
  const metodoPagamento = getRadioValue('metodo_pagamento');
  
  return {
    nome: getFormValue('nome'),
    telefone: getFormValue('telefone'),
    doces_escolhidos: processarDocesEscolhidos(getFormValue('doces_escolhidos')),
    data: getFormValue('data'),
    obs: getFormValue('obs'),
    total: getFormValue('total'),
    metodo_pagamento: metodoPagamento,
    tipo_servico: tipoServico,
    endereco_completo: formatarEnderecoCompleto(),
    rua: getFormValue('rua'),
    bairro: getFormValue('bairro'),
    numero: getFormValue('numero'),
    cidade: getFormValue('cidade'),
    referencia: getFormValue('referencia')
  };
}