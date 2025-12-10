// Dados de exemplo
let briefings = [
    {
        id: 1,
        title: "Campanha Dias das Crianças",
        description: "Campanha especial para o dia das crianças com foco em produtos infantis e entretenimento familiar",
        objectives: "Aumentar vendas em 30% durante o período da campanha e fortalecer o posicionamento da marca no mercado infantil",
        cta: "Compre agora e ganhe 20% de desconto",
        target: "Pais e familiares de crianças de 3-12 anos, classe A/B, com interesse em produtos educativos e de qualidade",
        competition: "Lojas especializadas em brinquedos e grandes varejistas como Ri Happy e PBKids",
        market: "Mercado de brinquedos cresceu 15% no último ano, com tendência de produtos educativos e sustentáveis",
        messages: "Diversão garantida com os melhores preços e qualidade. Presentes que educam e divertem",
        tone: "amigavel",
        channels: ["instagram", "facebook"],
        budget: 5000,
        status: "in-progress",
        timeline: "1-15/10: Preparação e produção de conteúdo\n16-31/10: Execução da campanha nas redes sociais",
        startDate: "2024-10-01",
        endDate: "2024-10-31",
        createdAt: "2024-09-20",
        updatedAt: "2024-09-25"
    },
    {
        id: 2,
        title: "Lançamento Nova Linha Sustentável",
        description: "Lançamento da nova linha de produtos sustentáveis com foco em embalagens eco-friendly",
        objectives: "Posicionar marca como referência em sustentabilidade e captar early adopters conscientes",
        cta: "Seja um dos primeiros a experimentar",
        target: "Consumidores conscientes, 25-45 anos, preocupados com impacto ambiental e dispostos a pagar mais por sustentabilidade",
        competition: "Marcas locais e internacionais com foco eco-friendly como Natura e The Body Shop",
        market: "Crescimento de 40% no mercado de produtos sustentáveis nos últimos 2 anos",
        messages: "Sustentabilidade que transforma. Beleza que respeita o planeta",
        tone: "inspirador",
        channels: ["instagram", "linkedin"],
        budget: 15000,
        status: "draft",
        timeline: "Fase 1: Desenvolvimento do produto\nFase 2: Lançamento e divulgação",
        startDate: "2024-11-01",
        endDate: "2024-12-15",
        createdAt: "2024-09-15",
        updatedAt: "2024-09-15"
    }
];

let currentBriefingId = null;

// Elementos DOM
const briefingList = document.getElementById('briefingList');
const briefingModal = document.getElementById('briefingModal');
const confirmModal = document.getElementById('confirmModal');
const briefingForm = document.getElementById('briefingForm');
const newBriefingBtn = document.getElementById('newBriefingBtn');
const saveBriefingBtn = document.getElementById('saveBriefingBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Modal de detalhes
const briefingDetailModal = document.getElementById('briefingDetailModal');
const briefingDetailBody = document.getElementById('briefingDetailBody');
const closeBriefingDetailBtn = document.getElementById('closeBriefingDetailBtn');
const detailEditBtn = document.getElementById('detailEditBtn');
const detailDeleteBtn = document.getElementById('detailDeleteBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {

     
    renderBriefingList();
    setupEventListeners();
    initializeUserMenu();
    initializeCustomSelects();
});

