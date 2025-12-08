// js/enviogoogle.js (CORRIGIDO)

/**
 * Envia os dados do pedido para o Google Sheets via Google Apps Script
 */
async function enviarParaGoogleScript(dados) {
    console.log('📤 Enviando dados para Google Sheets...');

    try {
        // Formata dados para envio
        const dadosParaEnviar = {
            timestamp: new Date().toISOString(),
            status: 'novo',
            ...dados
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', 
            headers: {
                // Ao usar JSON.stringify no corpo, o Content-Type deve ser application/json
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosParaEnviar)
        });

        // 1. Processa a resposta HTTP
        if (!response.ok) {
            // Se o status HTTP não for 2xx
            // Tenta obter o corpo da resposta, mesmo em caso de erro, para mais detalhes.
            let errorDetails = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorDetails.substring(0, 100)}...`);
        }

        // 2. Converte a resposta para JSON
        const resultado = await response.json(); 

        // 3. Verifica se a resposta JSON contém a chave 'erro' (definida no doPost)
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
