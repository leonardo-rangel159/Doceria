// js/modulesPedido/enviogoogle.js
export async function enviarParaGoogleScript(dados) {
  console.log('📤 Enviando dados para Google Sheets...', dados);
  
  try {
    // Verifica se GOOGLE_SCRIPT_URL está definida globalmente
    if (typeof GOOGLE_SCRIPT_URL === 'undefined') {
      throw new Error('URL do Google Script não configurada');
    }
    
    const formData = new FormData();
    const dadosCompletos = {
      timestamp: new Date().toISOString(),
      status: 'novo',
      ...dados
    };
    
    for (const chave in dadosCompletos) {
      const valor = dadosCompletos[chave];
      if (Array.isArray(valor)) {
        formData.append(chave, valor.join(', '));
      } else if (valor !== null && valor !== undefined) {
        formData.append(chave, valor);
      } else {
        formData.append(chave, '');
      }
    }
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    
    const resultado = await response.json();
    
    if (resultado.erro) {
      throw new Error(resultado.erro);
    }
    
    console.log('✅ Dados enviados com sucesso');
    return resultado;
    
  } catch (error) {
    console.error('❌ Erro ao enviar para Google Sheets:', error);
    throw error;
  }
}