function setupEventListeners() {
    // Botões principais
    newBriefingBtn.addEventListener('click', openNewBriefingModal);
    saveBriefingBtn.addEventListener('click', saveBriefing);
    cancelBtn.addEventListener('click', closeModal);
    
    // Botão de fechar do modal principal
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Filtros
    const statusFilter = document.getElementById('statusFilter');
    const searchBriefing = document.getElementById('searchBriefing');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', renderBriefingList);
    }
    if (searchBriefing) {
        searchBriefing.addEventListener('input', renderBriefingList);
    }

    // Modal de Detalhes
    const closeBriefingDetailBtn = document.getElementById('closeBriefingDetailBtn');
    const detailEditBtn = document.getElementById('detailEditBtn');
    const detailDeleteBtn = document.getElementById('detailDeleteBtn');

    if (closeBriefingDetailBtn) {
        closeBriefingDetailBtn.addEventListener('click', closeDetailModal);
    }

    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', function () {
            if (!currentBriefingId) return;
            closeDetailModal();
            editBriefing(currentBriefingId);
        });
    }

    if (detailDeleteBtn) {
        detailDeleteBtn.addEventListener('click', function () {
            if (!currentBriefingId) return;
            closeDetailModal();
            confirmDelete(currentBriefingId);
        });
    }

    // Modal de Confirmação (se existir)
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteBriefing);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeConfirmModal);
    }
    
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    }

    // Fechar modais ao clicar fora
    window.addEventListener('click', function (event) {
        if (event.target === briefingModal) closeModal();
        if (event.target === confirmModal) closeConfirmModal();
        if (event.target === briefingDetailModal) closeDetailModal();
    });

    // Fechar com ESC
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModal();
            closeConfirmModal();
            closeDetailModal();
        }
    });
}

function confirmDelete(id) {
    currentBriefingId = id;
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.style.display = 'flex';
        setTimeout(() => confirmModal.classList.add('show'), 10);
    }
}

function closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.classList.remove('show');
        setTimeout(() => {
            confirmModal.style.display = 'none';
        }, 300);
    }
}

