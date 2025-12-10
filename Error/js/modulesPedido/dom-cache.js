// modules/dom-cache.js

export const DOM = {
  form: null,
  elementos: {}
};

export function cacheElementos(form) {
  // Cache de todos os inputs, textareas e selects
  const campos = form.querySelectorAll('input, textarea, select');
  
  campos.forEach(campo => {
    if (campo.name) {
      DOM.elementos[campo.name] = campo;
    }
  });
  
  // Cache de botões importantes
  DOM.elementos.botaoEnviar = form.querySelector('button[type="submit"]');
  DOM.elementos.botaoLimpar = form.querySelector('button[type="reset"]');
}
