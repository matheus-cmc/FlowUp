// Dados de exemplo
let planejamentos = [
    {
        id: 1,
        titulo: "Campanha Verão 2025",
        descricao: "Planejamento de conteúdo para a temporada de verão com foco em produtos refrescantes e estilo de vida",
        tipo: "mensal",
        mes: "1",
        ano: "2024",
        posts: [
            {
                titulo: "Dicas de Verão Essenciais",
                tipo: "reels",
                descricao: "Reels com dicas rápidas para aproveitar o verão",
                legenda: "O verão chegou! 🌞 Confira nossas dicas para curtir a estação com estilo e cuidado com a pele! #Verão2024 #Dicas",
                inspiracao: "https://exemplo.com/inspiracao1",
                prioridade: "alta",
                status: "aprovado",
                data: "2024-01-15",
                responsavel: "alone",
                destino: "publicacao"
            },
            {
                titulo: "Linha de Produtos Verão",
                tipo: "carrossel",
                descricao: "Apresentação da nova linha de produtos para verão",
                legenda: "Não pode faltar na sua bolsa de verão! Confira os essenciais da temporada 🏖️",
                inspiracao: "https://exemplo.com/inspiracao2",
                prioridade: "media",
                status: "em_revisao",
                data: "2024-01-20",
                responsavel: "maria",
                destino: "design"
            }
        ],
        createdAt: "2025-01-01",
        updatedAt: "2025-01-10"
    }

    
];


let currentPlanejamentoId = null;
let postCounter = 1;
let isEditMode = false;

// Elementos DOM
const planejamentoList = document.getElementById('planejamentoList');
const planejamentoModal = document.getElementById('planejamentoModal');
const detailModal = document.getElementById('detailModal');
const confirmModal = document.getElementById('confirmModal');
const planejamentoForm = document.getElementById('planejamentoForm');
const postsContainer = document.getElementById('postsContainer');
const detailModalContent = document.getElementById('detailModalContent');
const novoPlanejamentoBtn = document.getElementById('novoPlanejamentoBtn');
const addPostBtn = document.getElementById('addPostBtn');
const savePlanejamentoBtn = document.getElementById('savePlanejamentoBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeDetailBtn = document.getElementById('closeDetailBtn');
const editPlanejamentoBtn = document.getElementById('editPlanejamentoBtn');
const detailActionsBtn = document.getElementById('detailActionsBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const modalTitle = document.getElementById('modalTitle');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderPlanejamentoList();
    setupEventListeners();
    initializeUserMenu();
    initializeCustomSelects();
    applyCustomStyles();
});

function setupEventListeners() {
    novoPlanejamentoBtn.addEventListener('click', openNewPlanejamentoModal);
    addPostBtn.addEventListener('click', addPost);
    savePlanejamentoBtn.addEventListener('click', savePlanejamento);
    cancelBtn.addEventListener('click', closeModal);
    closeDetailBtn.addEventListener('click', closeDetailModal);
    editPlanejamentoBtn.addEventListener('click', function() {
        openDetailModalInEditMode(currentPlanejamentoId);
    });
    detailActionsBtn.addEventListener('click', openShareModal);
    confirmDeleteBtn.addEventListener('click', deletePlanejamento);
    cancelDeleteBtn.addEventListener('click', closeConfirmModal);
    
    // Filtros
    document.getElementById('monthFilter').addEventListener('change', renderPlanejamentoList);
    document.getElementById('yearFilter').addEventListener('change', renderPlanejamentoList);
    document.getElementById('searchPlanejamento').addEventListener('input', renderPlanejamentoList);
    
    // Controle do tipo de planejamento
    document.getElementById('planejamentoTipo').addEventListener('change', function() {
        const mesGroup = document.getElementById('mesGroup');
        mesGroup.style.display = 'block';
        document.getElementById('planejamentoMes').required = true;
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === planejamentoModal) closeModal();
        if (event.target === detailModal) closeDetailModal();
        if (event.target === confirmModal) closeConfirmModal();
    });
    
    // Fechar modais com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
            closeDetailModal();
            closeConfirmModal();
        }
    });
}