function renderBriefingList() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchBriefing').value.toLowerCase();

    let filteredBriefings = briefings.filter(briefing => {
        const matchesStatus = statusFilter === 'all' || briefing.status === statusFilter;
        const matchesSearch =
            briefing.title.toLowerCase().includes(searchTerm) ||
            briefing.description.toLowerCase().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    filteredBriefings.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filteredBriefings.length === 0) {
        briefingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h4>Nenhum briefing encontrado</h4>
                <p>Crie seu primeiro briefing clicando no botão "Novo Briefing"</p>
            </div>
        `;
        return;
    }

    briefingList.innerHTML = filteredBriefings.map(briefing => `
        <div class="briefing-item" onclick="openBriefingDetail(${briefing.id})">
            <div class="briefing-item-header">
                <h4 class="briefing-item-title">${briefing.title}</h4>
                <span class="briefing-status ${briefing.status}">
                    ${getStatusText(briefing.status)}
                </span>
            </div>
            <p class="briefing-item-description">${briefing.description}</p>
            <div class="briefing-item-meta">
                <span class="briefing-date">${formatDate(briefing.updatedAt)}</span>
                <span class="briefing-channels">
                    ${briefing.channels.map(channel =>
                        `<span class="channel-tag">${getChannelName(channel)}</span>`
                    ).join('')}
                </span>
            </div>
        </div>
    `).join('');
}

// Abre modal de DETALHES ao clicar no card
function openBriefingDetail(id) {
    const briefing = briefings.find(b => b.id === id);
    if (!briefing) return;

    currentBriefingId = id;

    

    briefingDetailBody.innerHTML = `
        <div class="detail-header">
            <div class="detail-title-section">
                <h2>${briefing.title}</h2>
                <span class="briefing-status ${briefing.status}">${getStatusText(briefing.status)}</span>
            </div>
        </div>

        <div class="detail-content">
            <div class="detail-section">
                <h3>Sobre o Projeto</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Descrição</label>
                        <p>${briefing.description}</p>
                    </div>
                    <div class="detail-item">
                        <label>Objetivos e Prioridades</label>
                        <p>${briefing.objectives}</p>
                    </div>
                    <div class="detail-item">
                        <label>Call to Action</label>
                        <p class="cta-highlight">${briefing.cta}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Sobre o Mercado e Público</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Público-Alvo</label>
                        <p>${briefing.target}</p>
                    </div>
                    <div class="detail-item">
                        <label>Análise da Concorrência</label>
                        <p>${briefing.competition || 'Não informado'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Análise de Mercado</label>
                        <p>${briefing.market || 'Não informado'}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Sobre a Comunicação</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Principais Mensagens</label>
                        <p>${briefing.messages}</p>
                    </div>
                    <div class="detail-item">
                        <label>Tom de Voz</label>
                        <p>${getToneText(briefing.tone)}</p>
                    </div>
                    <div class="detail-item">
                        <label>Canais de Distribuição</label>
                        <div class="channels-list">
                            ${briefing.channels.map(channel =>
                                `<span class="channel-badge">${getChannelName(channel)}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Execução</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Orçamento</label>
                        <p>${briefing.budget ? `R$ ${briefing.budget.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'Não definido'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Cronograma</label>
                        <p>${briefing.timeline ? briefing.timeline.replace(/\n/g, '<br>') : 'Não definido'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Período</label>
                        <p>${briefing.startDate ? `${formatDate(briefing.startDate)} à ${formatDate(briefing.endDate)}` : 'Não definido'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    briefingDetailModal.style.display = 'flex';
    setTimeout(() => briefingDetailModal.classList.add('show'), 10);
}

function closeDetailModal() {
    if (!briefingDetailModal) return;
    briefingDetailModal.classList.remove('show');
    setTimeout(() => {
        briefingDetailModal.style.display = 'none';
    }, 300);
}


// Modal Novo/Editar
function openNewBriefingModal() {
    currentBriefingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Briefing';
    briefingForm.reset();

    document.querySelectorAll('input[name="channels"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('briefingStartDate').value = today;

    briefingModal.style.display = 'flex';
    setTimeout(() => briefingModal.classList.add('show'), 10);
}

function editBriefing(id) {
    const briefing = briefings.find(b => b.id === id);
    if (!briefing) return;

    currentBriefingId = id;
    document.getElementById('modalTitle').textContent = 'Editar Briefing';

    document.getElementById('briefingTitle').value = briefing.title;
    document.getElementById('briefingDescription').value = briefing.description;
    document.getElementById('briefingObjectives').value = briefing.objectives;
    document.getElementById('briefingCta').value = briefing.cta;
    document.getElementById('briefingTarget').value = briefing.target;
    document.getElementById('briefingCompetition').value = briefing.competition || '';
    document.getElementById('briefingMarket').value = briefing.market || '';
    document.getElementById('briefingMessages').value = briefing.messages;
    document.getElementById('briefingTone').value = briefing.tone;
    document.getElementById('briefingBudget').value = briefing.budget || '';
    document.getElementById('briefingStatus').value = briefing.status;
    document.getElementById('briefingTimeline').value = briefing.timeline || '';
    document.getElementById('briefingStartDate').value = briefing.startDate || '';
    document.getElementById('briefingEndDate').value = briefing.endDate || '';

    document.querySelectorAll('input[name="channels"]').forEach(checkbox => {
        checkbox.checked = briefing.channels.includes(checkbox.value);
    });

    briefingModal.style.display = 'flex';
    setTimeout(() => briefingModal.classList.add('show'), 10);
}

function saveBriefing() {
    const formData = new FormData(briefingForm);
    const channels = Array.from(
        document.querySelectorAll('input[name="channels"]:checked')
    ).map(checkbox => checkbox.value);

    const requiredFields = ['title', 'description', 'objectives', 'cta', 'target', 'messages', 'tone'];
    const missingFields = requiredFields.filter(field => !formData.get(field));

    if (missingFields.length > 0) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (channels.length === 0) {
        alert('Por favor, selecione pelo menos um canal de distribuição.');
        return;
    }

    const briefingData = {
        title: formData.get('title'),
        description: formData.get('description'),
        objectives: formData.get('objectives'),
        cta: formData.get('cta'),
        target: formData.get('target'),
        competition: formData.get('competition'),
        market: formData.get('market'),
        messages: formData.get('messages'),
        tone: formData.get('tone'),
        channels: channels,
        budget: formData.get('budget') ? parseFloat(formData.get('budget')) : null,
        status: formData.get('status'),
        timeline: formData.get('timeline'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        updatedAt: new Date().toISOString().split('T')[0]
    };

    if (currentBriefingId) {
        const index = briefings.findIndex(b => b.id === currentBriefingId);
        briefings[index] = { ...briefings[index], ...briefingData };
    } else {
        briefingData.id = briefings.length > 0 ? Math.max(...briefings.map(b => b.id)) + 1 : 1;
        briefingData.createdAt = new Date().toISOString().split('T')[0];
        briefings.push(briefingData);
    }

    renderBriefingList();
    closeModal();
    showNotification(`Briefing ${currentBriefingId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
}

function confirmDelete(id) {
    currentBriefingId = id;
    confirmModal.style.display = 'flex';
    setTimeout(() => confirmModal.classList.add('show'), 10);
}

function deleteBriefing() {
    briefings = briefings.filter(b => b.id !== currentBriefingId);
    renderBriefingList();
    closeConfirmModal();
    closeDetailModal();
    showNotification('Briefing excluído com sucesso!', 'success');
}

function closeModal() {
    briefingModal.classList.remove('show');
    setTimeout(() => {
        briefingModal.style.display = 'none';
    }, 300);
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
    setTimeout(() => {
        confirmModal.style.display = 'none';
    }, 300);
}

// ------ Custom Select (para filtros na topbar) ------
function initializeCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(select => {
        const selected = select.querySelector('.select-selected');
        const items = select.querySelector('.select-items');
        const options = items ? items.querySelectorAll('.select-option') : [];
        const hiddenSelect = select.querySelector('select');

        if (!selected || !items || !hiddenSelect) return;

        selected.addEventListener('click', function (e) {
            e.stopPropagation();
            closeAllSelects(this);
            items.classList.toggle('select-show');
        });

        options.forEach(option => {
            option.addEventListener('click', function () {
                const value = this.getAttribute('data-value');
                const text = this.textContent;

                selected.querySelector('span').textContent = text;
                hiddenSelect.value = value;
                hiddenSelect.dispatchEvent(new Event('change'));

                items.classList.remove('select-show');
            });
        });
    });

    document.addEventListener('click', closeAllSelects);
}

function closeAllSelects(elmnt) {
    const selects = document.querySelectorAll('.select-items');
    selects.forEach(select => {
        if (elmnt && select.contains(elmnt)) return;
        select.classList.remove('select-show');
    });
}

// ------ Auxiliares ------
function getStatusText(status) {
    const statusMap = {
        'draft': 'Rascunho',
        'in-progress': 'Em Andamento',
        'completed': 'Concluído'
    };
    return statusMap[status] || status;
}

function getToneText(tone) {
    const toneMap = {
        'formal': 'Formal',
        'informal': 'Informal',
        'amigavel': 'Amigável',
        'profissional': 'Profissional',
        'descontraido': 'Descontraído',
        'inspirador': 'Inspirador'
    };
    return toneMap[tone] || tone;
}

function getChannelName(channel) {
    const channelMap = {
        'instagram': 'Instagram',
        'facebook': 'Facebook',
        'twitter': 'Twitter',
        'linkedin': 'LinkedIn'
    };
    return channelMap[channel] || channel;
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
// Menu do usuário
function initializeUserMenu() {
  const userMenuTrigger = document.getElementById('user-menu-trigger');
  const userMenu = document.getElementById('user-menu');

  if (userMenuTrigger && userMenu) {
    userMenuTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      userMenu.classList.toggle('show');   // <--- AQUI
    });

    document.addEventListener('click', function () {
      userMenu.classList.remove('show');   // <--- E AQUI
    });

    userMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const kanbanView = document.getElementById('kanbanView');
  const listaView  = document.getElementById('listaView');
  const toggleBtns = document.querySelectorAll('.view-toggle .toggle-btn');

  if (kanbanView && listaView && toggleBtns.length) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // tira "active" de todos os botões
        toggleBtns.forEach(b => b.classList.remove('active'));
        // coloca só no clicado
        btn.classList.add('active');

        const view = btn.dataset.view;

        if (view === 'kanban') {
          kanbanView.classList.add('active');
          listaView.classList.remove('active');
        } else {
          listaView.classList.add('active');
          kanbanView.classList.remove('active');
        }
      });
    });

    // garante estado inicial (kanban)
    kanbanView.classList.add('active');
    listaView.classList.remove('active');
  }
});


