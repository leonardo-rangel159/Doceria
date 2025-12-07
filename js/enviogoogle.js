// js/enviogoogle.js

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
        
        // Envia para Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosParaEnviar)
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.erro) {
            throw new Error(resultado.erro);
        }
        
        console.log('✅ Dados enviados para Google Sheets com sucesso:', resultado);
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro ao enviar para Google Sheets:', error);
        throw error;
    }
}