// Aplicar estilos personalizados
// Aplicar estilos personalizados
function applyCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Remover borda laranja do botão Novo Planejamento */
        #novoPlanejamentoBtn {
            border: none !important;
            outline: none !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        
        #novoPlanejamentoBtn:hover {
            box-shadow: 0 4px 8px rgba(109, 40, 217, 0.2) !important;
        }
        
        /* Evitar quebra de linha no botão Novo Planejamento */
        #novoPlanejamentoBtn span {
            white-space: nowrap !important;
        }
        
        /* Aumentar espaço entre as estatísticas */
        .stats-row {
            gap: 24px !important;
            padding: 10px 0 20px 0 !important;
        }
        
        .stats-item {
            min-width: 120px !important;
            padding: 20px 16px !important;
        }
        
        .stats-value {
            font-size: 28px !important;
            margin-bottom: 12px !important;
        }
        
        .stats-label {
            font-size: 13px !important;
        }
        
        /* CORREÇÃO: ADICIONAR LINHA/ BORDA AO CAMPO DE DESCRIÇÃO NO MODAL DE NOVO/EDITAR */
        .planning-modal #planejamentoDescricao {
            border: 1px solid #d1d5db !important;
            background: white !important;
            padding: 12px 16px !important;
            border-radius: 10px !important;
            font-size: 14px !important;
            color: #111827 !important;
            width: 100% !important;
            min-height: 100px !important;
            resize: vertical !important;
            font-family: inherit !important;
        }
        
        .planning-modal #planejamentoDescricao:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
            outline: none !important;
        }
        
        .planning-modal #planejamentoDescricao::placeholder {
            color: #9ca3af !important;
        }
        
        /* Linha gradiente no topo dos modais */
        .planning-modal::before,
        .detail-modal::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--g1), var(--g2), var(--g3));
            border-radius: 20px 20px 0 0;
            z-index: 1;
        }
        
        /* Estilo para modal de compartilhamento */
        .share-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: white;
            padding: 0;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 1001;
            width: 400px;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .share-modal.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        
        .share-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .share-header h3 {
            margin: 0;
            color: #111827;
            font-size: 18px;
        }
        
        .share-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s;
        }
        
        .share-close:hover {
            background: #f3f4f6;
        }
        
        .share-body {
            padding: 24px;
        }
        
        .share-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .share-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .share-option:hover {
            border-color: #8b5cf6;
            background: #faf5ff;
            transform: translateY(-2px);
        }
        
        .share-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
        }
        
        .share-icon.email {
            background: #dc2626;
        }
        
        .share-icon.whatsapp {
            background: #22c55e;
        }
        
        .share-icon.pdf {
            background: #ef4444;
        }
        
        .share-icon.duplicate {
            background: #8b5cf6;
        }
        
        .share-option span {
            font-weight: 600;
            color: #111827;
            flex: 1;
        }
        
        /* Overlay para modal de compartilhamento */
        .share-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .share-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        
        /* Estilos para modal de detalhes (igual ao novo planejamento) */
        .detail-modal .modal-body {
            padding: 24px 32px;
            background: #f3f4f6 !important;
            overflow-y: auto;
        }
        
        .detail-modal .modal-header h3 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            color: #111827;
        }
        
        .detail-modal .form-section {
            background: #ffffff;
            border-radius: 18px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
            padding: 22px 24px 20px;
            margin-bottom: 24px;
        }
        
        .detail-modal .section-title {
            margin: 0 0 16px;
            color: #111827;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .detail-modal .section-title::before {
            content: "";
            width: 6px;
            height: 20px;
            background: linear-gradient(180deg, #8b5cf6, #a855f7);
            border-radius: 3px;
        }
        
        /* CORREÇÃO: Remover seta dos selects no modal de detalhes */
        .detail-modal .custom-select .select-arrow {
            display: none !important;
        }
        
        .detail-modal .custom-select {
            width: 100% !important;
        }
        
        .detail-modal .select-selected {
            width: 100%;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            padding: 12px 16px;
            font-weight: 600;
            min-height: 44px;
            display: flex;
            align-items: center;
            cursor: default !important;
        }
        
        .detail-modal .select-items {
            display: none !important;
        }
        
        .detail-modal .custom-select .select-selected {
            pointer-events: none !important;
            cursor: default !important;
        }
        
        /* Inputs no modal de detalhes */
        .detail-modal input[type="text"],
        .detail-modal input[type="date"],
        .detail-modal textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            font-size: 14px;
            background: white;
            min-height: 44px;
            cursor: default !important;
            pointer-events: none !important;
        }
        
        .detail-modal textarea {
            min-height: 100px;
            resize: none !important;
        }
        
        /* CORREÇÃO: Campo de descrição no modal de detalhes SEM BORDA */
        .detail-modal #detailPlanejamentoDescricao {
            border: none !important;
            background: transparent !important;
            padding: 12px 0 !important;
            resize: none !important;
            min-height: auto !important;
            line-height: 1.6 !important;
        }
        
        /* CORREÇÃO: Campo de título no modal de detalhes SEM BORDA */
        .detail-modal #detailPlanejamentoTitulo {
            border: none !important;
            background: transparent !important;
            padding: 12px 0 !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #111827 !important;
        }
        
        /* CORREÇÃO: Campo de título no modal de novo/editar COM BORDA FOCUS */
        .planning-modal #planejamentoTitulo {
            border: 1px solid #d1d5db !important;
            background: white !important;
            padding: 12px 16px !important;
            border-radius: 10px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #111827 !important;
        }
        
        .planning-modal #planejamentoTitulo:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
            outline: none !important;
        }
        
        .planning-modal #planejamentoTitulo::placeholder {
            color: #9ca3af !important;
            font-weight: normal !important;
        }
        
        /* Botões no modal de detalhes */
        .detail-modal .btn-primary {
            background: linear-gradient(90deg, #8b5cf6, #a855f7);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            height: 44px;
        }
        
        .detail-modal .btn-secondary {
            background: white;
            color: #111827;
            border: 1px solid #d1d5db;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            height: 44px;
        }
        
        /* Estatísticas no modal de detalhes */
        .detail-modal .stats-row {
            display: flex;
            gap: 20px;
            padding: 20px 0;
        }
        
        .detail-modal .stats-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            min-width: 120px;
        }
        
        .detail-modal .stats-value {
            font-size: 24px;
            font-weight: 800;
            color: #8b5cf6;
            margin-bottom: 8px;
        }
        
        .detail-modal .stats-label {
            font-weight: 600;
            color: #111827;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* CORREÇÃO: Título dos posts no modal de novo/editar COM BORDA */
        .planning-modal .post-item input[name="postTitulo"],
        .planning-modal .post-titulo {
            border: 1px solid #d1d5db !important;
            background: white !important;
            padding: 12px 16px !important;
            border-radius: 10px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #111827 !important;
            width: 100% !important;
            margin-bottom: 16px !important;
        }
        
        .planning-modal .post-item input[name="postTitulo"]:focus,
        .planning-modal .post-titulo:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
            outline: none !important;
        }
        
        .planning-modal .post-item input[name="postTitulo"]::placeholder,
        .planning-modal .post-titulo::placeholder {
            color: #9ca3af !important;
            font-weight: normal !important;
        }
        
        /* Estilos para posts em modo de edição */
        .planning-modal .post-item {
            border: 1px solid #e5e7eb !important;
            padding: 20px !important;
            border-radius: 16px !important;
            background: white !important;
            margin-bottom: 20px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        }
        
        /* Outros inputs dos posts em modo de edição */
        .planning-modal .post-item input[type="date"],
        .planning-modal .post-item textarea,
        .planning-modal .post-item .select-selected {
            border: 1px solid #d1d5db !important;
            background: white !important;
            padding: 10px 14px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            color: #111827 !important;
            width: 100% !important;
        }
        
        .planning-modal .post-item input[type="date"]:focus,
        .planning-modal .post-item textarea:focus,
        .planning-modal .post-item .select-selected:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
        }
        
        /* Textareas dos posts em modo de edição */
        .planning-modal .post-item textarea[name="postDescricao"],
        .planning-modal .post-item textarea[name="postLegenda"],
        .planning-modal .post-item textarea[name="postInspiracao"] {
            min-height: 80px !important;
            resize: vertical !important;
            font-family: inherit !important;
            line-height: 1.5 !important;
        }
        
        /* Botão Excluir dos posts */
        .planning-modal .btn-remove-post {
            background: linear-gradient(90deg, var(--g1), var(--g2), var(--g3));
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            transition: all 0.2s;
        }
        
        .planning-modal .btn-remove-post:hover {
            background: linear-gradient(90deg, #dc2626, #b91c1c);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(220, 38, 38, 0.2);
        }
        
        /* Linha gradiente nos posts */
        .planning-modal .post-item::before,
        .detail-modal .detail-post-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #8b5cf6, #a855f7, #d946ef);
            border-radius: 16px 16px 0 0;
        }
        
        /* Adicionar posicionamento relativo aos posts */
        .planning-modal .post-item,
        .detail-modal .detail-post-card {
            position: relative !important;
            overflow: hidden !important;
        }
        
        /* Ajustar padding para compensar a linha */
        .planning-modal .post-item > *:first-child,
        .detail-modal .detail-post-card > *:first-child {
            margin-top: 3px !important;
        }
    `;
    document.head.appendChild(style);
}

// ... o resto do código JavaScript permanece igual ...

// Inicializar selects customizados
function initializeCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const selected = select.querySelector('.select-selected');
        const items = select.querySelector('.select-items');
        const options = items.querySelectorAll('.select-option');
        const hiddenSelect = select.querySelector('select');
        
        // Fechar outros selects quando abrir um
        selected.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelects(this);
            items.classList.toggle('select-show');
        });
        
        // Configurar opções
        options.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                
                // Atualizar texto selecionado
                selected.querySelector('span').textContent = text;
                
                // Atualizar select oculto
                if (hiddenSelect) {
                    hiddenSelect.value = value;
                    hiddenSelect.dispatchEvent(new Event('change'));
                }
                
                // Fechar dropdown
                items.classList.remove('select-show');
            });
        });
    });
    
    // Fechar selects ao clicar fora
    document.addEventListener('click', closeAllSelects);
}

function closeAllSelects(elmnt) {
    const selects = document.querySelectorAll('.select-items');
    selects.forEach(select => {
        if (elmnt && select.contains(elmnt)) return;
        select.classList.remove('select-show');
    });
}

function renderPlanejamentoList() {
    const monthFilter = document.getElementById('monthFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const searchTerm = document.getElementById('searchPlanejamento').value.toLowerCase();

    let filteredPlanejamentos = planejamentos.filter(planejamento => {
        const matchesMonth = monthFilter === 'all' || 
                           (monthFilter === 'special' && planejamento.tipo === 'especial') ||
                           planejamento.mes === monthFilter;
        const matchesYear = planejamento.ano === yearFilter;
        const matchesSearch = planejamento.titulo.toLowerCase().includes(searchTerm) || 
                            planejamento.descricao.toLowerCase().includes(searchTerm);
        return matchesMonth && matchesYear && matchesSearch;
    });

    // Ordenar por data de atualização
    filteredPlanejamentos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filteredPlanejamentos.length === 0) {
        planejamentoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"></div>
                <h4>Nenhum planejamento encontrado</h4>
                <p>Crie seu primeiro planejamento clicando no botão "Novo Planejamento"</p>
            </div>
        `;
        return;
    }

    planejamentoList.innerHTML = filteredPlanejamentos.map(planejamento => {
        const stats = calcularEstatisticas(planejamento.posts);
        return `
            <div class="planejamento-card" onclick="openDetailModal(${planejamento.id})">
                <div class="planejamento-card-header">
                    <h3 class="planejamento-card-title">${planejamento.titulo}</h3>
                    <span class="posts-count">${planejamento.posts.length}</span>
                </div>
                <div class="planejamento-card-meta">
                    <span>${planejamento.tipo === 'especial' ? 'Planejamento Especial' : `${getMesNome(planejamento.mes)} ${planejamento.ano}`}</span>
                </div>
                <p class="planejamento-card-description">${planejamento.descricao}</p>
                <div class="planejamento-card-footer">
                    <div class="planejamento-card-stats">
                        <div class="planejamento-stat">
                            <span class="planejamento-stat-icon"></span>
                            <span>${stats.aprovados} aprovados</span>
                        </div>
                        <div class="planejamento-stat">
                            <span class="planejamento-stat-icon"></span>
                            <span>${stats.emRevisao} em revisão</span>
                        </div>
                    </div>
                    <div class="planejamento-card-date">
                        ${formatDate(planejamento.updatedAt)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// FUNÇÃO PRINCIPAL DE DETALHES - AGORA COM LAYOUT IGUAL AO NOVO PLANEJAMENTO
function openDetailModal(id) {
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) return;

    currentPlanejamentoId = id;
    isEditMode = false;
    
    // Calcular estatísticas
    const stats = calcularEstatisticas(planejamento.posts);

    // Usar o MESMO layout do modal de novo planejamento
    detailModalContent.innerHTML = `
        <form id="detailPlanejamentoForm">
            <!-- Seção 1: Detalhes do Planejamento -->
            <div class="form-section">
                <h4 class="section-title">Detalhes do Planejamento</h4>

                <!-- Linha com Tipo, Mês e Ano -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="detailPlanejamentoTipo">Tipo de Planejamento</label>
                        <div class="custom-select">
                            <div class="select-selected">
                                <span>${planejamento.tipo === 'especial' ? 'Planejamento Especial' : 'Planejamento Mensal'}</span>
                                <div class="select-arrow"></div>
                            </div>
                            <div class="select-items">
                                <div class="select-option" data-value="mensal">Planejamento Mensal</div>
                                <div class="select-option" data-value="especial">Planejamento Especial</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group" id="detailMesGroup">
                        <label for="detailPlanejamentoMes">Mês</label>
                        <div class="custom-select">
                            <div class="select-selected">
                                <span>${getMesNome(planejamento.mes)}</span>
                                <div class="select-arrow"></div>
                            </div>
                            <div class="select-items">
                                <div class="select-option" data-value="1">Janeiro</div>
                                <div class="select-option" data-value="2">Fevereiro</div>
                                <div class="select-option" data-value="3">Março</div>
                                <div class="select-option" data-value="4">Abril</div>
                                <div class="select-option" data-value="5">Maio</div>
                                <div class="select-option" data-value="6">Junho</div>
                                <div class="select-option" data-value="7">Julho</div>
                                <div class="select-option" data-value="8">Agosto</div>
                                <div class="select-option" data-value="9">Setembro</div>
                                <div class="select-option" data-value="10">Outubro</div>
                                <div class="select-option" data-value="11">Novembro</div>
                                <div class="select-option" data-value="12">Dezembro</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="detailPlanejamentoAno">Ano</label>
                        <div class="custom-select">
                            <div class="select-selected">
                                <span>${planejamento.ano}</span>
                                <div class="select-arrow"></div>
                            </div>
                            <div class="select-items">
                                <div class="select-option" data-value="2024">2024</div>
                                <div class="select-option" data-value="2025">2025</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Título -->
                <div class="form-group">
                    <label for="detailPlanejamentoTitulo">Título do Planejamento</label>
                    <input type="text" id="detailPlanejamentoTitulo" value="${planejamento.titulo}" readonly>
                </div>

                <!-- Descrição -->
                <div class="form-group">
                    <label for="detailPlanejamentoDescricao">Descrição</label>
                    <textarea id="detailPlanejamentoDescricao" readonly rows="3">${planejamento.descricao || ''}</textarea>
                </div>
            </div>

            <!-- Seção 2: Estatísticas -->
            <div class="form-section">
                <h4 class="section-title">Estatísticas</h4>
                
                <!-- Status lado a lado em linha horizontal -->
                <div class="stats-row">
                    <div class="stats-item">
                        <div class="stats-value">${planejamento.posts.length}</div>
                        <div class="stats-label">Total</div>
                    </div>
                    
                    <div class="stats-item">
                        <div class="stats-value">${stats.aprovados}</div>
                        <div class="stats-label">Aprovados</div>
                    </div>
                    
                    <div class="stats-item">
                        <div class="stats-value">${stats.emRevisao}</div>
                        <div class="stats-label">Em Revisão</div>
                    </div>
                    
                    <div class="stats-item">
                        <div class="stats-value">${stats.emProducao}</div>
                        <div class="stats-label">Em Produção</div>
                    </div>
                    
                    <div class="stats-item">
                        <div class="stats-value">${stats.rascunhos}</div>
                        <div class="stats-label">Rascunhos</div>
                    </div>
                </div>
            </div>

            <!-- Seção 3: Publicações Programadas -->
            <div class="form-section">
                <h4 class="section-title">Publicações Programadas</h4>

                <div class="posts-container" id="detailPostsContainer">
                    <!-- Posts serão adicionados dinamicamente -->
                </div>
            </div>
        </form>
    `;

    // Adicionar as publicações programadas (com selects maiores)
    const detailPostsContainer = document.getElementById('detailPostsContainer');
    detailPostsContainer.innerHTML = planejamento.posts.map((post, index) => `
        <div class="post-item">
            <div class="post-header">
                <div class="post-title-section">
                    <input type="text" class="post-titulo" value="${post.titulo}" readonly>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de Conteúdo</label>
                    <div class="custom-select">
                        <div class="select-selected">
                            <span>${getTipoNome(post.tipo)}</span>
                            <div class="select-arrow"></div>
                        </div>
                        <div class="select-items">
                            <div class="select-option" data-value="reels">Reels</div>
                            <div class="select-option" data-value="video">Vídeo</div>
                            <div class="select-option" data-value="carrossel">Carrossel</div>
                            <div class="select-option" data-value="storys">Storys</div>
                            <div class="select-option" data-value="foto">Foto</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <div class="custom-select">
                        <div class="select-selected">
                            <span>${getStatusNome(post.status)}</span>
                            <div class="select-arrow"></div>
                        </div>
                        <div class="select-items">
                            <div class="select-option" data-value="rascunho">Rascunho</div>
                            <div class="select-option" data-value="em_producao">Em Produção</div>
                            <div class="select-option" data-value="em_revisao">Em Revisão</div>
                            <div class="select-option" data-value="aprovado">Aprovado</div>
                            <div class="select-option" data-value="agendado">Agendado</div>
                            <div class="select-option" data-value="publicado">Publicado</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Prioridade</label>
                    <div class="custom-select">
                        <div class="select-selected">
                            <span>${post.prioridade}</span>
                            <div class="select-arrow"></div>
                        </div>
                        <div class="select-items">
                            <div class="select-option" data-value="baixa">Baixa</div>
                            <div class="select-option" data-value="media">Média</div>
                            <div class="select-option" data-value="alta">Alta</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Data de Postagem</label>
                    <input type="date" value="${post.data}" readonly>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Responsável</label>
                    <div class="custom-select">
                        <div class="select-selected">
                            <span>${getResponsavelNome(post.responsavel)}</span>
                            <div class="select-arrow"></div>
                        </div>
                        <div class="select-items">
                            <div class="select-option" data-value="alone">Alone Souza</div>
                            <div class="select-option" data-value="maria">Maria Silva</div>
                            <div class="select-option" data-value="joao">João Santos</div>
                            <div class="select-option" data-value="ana">Ana Costa</div>
                            <div class="select-option" data-value="carlos">Carlos Oliveira</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Destino da Tarefa</label>
                    <div class="custom-select">
                        <div class="select-selected">
                            <span>${getDestinoNome(post.destino)}</span>
                            <div class="select-arrow"></div>
                        </div>
                        <div class="select-items">
                            <div class="select-option" data-value="design">Design</div>
                            <div class="select-option" data-value="gravacao">Gravação</div>
                            <div class="select-option" data-value="edicao">Edição</div>
                            <div class="select-option" data-value="revisao">Revisão</div>
                            <div class="select-option" data-value="publicacao">Publicação</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Descrição da Publicação</label>
                <textarea readonly rows="3">${post.descricao}</textarea>
            </div>

            ${post.legenda ? `
            <div class="form-group">
                <label>Texto da Legenda</label>
                <textarea readonly rows="3">${post.legenda}</textarea>
            </div>
            ` : ''}

            ${post.inspiracao ? `
            <div class="form-group">
                <label>Inspirações (Links, imagens, vídeos)</label>
                <textarea readonly rows="2">${post.inspiracao}</textarea>
            </div>
            ` : ''}
        </div>
    `).join('');

    // Atualizar título do modal
    document.getElementById('detailModalTitle').textContent = 'Detalhes do Planejamento';
    
    // Configurar botões do modal
    editPlanejamentoBtn.textContent = 'Editar';
    editPlanejamentoBtn.style.display = 'inline-flex';
    detailActionsBtn.textContent = 'Compartilhar';
    
    // Inicializar selects no modal
    setTimeout(() => {
        initializeCustomSelects();
        
        // CORREÇÃO: Remover setas dos selects no modal de detalhes
        const detailSelects = detailModalContent.querySelectorAll('.custom-select .select-arrow');
        detailSelects.forEach(arrow => {
            arrow.style.display = 'none';
        });
        
        // Desabilitar todos os inputs e selects no modo de visualização
        const inputs = detailModalContent.querySelectorAll('input, textarea, select, .custom-select');
        inputs.forEach(input => {
            input.disabled = true;
            input.readonly = true;
            if (input.classList.contains('custom-select')) {
                input.style.pointerEvents = 'none';
                input.style.opacity = '0.9';
            }
        });
        
        // Remover eventos de clique dos selects
        const selectElements = detailModalContent.querySelectorAll('.select-selected');
        selectElements.forEach(select => {
            select.style.pointerEvents = 'none';
            select.style.cursor = 'default';
        });
    }, 10);

    detailModal.style.display = 'flex';
    setTimeout(() => detailModal.classList.add('show'), 10);
}

// Abrir detalhes em modo de edição
function openDetailModalInEditMode(id) {
    isEditMode = true;
    editPlanejamento(id);
}

function closeDetailModal() {
    detailModal.classList.remove('show');
    setTimeout(() => {
        detailModal.style.display = 'none';
        isEditMode = false;
    }, 300);
}

function calcularEstatisticas(posts) {
    return {
        aprovados: posts.filter(p => p.status === 'aprovado').length,
        emRevisao: posts.filter(p => p.status === 'em_revisao').length,
        emProducao: posts.filter(p => p.status === 'em_producao').length,
        rascunhos: posts.filter(p => p.status === 'rascunho').length,
        agendados: posts.filter(p => p.status === 'agendado').length,
        publicados: posts.filter(p => p.status === 'publicado').length
    };
}

function openNewPlanejamentoModal() {
    currentPlanejamentoId = null;
    postCounter = 1;
    isEditMode = false;
    modalTitle.textContent = 'Novo Planejamento';
    planejamentoForm.reset();
    postsContainer.innerHTML = '';
    
    // Adicionar primeiro post
    addPost();
    
    // Mostrar grupo do mês por padrão
    document.getElementById('mesGroup').style.display = 'block';
    document.getElementById('planejamentoMes').required = true;
    
    // Inicializar selects customizados no modal
    initializeCustomSelects();
    
    planejamentoModal.style.display = 'flex';
    setTimeout(() => planejamentoModal.classList.add('show'), 10);
}

function addPost() {
    const postElement = document.createElement('div');
    postElement.className = 'post-item';
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-title-section">
                <input type="text" class="post-titulo" name="postTitulo" placeholder="Título da publicação" required>
            </div>
            <button type="button" class="btn-remove-post">
                <span></span> Excluir
            </button>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Tipo de Conteúdo *</label>
                <div class="custom-select">
                    <div class="select-selected">
                        <span>Selecione</span>
                        <div class="select-arrow"></div>
                    </div>
                    <div class="select-items">
                        <div class="select-option" data-value="">Selecione</div>
                        <div class="select-option" data-value="reels">Reels</div>
                        <div class="select-option" data-value="video">Vídeo</div>
                        <div class="select-option" data-value="carrossel">Carrossel</div>
                        <div class="select-option" data-value="storys">Storys</div>
                        <div class="select-option" data-value="foto">Foto</div>
                        <div class="select-option" data-value="videos">Vídeos</div>
                        <div class="select-option" data-value="fotos">Fotos</div>
                    </div>
                    <select name="postTipo" required style="display: none;">
                        <option value="">Selecione</option>
                        <option value="reels">Reels</option>
                        <option value="video">Vídeo</option>
                        <option value="carrossel">Carrossel</option>
                        <option value="storys">Storys</option>
                        <option value="foto">Foto</option>
                        <option value="videos">Vídeos</option>
                        <option value="fotos">Fotos</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Status</label>
                <div class="custom-select">
                    <div class="select-selected">
                        <span>Rascunho</span>
                        <div class="select-arrow"></div>
                    </div>
                    <div class="select-items">
                        <div class="select-option" data-value="rascunho">Rascunho</div>
                        <div class="select-option" data-value="em_producao">Em Produção</div>
                        <div class="select-option" data-value="em_revisao">Em Revisão</div>
                        <div class="select-option" data-value="aprovado">Aprovado</div>
                        <div class="select-option" data-value="agendado">Agendado</div>
                        <div class="select-option" data-value="publicado">Publicado</div>
                    </div>
                    <select name="postStatus" style="display: none;">
                        <option value="rascunho">Rascunho</option>
                        <option value="em_producao">Em Produção</option>
                        <option value="em_revisao">Em Revisão</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="agendado">Agendado</option>
                        <option value="publicado">Publicado</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Prioridade</label>
                <div class="custom-select">
                    <div class="select-selected">
                        <span>Baixa</span>
                        <div class="select-arrow"></div>
                    </div>
                    <div class="select-items">
                        <div class="select-option" data-value="baixa">Baixa</div>
                        <div class="select-option" data-value="media">Média</div>
                        <div class="select-option" data-value="alta">Alta</div>
                    </div>
                    <select name="postPrioridade" style="display: none;">
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Data de Postagem *</label>
                <input type="date" name="postData" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Responsável *</label>
                <div class="custom-select">
                    <div class="select-selected">
                        <span>Selecione</span>
                        <div class="select-arrow"></div>
                    </div>
                    <div class="select-items">
                        <div class="select-option" data-value="">Selecione</div>
                        <div class="select-option" data-value="alone">Alone Souza</div>
                        <div class="select-option" data-value="maria">Maria Silva</div>
                        <div class="select-option" data-value="joao">João Santos</div>
                        <div class="select-option" data-value="ana">Ana Costa</div>
                        <div class="select-option" data-value="carlos">Carlos Oliveira</div>
                    </div>
                    <select name="postResponsavel" required style="display: none;">
                        <option value="">Selecione</option>
                        <option value="alone">Alone Souza</option>
                        <option value="maria">Maria Silva</option>
                        <option value="joao">João Santos</option>
                        <option value="ana">Ana Costa</option>
                        <option value="carlos">Carlos Oliveira</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Destino da Tarefa</label>
                <div class="custom-select">
                    <div class="select-selected">
                        <span>Selecione o destino</span>
                        <div class="select-arrow"></div>
                    </div>
                    <div class="select-items">
                        <div class="select-option" data-value="">Selecione o destino</div>
                        <div class="select-option" data-value="design">Design</div>
                        <div class="select-option" data-value="gravacao">Gravação</div>
                        <div class="select-option" data-value="edicao">Edição</div>
                        <div class="select-option" data-value="revisao">Revisão</div>
                        <div class="select-option" data-value="publicacao">Publicação</div>
                    </div>
                    <select name="postDestino" style="display: none;">
                        <option value="">Selecione o destino</option>
                        <option value="design">Design</option>
                        <option value="gravacao">Gravação</option>
                        <option value="edicao">Edição</option>
                        <option value="revisao">Revisão</option>
                        <option value="publicacao">Publicação</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label>Descrição da Publicação *</label>
            <textarea name="postDescricao" required placeholder="Descreva o conteúdo desta publicação..." rows="3"></textarea>
        </div>

        <div class="form-group">
            <label>Texto da Legenda</label>
            <textarea name="postLegenda" placeholder="Texto que acompanhará a publicação..." rows="3"></textarea>
        </div>

        <div class="form-group">
            <label>Inspirações (Links, imagens, vídeos)</label>
            <textarea name="postInspiracao" placeholder="Cole links de referência, inspirações ou observações..." rows="2"></textarea>
        </div>
    `;
    
    // Configurar remoção do post
    const removeBtn = postElement.querySelector('.btn-remove-post');
    removeBtn.addEventListener('click', function() {
        this.closest('.post-item').remove();
    });
    
    postsContainer.appendChild(postElement);
    
    // Inicializar selects customizados no novo post
    initializeCustomSelects();
    postCounter++;
}

function editPlanejamento(id) {
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) return;

    currentPlanejamentoId = id;
    modalTitle.textContent = 'Editar Planejamento';
    
    // Preencher formulário básico
    document.getElementById('planejamentoTipo').value = planejamento.tipo;
    document.getElementById('planejamentoMes').value = planejamento.mes;
    document.getElementById('planejamentoAno').value = planejamento.ano;
    document.getElementById('planejamentoTitulo').value = planejamento.titulo;
    document.getElementById('planejamentoDescricao').value = planejamento.descricao || '';
    
    // Atualizar selects customizados
    updateCustomSelect('planejamentoTipo', planejamento.tipo);
    updateCustomSelect('planejamentoMes', planejamento.mes);
    updateCustomSelect('planejamentoAno', planejamento.ano);
    
    // Controle de visibilidade do mês
    const mesGroup = document.getElementById('mesGroup');
    if (planejamento.tipo === 'especial') {
        mesGroup.style.display = 'none';
        document.getElementById('planejamentoMes').required = false;
    } else {
        mesGroup.style.display = 'block';
        document.getElementById('planejamentoMes').required = true;
    }
    
    // Limpar posts existentes
    postsContainer.innerHTML = '';
    postCounter = 1;
    
    // Adicionar posts
    planejamento.posts.forEach(post => {
        addPost();
        const lastPost = postsContainer.lastElementChild;
        
        // Preencher dados do post
        lastPost.querySelector('input[name="postTitulo"]').value = post.titulo || '';
        lastPost.querySelector('select[name="postTipo"]').value = post.tipo;
        lastPost.querySelector('select[name="postStatus"]').value = post.status || 'rascunho';
        lastPost.querySelector('select[name="postPrioridade"]').value = post.prioridade;
        lastPost.querySelector('input[name="postData"]').value = post.data;
        lastPost.querySelector('select[name="postResponsavel"]').value = post.responsavel;
        lastPost.querySelector('select[name="postDestino"]').value = post.destino || '';
        lastPost.querySelector('textarea[name="postDescricao"]').value = post.descricao;
        lastPost.querySelector('textarea[name="postLegenda"]').value = post.legenda || '';
        lastPost.querySelector('textarea[name="postInspiracao"]').value = post.inspiracao || '';
        
        // Atualizar selects customizados
        updateCustomSelectInElement(lastPost, 'postTipo', post.tipo);
        updateCustomSelectInElement(lastPost, 'postStatus', post.status || 'rascunho');
        updateCustomSelectInElement(lastPost, 'postPrioridade', post.prioridade);
        updateCustomSelectInElement(lastPost, 'postResponsavel', post.responsavel);
        updateCustomSelectInElement(lastPost, 'postDestino', post.destino || '');
    });
    
    // Fechar modal de detalhes e abrir modal de edição
    closeDetailModal();
    setTimeout(() => {
        planejamentoModal.style.display = 'flex';
        setTimeout(() => planejamentoModal.classList.add('show'), 10);
    }, 300);
}

