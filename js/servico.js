// js/servico.js

document.addEventListener('DOMContentLoaded', function() {
    const retiradaRadio = document.getElementById('servico-retirada');
    const entregaRadio = document.getElementById('servico-entrega');
    const camposEndereco = document.getElementById('campos-endereco');
    const enderecoInputs = camposEndereco.querySelectorAll('input');
    
    // Função para mostrar/ocultar campos de endereço
    function toggleCamposEndereco() {
        if (entregaRadio.checked) {
            camposEndereco.style.display = 'block';
            // Torna os campos obrigatórios (exceto referência)
            enderecoInputs.forEach(input => {
                if (input.name !== 'referencia') {
                    input.required = true;
                }
            });
        } else {
            camposEndereco.style.display = 'none';
            // Remove a obrigatoriedade e limpa os campos (exceto cidade)
            enderecoInputs.forEach(input => {
                if (input.name !== 'cidade') {
                    input.required = false;
                    input.value = '';
                }
            });
        }
    }
    
    // Adiciona eventos aos radio buttons
    retiradaRadio.addEventListener('change', toggleCamposEndereco);
    entregaRadio.addEventListener('change', toggleCamposEndereco);
    
    // Inicializa o estado
    toggleCamposEndereco();
    
    // Preenche automaticamente a cidade
    const cidadeInput = document.querySelector('input[name="cidade"]');
    if (cidadeInput && !cidadeInput.value) {
        cidadeInput.value = "São Fidelis";
    }
});
