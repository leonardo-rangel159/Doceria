// modules/validator.js

export function validarPedido(dados) {
  const erros = [];
  
  // Validação de nome (mínimo 3 caracteres)
  if (!dados.nome || dados.nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  // Validação de telefone (formato brasileiro)
  const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
  if (!dados.telefone || !telefoneRegex.test(dados.telefone.replace(/\D/g, ''))) {
    erros.push('Telefone inválido. Use formato: (00) 90000-0000');
  }
  
  // Validação de data (formato dd/mm/yyyy)
  const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dados.data || !dataRegex.test(dados.data)) {
    erros.push('Data inválida. Use formato: dd/mm/aaaa');
  }
  
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