function updateCustomSelect(selectId, value) {
    const hiddenSelect = document.getElementById(selectId);
    const customSelect = hiddenSelect.closest('.custom-select');
    const selectedSpan = customSelect.querySelector('.select-selected span');
    const options = customSelect.querySelectorAll('.select-option');
    
    if (hiddenSelect && selectedSpan) {
        hiddenSelect.value = value;
        
        // Encontrar o texto correspondente ao valor
        const selectedOption = Array.from(options).find(opt => 
            opt.getAttribute('data-value') === value
        );
        
        if (selectedOption) {
            selectedSpan.textContent = selectedOption.textContent;
        }
    }
}

function updateCustomSelectInElement(element, selectName, value) {
    const hiddenSelect = element.querySelector(`select[name="${selectName}"]`);
    if (!hiddenSelect) return;
    
    const customSelect = hiddenSelect.closest('.custom-select');
    const selectedSpan = customSelect.querySelector('.select-selected span');
    const options = customSelect.querySelectorAll('.select-option');
    
    hiddenSelect.value = value;
    
    // Encontrar o texto correspondente ao valor
    const selectedOption = Array.from(options).find(opt => 
        opt.getAttribute('data-value') === value
    );
    
    if (selectedOption) {
        selectedSpan.textContent = selectedOption.textContent;
    }
}

