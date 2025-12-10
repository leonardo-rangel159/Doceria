// js/agendaBloqueio.js

// Elemento do DOM
const inputDataEl = document.getElementById('date');

// Data mínima permitida (hoje)
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

/**
 * Função para habilitar o campo após carregamento
 */
function habilitarCampo() {
    if (inputDataEl) {
        inputDataEl.classList.remove('input-loading');
        inputDataEl.placeholder = "Clique para selecionar uma data";
        inputDataEl.readOnly = false;
    }
}

/**
 * Função principal: Busca dados da API e inicializa o Flatpickr.
 */
async function configurarCalendario() {
    if (!inputDataEl) {
        console.error('Elemento #date não encontrado');
        return;
    }
    
    // Mantém o campo desabilitado visualmente
    inputDataEl.classList.add('input-loading');
    inputDataEl.readOnly = true;
    
    let flatpickrInstance;
    let datasBloqueadas = [];

    try {
        // 1. Primeiro busca os dados da API
        console.log('🔄 Buscando datas bloqueadas da API...');
        const response = await fetch(API_URL, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const data = await response.json();
        
        if (data.erro || !data.sucesso || !data.dados) {
            throw new Error('Estrutura de dados inválida');
        }

        // 2. Extrai e converte as datas bloqueadas
        datasBloqueadas = data.dados.map(item => {
            const partes = item.data.split('/');
            if (partes.length === 3) {
                return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
            }
            return item.data;
        }).filter(date => {
            const dataObj = new Date(date);
            return dataObj >= hoje;
        });
        
        console.log(`✅ ${datasBloqueadas.length} datas bloqueadas carregadas`);

    } catch (error) {
        // Se a API falhar, continua com array vazio
        console.warn('⚠️ Não foi possível carregar datas bloqueadas:', error.message);
        console.log('ℹ️ Calendário funcionando sem restrições de datas bloqueadas');
        datasBloqueadas = [];
    }

    // 3. Verifica se hoje está bloqueado
    const hojeFormatado = hoje.toISOString().split('T')[0];
    const hojeEstaBloqueado = datasBloqueadas.includes(hojeFormatado);
    
    // 4. Define a data padrão (hoje ou próxima disponível se hoje estiver bloqueado)
    let dataPadrao = hoje;
    
    if (hojeEstaBloqueado) {
        // Encontra a próxima data disponível
        let proximaData = new Date(hoje);
        for (let i = 1; i <= 30; i++) {
            proximaData.setDate(hoje.getDate() + i);
            const dataTesteFormatada = proximaData.toISOString().split('T')[0];
            
            if (!datasBloqueadas.includes(dataTesteFormatada)) {
                dataPadrao = new Date(proximaData);
                console.log(`📅 Hoje está bloqueado, usando ${dataPadrao.toLocaleDateString()} como padrão`);
                break;
            }
        }
    }

    // 5. Inicializa o Flatpickr (independente do sucesso da API)
    try {
        flatpickrInstance = flatpickr(inputDataEl, {
            disable: datasBloqueadas,
            minDate: hoje,
            dateFormat: "d/m/Y",
            defaultDate: dataPadrao,
            locale: {
                firstDayOfWeek: 0,
                weekdays: {
                    shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                    longhand: [
                        "Domingo", "Segunda-feira", "Terça-feira", 
                        "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
                    ]
                },
                months: {
                    shorthand: [
                        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
                        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
                    ],
                    longhand: [
                        "Janeiro", "Fevereiro", "Março", "Abril", 
                        "Maio", "Junho", "Julho", "Agosto", 
                        "Setembro", "Outubro", "Novembro", "Dezembro"
                    ]
                }
            },
            onChange: function(selectedDates, dateStr, instance) {
                // Validação adicional quando a data é alterada
                if (selectedDates.length > 0) {
                    const dataSelecionada = selectedDates[0];
                    const dataFormatada = dataSelecionada.toISOString().split('T')[0];
                    
                    // Verifica se a data selecionada está bloqueada
                    if (datasBloqueadas.includes(dataFormatada)) {
                        instance.clear();
                        alert('Esta data não está disponível para retirada/entrega. Por favor, escolha outra data.');
                        // Volta para a data padrão
                        instance.setDate(dataPadrao);
                    }
                }
            },
            onOpen: function() {
                // Garante que o calendário só abre se estiver habilitado
                if (inputDataEl.classList.contains('input-loading')) {
                    this.close();
                }
            }
        });
        
        // 6. Habilita o campo após configuração completa
        setTimeout(() => {
            habilitarCampo();
            console.log('✅ Calendário configurado e habilitado');
            
            // Garante que o valor seja mostrado após habilitar
            if (flatpickrInstance) {
                // Força a atualização visual do valor
                flatpickrInstance.setDate(dataPadrao, true);
            }
        }, 500); // Pequeno delay para melhor experiência visual
        
    } catch (error) {
        console.error('❌ Erro ao configurar calendário:', error);
        
        // Fallback: Habilita o campo mesmo com erro e seta valor manual
        habilitarCampo();
        
        // Seta o valor manualmente no campo
        const dia = hoje.getDate().toString().padStart(2, '0');
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
        const ano = hoje.getFullYear();
        inputDataEl.value = `${dia}/${mes}/${ano}`;
        
        // Alternativa com input date nativo
        inputDataEl.type = "text";
        inputDataEl.title = "Selecione uma data (calendário básico)";
        
        console.log('📅 Valor padrão definido manualmente:', inputDataEl.value);
    }
}

// 7. Garante que o campo não seja clicável durante o carregamento
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona listener para prevenir clique durante carregamento
    if (inputDataEl) {
        inputDataEl.addEventListener('click', function(e) {
            if (this.classList.contains('input-loading')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
        
        inputDataEl.addEventListener('focus', function(e) {
            if (this.classList.contains('input-loading')) {
                e.preventDefault();
                this.blur();
                return false;
            }
        }, true);
    }
    
    // Inicia a configuração do calendário
    configurarCalendario();
});
