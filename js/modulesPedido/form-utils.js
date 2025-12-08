// modules/form-utils.js

import { DOM } from './dom-cache.js';

export function getFormValue(fieldName) {
  const elemento = DOM.elementos[fieldName];
  return elemento ? elemento.value.trim() : '';
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