function savePlanejamento() {
    const formData = new FormData(planejamentoForm);
    
    // Coletar dados dos posts
    const posts = [];
    const postElements = postsContainer.querySelectorAll('.post-item');
    
    // Validação de posts
    if (postElements.length === 0) {
        alert('Adicione pelo menos uma publicação ao planejamento.');
        return;
    }
    
    let hasErrors = false;
    
    postElements.forEach((postElement, index) => {
        const postData = {
            titulo: postElement.querySelector('input[name="postTitulo"]').value,
            tipo: postElement.querySelector('select[name="postTipo"]').value,
            status: postElement.querySelector('select[name="postStatus"]').value || 'rascunho',
            prioridade: postElement.querySelector('select[name="postPrioridade"]').value,
            data: postElement.querySelector('input[name="postData"]').value,
            responsavel: postElement.querySelector('select[name="postResponsavel"]').value,
            destino: postElement.querySelector('select[name="postDestino"]').value || '',
            descricao: postElement.querySelector('textarea[name="postDescricao"]').value,
            legenda: postElement.querySelector('textarea[name="postLegenda"]').value,
            inspiracao: postElement.querySelector('textarea[name="postInspiracao"]').value
        };
        
        // Validação básica
        if (!postData.titulo || !postData.tipo || !postData.data || !postData.responsavel || !postData.descricao) {
            hasErrors = true;
            alert(`Preencha todos os campos obrigatórios da publicação ${index + 1}.`);
            return;
        }
        
        posts.push(postData);
    });
    
    if (hasErrors) return;
    
    // Validação do formulário principal
    if (!formData.get('tipo') || !formData.get('ano') || !formData.get('titulo')) {
        alert('Preencha todos os campos obrigatórios do planejamento.');
        return;
    }
    
    // Validação do mês (obrigatório apenas para planejamento mensal)
    if (formData.get('tipo') === 'mensal' && !formData.get('mes')) {
        alert('Selecione o mês do planejamento.');
        return;
    }

    const planejamentoData = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        tipo: formData.get('tipo'),
        mes: formData.get('mes') || '1',
        ano: formData.get('ano'),
        posts: posts,
        updatedAt: new Date().toISOString().split('T')[0]
    };

    if (currentPlanejamentoId) {
        // Editar planejamento existente
        const index = planejamentos.findIndex(p => p.id === currentPlanejamentoId);
        planejamentos[index] = { ...planejamentos[index], ...planejamentoData };
    } else {
        // Novo planejamento
        planejamentoData.id = planejamentos.length > 0 ? Math.max(...planejamentos.map(p => p.id)) + 1 : 1;
        planejamentoData.createdAt = new Date().toISOString().split('T')[0];
        planejamentos.push(planejamentoData);
    }

    renderPlanejamentoList();
    closeModal();
    
    showNotification(`Planejamento ${currentPlanejamentoId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
}

// Modal de compartilhamento
function openShareModal() {
    if (!currentPlanejamentoId) return;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'share-overlay';
    overlay.onclick = closeShareModal;
    
    // Criar modal de compartilhamento
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-header">
            <h3>Compartilhar Planejamento</h3>
            <button class="share-close">&times;</button>
        </div>
        <div class="share-body">
            <div class="share-options">
                <div class="share-option" onclick="compartilharEmail(${currentPlanejamentoId})">
                    <div class="share-icon email">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <span>Compartilhar por E-mail</span>
                </div>
                <div class="share-option" onclick="compartilharWhatsApp(${currentPlanejamentoId})">
                    <div class="share-icon whatsapp">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <span>Compartilhar no WhatsApp</span>
                </div>
                <div class="share-option" onclick="gerarPDF(${currentPlanejamentoId})">
                    <div class="share-icon pdf">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <span>Gerar PDF</span>
                </div>
                <div class="share-option" onclick="duplicarPlanejamento(${currentPlanejamentoId})">
                    <div class="share-icon duplicate">
                        <i class="fas fa-copy"></i>
                    </div>
                    <span>Duplicar Planejamento</span>
                </div>
            </div>
        </div>
    `;
    
    // Configurar botão de fechar
    modal.querySelector('.share-close').onclick = closeShareModal;
    
    // Adicionar ao DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
}

