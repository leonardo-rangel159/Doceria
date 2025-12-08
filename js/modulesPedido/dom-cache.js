// modules/dom-cache.js

export const DOM = {
  form: null,
  elementos: {}
};

export function cacheElementos(form) {
  const campos = ['nome', 'telefone', 'doces_escolhidos', 'data', 'obs', 
                  'total', 'rua', 'bairro', 'numero', 'cidade', 'referencia'];
  
  campos.forEach(campo => {
    DOM.elementos[campo] = form.querySelector(`[name="${campo}"]`);
  });
}