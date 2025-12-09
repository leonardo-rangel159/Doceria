// modules/form-utils.js

import { DOM } from './dom-cache.js';

export function getFormValue(fieldName) {
  const elemento = DOM.elementos[fieldName];
  if (!elemento) return '';
  
  // Tratamento especial para textarea
  if (elemento.tagName === 'TEXTAREA') {
    return elemento.value.trim();
  }
  
  return elemento.value.trim();
}

export function setFormValue(fieldName, value) {
  const elemento = DOM.elementos[fieldName];
  if (elemento) {
    elemento.value = value;
  }
}

export function clearForm() {
  Object.values(DOM.elementos).forEach(elemento => {
    if (elemento && elemento.type !== 'radio' && elemento.type !== 'checkbox') {
      elemento.value = '';
    }
  });
  
  // Limpa radios
  const radios = DOM.form.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if (radio.checked && radio.value !== 'retirada') {
      radio.checked = false;
    }
  });
  
  // Reseta para retirada
  const retiradaRadio = DOM.form.querySelector('input[value="retirada"]');
  if (retiradaRadio) retiradaRadio.checked = true;
}

export function getRadioValue(name) {
  const radio = DOM.form.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : '';
}

export function setupEventListeners(form, handler) {
  const botaoEnviar = form.querySelector('button[type="submit"]');
  
  if (botaoEnviar) {
    botaoEnviar.addEventListener('click', handler);
    return botaoEnviar;
  }
  return null;
}