function closeShareModal() {
    const overlay = document.querySelector('.share-overlay');
    const modal = document.querySelector('.share-modal');
    
    if (overlay) overlay.classList.remove('show');
    if (modal) modal.classList.remove('show');
    
    setTimeout(() => {
        if (overlay) overlay.remove();
        if (modal) modal.remove();
    }, 300);
}

// Funções de compartilhamento
function compartilharEmail(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    const assunto = encodeURIComponent(`Planejamento: ${planejamento.titulo}`);
    let corpo = `Olá!\n\nSegue o planejamento de conteúdo:\n\n`;
    corpo += `*${planejamento.titulo}*\n`;
    corpo += `Tipo: ${planejamento.tipo === 'especial' ? 'Planejamento Especial' : `${getMesNome(planejamento.mes)} ${planejamento.ano}`}\n`;
    corpo += `Descrição: ${planejamento.descricao || 'Não informada'}\n\n`;
    corpo += `*Publicações (${planejamento.posts.length}):*\n\n`;
    
    planejamento.posts.forEach((post, index) => {
        corpo += `${index + 1}. ${post.titulo}\n`;
        corpo += `   Tipo: ${getTipoNome(post.tipo)}\n`;
        corpo += `   Status: ${getStatusNome(post.status)}\n`;
        corpo += `   Data: ${formatDate(post.data)}\n`;
        corpo += `   Responsável: ${getResponsavelNome(post.responsavel)}\n\n`;
    });
    
    corpo += `\nAtenciosamente,\nEquipe FlowUp`;
    
    const mailtoLink = `mailto:?subject=${assunto}&body=${encodeURIComponent(corpo)}`;
    window.open(mailtoLink);
    closeShareModal();
    showNotification('E-mail preparado para envio!', 'success');
}

