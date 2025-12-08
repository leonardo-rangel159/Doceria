// modules/validator.js

export function validarPedido(dados) {
  const erros = [];
  
  // Valida campos gerais
  if (!dados.nome) erros.push('Nome é obrigatório');
  if (!dados.telefone) erros.push('Telefone é obrigatório');
  if (!dados.doces_escolhidos) erros.push('Nenhum doce selecionado');
  if (!dados.data) erros.push('Data é obrigatória');
  
  // Valida valor total
  if (!dados.total || dados.total === 'R$ 0,00' || dados.total === '0,00') {
    erros.push('Valor total inválido');
  }
  
  // Valida método de pagamento
  if (!dados.metodo_pagamento) {
    erros.push('Método de pagamento é obrigatório');
  }
  
  // Valida entrega
  if (dados.tipo_servico === 'entrega') {
    if (!dados.rua || dados.rua.trim() === '') erros.push('Rua é obrigatória para entrega');
    if (!dados.bairro || dados.bairro.trim() === '') erros.push('Bairro é obrigatório para entrega');
    if (!dados.numero || dados.numero.trim() === '') erros.push('Número é obrigatório para entrega');
  }
  
  return erros;
}