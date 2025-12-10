/**
 * Envia os dados do pedido para o Google Sheets via Google Apps Script
 * Utiliza FormData para evitar problemas de CORS com requisições POST JSON no Apps Script.
 * @param {Object} dados - O objeto contendo os dados do pedido do formulário.
 */
async function enviarParaGoogleScript(dados) {
    // 🛑 ADICIONE ESTE LOG (1) 🛑
    console.log('Dados recebidos antes de formar o FormData:', dados); 
    // ----------------------------

    console.log('📤 Enviando dados para Google Sheets...');

    try {
        // Objeto base com timestamp e status inicial
        const dadosParaEnviar = {
            timestamp: new Date().toISOString(),
            status: 'novo',
            ...dados
        };

        // 1. Criar um objeto FormData para simular o envio de um formulário HTML
        const formData = new FormData();
        
        // 2. Anexar todos os dados ao FormData
        for (const chave in dadosParaEnviar) {
            const valor = dadosParaEnviar[chave];
            
            // Trata arrays (como 'doces_escolhidos') unindo-os em uma única string
            if (Array.isArray(valor)) {
                formData.append(chave, valor.join(', '));
            } else if (valor !== null && valor !== undefined) {
                // Adiciona valores normais
                formData.append(chave, valor);
            } else {
                // Adiciona strings vazias para valores nulos/indefinidos, garantindo a posição
                formData.append(chave, '');
            }
        }
        
        // 3. Enviar a requisição FETCH
        // Não é necessário definir 'Content-Type', o navegador fará isso automaticamente para FormData
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Mantido para consistência
            body: formData // Envia o corpo como FormData (multipart/form-data)
        });

        // 4. Processa a resposta HTTP
        if (!response.ok) {
            // Tenta obter o corpo da resposta em texto para mais detalhes
            let errorDetails = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorDetails.substring(0, 100)}...`);
        }

        // 5. Converte a resposta para JSON (esperando {sucesso: true} ou {erro: '...'})
        const resultado = await response.json(); 

        // 6. Verifica se o Apps Script retornou uma mensagem de erro JSON
        if (resultado.erro) {
            throw new Error(resultado.erro);
        }

        console.log('✅ Dados enviados para Google Sheets com sucesso:', resultado);
        return resultado;

    } catch (error) {
        console.error('❌ Erro ao enviar para Google Sheets:', error);
        // Propaga o erro para o código que chamou a função (em enviarpedido.js)
        throw error; 
    }
}