function compartilharWhatsApp(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    let mensagem = `*${planejamento.titulo}*\n\n`;
    mensagem += `*Período:* ${planejamento.tipo === 'especial' ? 'Planejamento Especial' : `${getMesNome(planejamento.mes)} ${planejamento.ano}`}\n`;
    mensagem += `*Descrição:* ${planejamento.descricao || 'Não informada'}\n\n`;
    mensagem += `*Publicações (${planejamento.posts.length}):*\n\n`;
    
    planejamento.posts.forEach((post, index) => {
        mensagem += `*${index + 1}. ${post.titulo}*\n`;
        mensagem += ` Tipo: ${getTipoNome(post.tipo)}\n`;
        mensagem += ` Status: ${getStatusNome(post.status)}\n`;
        mensagem += ` Data: ${formatDate(post.data)}\n`;
        mensagem += ` Responsável: ${getResponsavelNome(post.responsavel)}\n\n`;
    });
    
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, '_blank');
    closeShareModal();
    showNotification('Compartilhando no WhatsApp...', 'success');
}

function gerarPDF(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações iniciais
    doc.setFont('helvetica', 'normal');
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text('FLOWUP - PLANEJAMENTO DE CONTEÚDO', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(planejamento.titulo, 105, 35, { align: 'center' });
    
    // Informações do planejamento
    doc.setFontSize(12);
    doc.text(`Tipo: ${planejamento.tipo === 'especial' ? 'Planejamento Especial' : `Mensal - ${getMesNome(planejamento.mes)} ${planejamento.ano}`}`, 20, 50);
    doc.text(`Descrição: ${planejamento.descricao || 'Não informada'}`, 20, 60);
    doc.text(`Data de criação: ${formatDate(planejamento.createdAt)}`, 20, 70);
    doc.text(`Última atualização: ${formatDate(planejamento.updatedAt)}`, 20, 80);
    
    // Tabela de publicações
    let y = 100;
    
    if (planejamento.posts.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(139, 92, 246);
        doc.text('PUBLICAÇÕES PROGRAMADAS', 20, y);
        y += 10;
        
        planejamento.posts.forEach((post, index) => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            // Título da publicação
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}. ${post.titulo}`, 20, y);
            doc.setFont('helvetica', 'normal');
            y += 7;
            
            // Detalhes
            doc.text(`Tipo: ${getTipoNome(post.tipo)} | Status: ${getStatusNome(post.status)} | Prioridade: ${post.prioridade}`, 20, y);
            y += 7;
            
            doc.text(`Data: ${formatDate(post.data)} | Responsável: ${getResponsavelNome(post.responsavel)}`, 20, y);
            y += 7;
            
            doc.text(`Destino: ${getDestinoNome(post.destino)}`, 20, y);
            y += 7;
            
            // Descrição
            const descLines = doc.splitTextToSize(`Descrição: ${post.descricao}`, 170);
            doc.text(descLines, 20, y);
            y += descLines.length * 7;
            
            y += 10;
        });
    }
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Página ${i} de ${pageCount} • Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, 285, { align: 'center' });
    }
    
    doc.save(`planejamento-${planejamento.titulo}.pdf`);
    closeShareModal();
    showNotification('PDF gerado com sucesso!', 'success');
}

function duplicarPlanejamento(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    const novoPlanejamento = {
        ...JSON.parse(JSON.stringify(planejamento)),
        id: planejamentos.length > 0 ? Math.max(...planejamentos.map(p => p.id)) + 1 : 1,
        titulo: `${planejamento.titulo} (Cópia)`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
    };
    
    planejamentos.push(novoPlanejamento);
    renderPlanejamentoList();
    closeShareModal();
    showNotification('Planejamento duplicado com sucesso!', 'success');
}

function closeModal() {
    planejamentoModal.classList.remove('show');
    setTimeout(() => {
        planejamentoModal.style.display = 'none';
    }, 300);
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
    setTimeout(() => {
        confirmModal.style.display = 'none';
    }, 300);
}

function deletePlanejamento() {
    planejamentos = planejamentos.filter(p => p.id !== currentPlanejamentoId);
    renderPlanejamentoList();
    closeConfirmModal();
    closeDetailModal();
    showNotification('Planejamento excluído com sucesso!', 'success');
}

// Funções auxiliares
function getMesNome(mes) {
    const meses = {
        '1': 'Janeiro', '2': 'Fevereiro', '3': 'Março', '4': 'Abril',
        '5': 'Maio', '6': 'Junho', '7': 'Julho', '8': 'Agosto',
        '9': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    return meses[mes] || mes;
}

function getTipoNome(tipo) {
    const tipos = {
        'reels': 'Reels',
        'video': 'Vídeo',
        'carrossel': 'Carrossel',
        'storys': 'Storys',
        'foto': 'Foto',
        'videos': 'Vídeos',
        'fotos': 'Fotos'
    };
    return tipos[tipo] || tipo;
}

function getStatusNome(status) {
    const statusMap = {
        'rascunho': 'Rascunho',
        'em_producao': 'Em Produção',
        'em_revisao': 'Em Revisão',
        'aprovado': 'Aprovado',
        'agendado': 'Agendado',
        'publicado': 'Publicado'
    };
    return statusMap[status] || status;
}

function getResponsavelNome(responsavel) {
    const responsaveis = {
        'alone': 'Alone Souza',
        'maria': 'Maria Silva',
        'joao': 'João Santos',
        'ana': 'Ana Costa',
        'carlos': 'Carlos Oliveira'
    };
    return responsaveis[responsavel] || responsavel;
}

function getDestinoNome(destino) {
    const destinos = {
        'design': 'Design',
        'gravacao': 'Gravação',
        'edicao': 'Edição',
        'revisao': 'Revisão',
        'publicacao': 'Publicação'
    };
    return destinos[destino] || destino;
}

function formatDate(dateString) {
    if (!dateString) return 'Não definido';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Menu do usuário
function initializeUserMenu() {
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userMenu = document.getElementById('user-menu');
    
    if (userMenuTrigger && userMenu) {
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('user-menu-show');
        });
        
        document.addEventListener('click', function() {
            userMenu.classList.remove('user-menu-show');
        });
        
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Exportar funções para uso global
window.openDetailModal = openDetailModal;
window.compartilharEmail = compartilharEmail;
window.compartilharWhatsApp = compartilharWhatsApp;
window.gerarPDF = gerarPDF;
window.duplicarPlanejamento = duplicarPlanejamento;