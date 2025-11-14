// Estado da aplicação
let projetos = [];
let currentProjetoId = null;
let currentView = 'kanban';

// Ordem dos status para progresso
const statusOrder = [
  'redacao',
  'gravacao',
  'edicao_video',
  'design',
  'fotografia',
  'revisao',
  'aprovacao',
  'aguardando_aprovacao',
  'pronto_postar'
];

// Elementos DOM
const kanbanView = document.getElementById('kanbanView');
const listaView = document.getElementById('listaView');
const listaContent = document.getElementById('listaContent');
const projetoModal = document.getElementById('projetoModal');
const statusModal = document.getElementById('statusModal');
const responsavelModal = document.getElementById('responsavelModal');
const deadlineModal = document.getElementById('deadlineModal');
const injetarMockBtn = document.getElementById('injetarMockBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  loadFromStorage();
  setupEventListeners();
  initializeUserMenu();
  renderViews();
});

function setupEventListeners() {
  // Toggle de visualização
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentView = this.dataset.view;
      switchView(currentView);
    });
  });

  // Busca
  document.getElementById('searchProjeto').addEventListener('input', renderViews);

  // Botão de injetar mock
  document.getElementById('injetarMockBtn').addEventListener('click', injectMockData);

  // Filtros
  setupFilterDropdown();

  // Modais
  setupModalEvents();

  // Drag & Drop nas colunas do Kanban
  setupDragAndDropColumns();
}

/* ================== DRAG & DROP ENTRE CARDZÕES ================== */

function setupDragAndDropColumns() {
  const columns = document.querySelectorAll('.column-content');

  columns.forEach(column => {
    // permitir arrastar por cima
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    });

    // soltar card na coluna
    column.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      if (!id) return;

      const projetoId = parseInt(id, 10);
      const projeto = projetos.find(p => p.id === projetoId);
      if (!projeto) return;

      const novoStatus = column.dataset.status;
      if (!novoStatus || novoStatus === projeto.status) return;

      // Atualizar status + histórico
      projeto.status = novoStatus;
      projeto.updatedAt = new Date().toISOString();
      projeto.historico.push({
        status: novoStatus,
        at: new Date().toISOString(),
        by: 'Alone Souza' // depois você pega do usuário logado
      });

      saveToStorage();
      renderViews();

      // Se o modal desse projeto estiver aberto, recarrega
      if (currentProjetoId === projetoId && projetoModal.style.display === 'flex') {
        openProjetoModal(projetoId);
      }
    });
  });
}

/* ================== FILTROS E CUSTOM SELECT ================== */

// Nova função para o sistema de filtros com dropdown customizado
function setupFilterDropdown() {
  const btnFilters = document.getElementById('btnFilters');
  const filtersDropdown = document.getElementById('filtersDropdown');
  const closeFilters = document.getElementById('closeFilters');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const filterBadge = document.getElementById('filterBadge');

  // Inicializar custom selects
  initializeCustomSelects();

  // Toggle dropdown
  if (btnFilters && filtersDropdown) {
    btnFilters.addEventListener('click', (e) => {
      e.stopPropagation();
      filtersDropdown.classList.toggle('show');
      btnFilters.classList.toggle('active');
    });
  }

  // Fechar dropdown
  if (closeFilters) {
    closeFilters.addEventListener('click', () => {
      filtersDropdown.classList.remove('show');
      btnFilters.classList.remove('active');
      closeAllCustomSelects();
    });
  }

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (filtersDropdown && !filtersDropdown.contains(e.target) && e.target !== btnFilters) {
      filtersDropdown.classList.remove('show');
      btnFilters.classList.remove('active');
      closeAllCustomSelects();
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (filtersDropdown.classList.contains('show')) {
        filtersDropdown.classList.remove('show');
        btnFilters.classList.remove('active');
      }
      closeAllCustomSelects();
    }
  });

  // Limpar filtros
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      // Resetar todos os custom selects
      document.querySelectorAll('.filter-custom-select').forEach(select => {
        const selected = select.querySelector('.select-selected span');
        const firstOption = select.querySelector('.select-option');
        const nativeSelect = select.querySelector('select');
        
        if (selected && firstOption) {
          selected.textContent = firstOption.textContent;
          if (nativeSelect) {
            nativeSelect.value = firstOption.dataset.value;
            nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        
        // Remover classe selected de todas as opções
        select.querySelectorAll('.select-option').forEach(option => {
          option.classList.remove('selected');
        });
        
        // Marcar primeira opção como selecionada
        if (firstOption) {
          firstOption.classList.add('selected');
        }
      });
      
      updateFilterBadge();
      renderViews(); // Re-renderizar as visualizações
      
      // Fechar dropdown após limpar
      filtersDropdown.classList.remove('show');
      btnFilters.classList.remove('active');
    });
  }

  // Inicializar badge
  updateFilterBadge();
}

// Inicializar custom selects
function initializeCustomSelects() {
  document.querySelectorAll('.filter-custom-select').forEach(select => {
    const selected = select.querySelector('.select-selected');
    const options = select.querySelectorAll('.select-option');
    const nativeSelect = select.querySelector('select');
    
    // Configurar seleção inicial
    const initialOption = options[0];
    if (initialOption) {
      initialOption.classList.add('selected');
    }
    
    // Configurar evento de clique no selected
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOtherCustomSelects(select);
      select.classList.toggle('open');
    });
    
    // Configurar eventos para as opções
    options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.textContent;
        
        selected.querySelector('span').textContent = text;
        
        if (nativeSelect) {
          nativeSelect.value = value;
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        select.classList.remove('open');
        
        updateFilterBadge();
        renderViews();
      });
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', () => {
      select.classList.remove('open');
    });
    
    select.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

function closeAllCustomSelects() {
  document.querySelectorAll('.filter-custom-select').forEach(select => {
    select.classList.remove('open');
  });
}

function closeOtherCustomSelects(currentSelect) {
  document.querySelectorAll('.filter-custom-select').forEach(select => {
    if (select !== currentSelect) {
      select.classList.remove('open');
    }
  });
}

// Atualizar badge de filtros ativos
function updateFilterBadge() {
  const filterBadge = document.getElementById('filterBadge');
  if (!filterBadge) return;
  
  const activeFilters = Array.from(document.querySelectorAll('.filter-custom-select .select-selected span'))
    .filter(span => {
      const text = span.textContent.trim();
      return !text.includes('Todos os') && !text.includes('Todas as');
    }).length;
  
  if (activeFilters > 0) {
    filterBadge.textContent = activeFilters;
    filterBadge.style.display = 'block';
  } else {
    filterBadge.style.display = 'none';
  }
}

/* ================== MODAIS ================== */

function setupModalEvents() {
  // Modal principal
  document.getElementById('modalProjetoClose').addEventListener('click', closeProjetoModal);
  document.getElementById('marcarConcluidoBtn').addEventListener('click', marcarConcluido);
  document.getElementById('atualizarStatusBtn').addEventListener('click', openStatusModal);
  document.getElementById('trocarResponsavelBtn').addEventListener('click', openResponsavelModal);
  document.getElementById('definirDeadlineBtn').addEventListener('click', openDeadlineModal);
  document.getElementById('cancelEditBtn').addEventListener('click', closeProjetoModal);
  document.getElementById('saveContentBtn').addEventListener('click', saveContent);

  // Modal de status
  document.getElementById('statusModalClose').addEventListener('click', closeStatusModal);
  document.getElementById('cancelStatusBtn').addEventListener('click', closeStatusModal);
  document.getElementById('saveStatusBtn').addEventListener('click', saveStatus);

  // Modal de responsável
  document.getElementById('responsavelModalClose').addEventListener('click', closeResponsavelModal);
  document.getElementById('cancelResponsavelBtn').addEventListener('click', closeResponsavelModal);
  document.getElementById('saveResponsavelBtn').addEventListener('click', saveResponsavel);

  // Modal de deadline
  document.getElementById('deadlineModalClose').addEventListener('click', closeDeadlineModal);
  document.getElementById('cancelDeadlineBtn').addEventListener('click', closeDeadlineModal);
  document.getElementById('saveDeadlineBtn').addEventListener('click', saveDeadline);

  // Fechar modais ao clicar fora
  window.addEventListener('click', function(event) {
    if (event.target === projetoModal) closeProjetoModal();
    if (event.target === statusModal) closeStatusModal();
    if (event.target === responsavelModal) closeResponsavelModal();
    if (event.target === deadlineModal) closeDeadlineModal();
  });
}

/* ================== INTEGRAÇÃO COM PLANEJAMENTO ================== */

// Função principal de integração com Planejamento Mensal
export function ingestFromPlanejamento(payloadArray) {
  console.log('📥 Recebendo dados do Planejamento Mensal:', payloadArray);
  
  payloadArray.forEach(item => {
    // Verificar se já existe um projeto com este ID
    const existingIndex = projetos.findIndex(p => p.id === item.id);
    
    if (existingIndex === -1) {
      // Novo projeto
      const novoProjeto = {
        id: item.id || generateId(),
        titulo: item.titulo,
        tipo: item.tipo,
        status: item.status || 'redacao',
        prioridade: item.prioridade || 'media',
        destino: item.destino,
        responsavel: item.responsavel,
        descricao: item.descricao,
        legenda: item.legenda,
        inspiracao: item.inspiracao,
        mes: item.mes,
        deadline: item.deadline || null,
        historico: [
          {
            status: item.status || 'redacao',
            at: new Date().toISOString(),
            by: 'Sistema'
          }
        ],
        concluido: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      projetos.push(novoProjeto);
      console.log('✅ Novo projeto criado:', novoProjeto.titulo);
    } else {
      // Atualizar projeto existente
      console.log('🔄 Atualizando projeto existente:', item.titulo);
      projetos[existingIndex] = {
        ...projetos[existingIndex],
        ...item,
        updatedAt: new Date().toISOString()
      };
    }
  });
  
  saveToStorage();
  renderViews();
  showNotification(`${payloadArray.length} projeto(s) integrado(s) com sucesso!`, 'success');
}

// Integração via postMessage (para comunicação entre páginas)
window.addEventListener('message', function(event) {
  if (event.data.type === 'FLOWUP_PLANEJAMENTO_SYNC') {
    ingestFromPlanejamento(event.data.payload);
  }
});

function generateId() {
  return Math.max(0, ...projetos.map(p => p.id)) + 1;
}

/* ================== RENDERIZAÇÃO ================== */

function renderViews() {
  const filteredProjetos = filterProjetos();
  renderKanbanView(filteredProjetos);
  renderListView(filteredProjetos);
  updateColumnCounts();
}

function filterProjetos() {
  const searchTerm = document.getElementById('searchProjeto').value.toLowerCase();
  const responsavelFilter = document.getElementById('responsavelFilter').value;
  const tipoFilter = document.getElementById('tipoFilter').value;
  const prioridadeFilter = document.getElementById('prioridadeFilter').value;
  const mesFilter = document.getElementById('mesFilter').value;

  return projetos.filter(projeto => {
    const matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm) ||
                         (projeto.descricao || '').toLowerCase().includes(searchTerm);
    const matchesResponsavel = responsavelFilter === 'all' || projeto.responsavel === responsavelFilter;
    const matchesTipo = tipoFilter === 'all' || projeto.tipo === tipoFilter;
    const matchesPrioridade = prioridadeFilter === 'all' || projeto.prioridade === prioridadeFilter;
    const matchesMes = mesFilter === 'all' || projeto.mes === mesFilter;

    return matchesSearch && matchesResponsavel && matchesTipo && matchesPrioridade && matchesMes;
  });
}

function renderKanbanView(projetosFiltrados) {
  // Limpar colunas
  document.querySelectorAll('.column-content').forEach(column => {
    column.innerHTML = '';
  });

  // Adicionar projetos às colunas
  projetosFiltrados.forEach(projeto => {
    const column = document.querySelector(`.column-content[data-status="${projeto.status}"]`);
    if (column) {
      column.appendChild(createProjetoCard(projeto));
    }
  });
}

function renderListView(projetosFiltrados) {
  if (projetosFiltrados.length === 0) {
    listaContent.innerHTML = `
      <div class="lista-item" style="justify-content: center; padding: 40px;">
        <div class="lista-cell" style="text-align: center; color: var(--muted);">
          Nenhum projeto encontrado
        </div>
      </div>
    `;
    return;
  }

  listaContent.innerHTML = projetosFiltrados.map(projeto => `
    <div class="lista-item ${projeto.concluido ? 'concluido' : ''} ${isAtrasado(projeto) ? 'atrasado' : ''}" 
         onclick="openProjetoModal(${projeto.id})">
      <div class="lista-cell titulo" data-label="Título">${projeto.titulo}</div>
      <div class="lista-cell status" data-label="Status">
        <span class="status-badge status-${projeto.status}">${getStatusNome(projeto.status)}</span>
      </div>
      <div class="lista-cell prioridade" data-label="Prioridade">
        <span class="prioridade-dot ${projeto.prioridade}"></span>
        ${projeto.prioridade}
      </div>
      <div class="lista-cell responsavel" data-label="Responsável">${getResponsavelNome(projeto.responsavel)}</div>
      <div class="lista-cell deadline" data-label="Data Limite">
        ${projeto.deadline ? formatDate(projeto.deadline) + (isAtrasado(projeto) ? ' ⚠️' : '') : '-'}
      </div>
      <div class="lista-cell mes" data-label="Mês">${getMesNome(projeto.mes)}</div>
      <div class="lista-cell acoes" data-label="Ações">
        <button class="btn-secondary" onclick="event.stopPropagation(); openProjetoModal(${projeto.id})">
          👁️ Ver
        </button>
      </div>
    </div>
  `).join('');
}

/* ====== AQUI É ONDE O CARD É MONTADO ====== */

function createProjetoCard(projeto) {
  const card = document.createElement('div');
  card.className = `projeto-card ${projeto.concluido ? 'concluido' : ''} ${isAtrasado(projeto) ? 'atrasado' : ''}`;
  card.dataset.id = projeto.id;
  card.setAttribute('draggable', 'true');

  const proximoDestino = getDestinoNome(projeto.destino) || '-';
  const temDeadline = !!projeto.deadline;

  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-left">
        <div class="card-tipo">${getTipoNome(projeto.tipo)}</div>
        <h4 class="card-titulo">${projeto.titulo}</h4>
      </div>
      <div class="card-prioridade ${projeto.prioridade}"></div>
    </div>

    <div class="card-meta">
      <div class="card-row chips-row">
        <span class="card-status status-${projeto.status}">
          ${getStatusNome(projeto.status)}
        </span>
        <span class="card-chip">
          ${getMesNome(projeto.mes)}
        </span>
      </div>

      <div class="card-bottom">
        <div class="card-bottom-left">
          <div class="card-responsavel">
            ${getResponsavelNome(projeto.responsavel)}
          </div>
          <div class="card-proximo">
            Próx. destino: <strong>${proximoDestino}</strong>
          </div>
        </div>

        <div class="card-bottom-right">
          <div class="card-deadline ${isAtrasado(projeto) ? 'atrasado' : ''}">
            ${temDeadline ? formatDate(projeto.deadline) : 'Sem data limite'}
          </div>
        </div>
      </div>
    </div>
  `;

  // abrir modal ao clicar
  card.addEventListener('click', () => openProjetoModal(projeto.id));

  // eventos de drag
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', String(projeto.id));
    e.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  return card;
}

function updateColumnCounts() {
  document.querySelectorAll('.kanban-column').forEach(column => {
    const status = column.dataset.status;
    const filtrados = filterProjetos();
    const count = filtrados.filter(p => p.status === status).length;
    column.querySelector('.column-count').textContent = count;
  });
}

function switchView(view) {
  if (view === 'kanban') {
    kanbanView.classList.add('active');
    listaView.classList.remove('active');
  } else {
    kanbanView.classList.remove('active');
    listaView.classList.add('active');
  }
}

/* ================== MODAL DETALHES / PROGRESSO ================== */

function openProjetoModal(id) {
  const projeto = projetos.find(p => p.id === id);
  if (!projeto) return;

  currentProjetoId = id;
  
  document.getElementById('modalProjetoTitulo').textContent = projeto.titulo;
  document.getElementById('detailTitulo').textContent = projeto.titulo;
  document.getElementById('detailTipo').textContent = getTipoNome(projeto.tipo);
  document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${projeto.status}">${getStatusNome(projeto.status)}</span>`;
  document.getElementById('detailPrioridade').innerHTML = `<span class="prioridade-dot ${projeto.prioridade}"></span> ${projeto.prioridade}`;
  document.getElementById('detailResponsavel').textContent = getResponsavelNome(projeto.responsavel);
  document.getElementById('detailDeadline').textContent = projeto.deadline ? formatDate(projeto.deadline) + (isAtrasado(projeto) ? ' ⚠️ Atrasado' : '') : 'Não definida';
  document.getElementById('detailMes').textContent = getMesNome(projeto.mes);
  document.getElementById('detailDestino').textContent = getDestinoNome(projeto.destino) || '-';
  document.getElementById('detailDescricao').value = projeto.descricao || '';
  document.getElementById('detailLegenda').value = projeto.legenda || '';
  document.getElementById('detailInspiracao').value = projeto.inspiracao || '';
  
  updateProgressBar(projeto);
  updateHistoryTimeline(projeto);
  
  projetoModal.style.display = 'flex';
  setTimeout(() => projetoModal.classList.add('show'), 10);
}

function closeProjetoModal() {
  projetoModal.classList.remove('show');
  setTimeout(() => {
    projetoModal.style.display = 'none';
  }, 300);
}

function updateProgressBar(projeto) {
  const progressFill = document.getElementById('progressFill');
  const progressSteps = document.getElementById('progressSteps');
  
  const currentIndex = statusOrder.indexOf(projeto.status);
  const progress = ((currentIndex + 1) / statusOrder.length) * 100;
  
  progressFill.style.width = `${progress}%`;
  
  progressSteps.innerHTML = statusOrder.map((status, index) => `
    <div class="progress-step ${index <= currentIndex ? 'concluido' : ''} ${index === currentIndex ? 'ativo' : ''}">
      ${getStatusNome(status)}
    </div>
  `).join('');
}

function updateHistoryTimeline(projeto) {
  const timeline = document.getElementById('historyTimeline');
  
  timeline.innerHTML = projeto.historico.map(item => `
    <div class="history-item-detailed ${item.status !== projeto.status ? 'anterior' : ''}">
      <span class="history-status">${getStatusNome(item.status)}</span>
      <span class="history-info">${formatDateTime(item.at)} • por ${item.by}</span>
    </div>
  `).reverse().join('');
}

/* ================== AÇÕES DO PROJETO ================== */

function marcarConcluido() {
  const projeto = projetos.find(p => p.id === currentProjetoId);
  if (!projeto) return;

  projeto.concluido = !projeto.concluido;
  projeto.updatedAt = new Date().toISOString();
  
  saveToStorage();
  renderViews();
  openProjetoModal(currentProjetoId);
  showNotification(`Projeto ${projeto.concluido ? 'marcado como concluído' : 'reaberto'}!`, 'success');
}

function openStatusModal() {
  const projeto = projetos.find(p => p.id === currentProjetoId);
  if (!projeto) return;

  document.getElementById('novoStatus').value = projeto.status;
  statusModal.style.display = 'flex';
  setTimeout(() => statusModal.classList.add('show'), 10);
}

function closeStatusModal() {
  statusModal.classList.remove('show');
  setTimeout(() => {
    statusModal.style.display = 'none';
  }, 300);
}

function saveStatus() {
  const novoStatus = document.getElementById('novoStatus').value;
  const projeto = projetos.find(p => p.id === currentProjetoId);
  
  if (projeto && projeto.status !== novoStatus) {
    projeto.historico.push({
      status: novoStatus,
      at: new Date().toISOString(),
      by: 'Alone Souza'
    });
    
    projeto.status = novoStatus;
    projeto.updatedAt = new Date().toISOString();
    
    saveToStorage();
    renderViews();
    closeStatusModal();
    openProjetoModal(currentProjetoId);
    showNotification('Status atualizado com sucesso!', 'success');
  }
}

function openResponsavelModal() {
  const projeto = projetos.find(p => p.id === currentProjetoId);
  if (!projeto) return;

  document.getElementById('novoResponsavel').value = projeto.responsavel;
  responsavelModal.style.display = 'flex';
  setTimeout(() => responsavelModal.classList.add('show'), 10);
}

function closeResponsavelModal() {
  responsavelModal.classList.remove('show');
  setTimeout(() => {
    responsavelModal.style.display = 'none';
  }, 300);
}

function saveResponsavel() {
  const novoResponsavel = document.getElementById('novoResponsavel').value;
  const novaFuncao = document.getElementById('novaFuncao').value;
  const projeto = projetos.find(p => p.id === currentProjetoId);
  
  if (projeto) {
    projeto.responsavel = novoResponsavel;
    projeto.updatedAt = new Date().toISOString();
    
    saveToStorage();
    renderViews();
    closeResponsavelModal();
    openProjetoModal(currentProjetoId);
    showNotification('Responsável atualizado com sucesso!', 'success');
  }
}

function openDeadlineModal() {
  const projeto = projetos.find(p => p.id === currentProjetoId);
  if (!projeto) return;

  document.getElementById('novaDeadline').value = projeto.deadline || '';
  deadlineModal.style.display = 'flex';
  setTimeout(() => deadlineModal.classList.add('show'), 10);
}

function closeDeadlineModal() {
  deadlineModal.classList.remove('show');
  setTimeout(() => {
    deadlineModal.style.display = 'none';
  }, 300);
}

function saveDeadline() {
  const novaDeadline = document.getElementById('novaDeadline').value;
  const projeto = projetos.find(p => p.id === currentProjetoId);
  
  if (projeto) {
    projeto.deadline = novaDeadline || null;
    projeto.updatedAt = new Date().toISOString();
    
    saveToStorage();
    renderViews();
    closeDeadlineModal();
    openProjetoModal(currentProjetoId);
    showNotification('Data limite definida com sucesso!', 'success');
  }
}

function saveContent() {
  const projeto = projetos.find(p => p.id === currentProjetoId);
  
  if (projeto) {
    projeto.legenda = document.getElementById('detailLegenda').value;
    projeto.inspiracao = document.getElementById('detailInspiracao').value;
    projeto.updatedAt = new Date().toISOString();
    
    saveToStorage();
    showNotification('Conteúdo salvo com sucesso!', 'success');
  }
}

/* ================== HELPERS ================== */

function getStatusNome(status) {
  const statusMap = {
    'redacao': 'Redação',
    'gravacao': 'Gravação',
    'edicao_video': 'Edição de Vídeo',
    'design': 'Design',
    'revisao': 'Revisão',
    'fotografia': 'Fotografia',
    'aprovacao': 'Aprovação',
    'aguardando_aprovacao': 'Aguardando Aprovação',
    'pronto_postar': 'Pronto pra Postar'
  };
  return statusMap[status] || status;
}

function getTipoNome(tipo) {
  const tipos = {
    'reels': 'Reels',
    'video': 'Vídeo',
    'carrossel': 'Carrossel',
    'storys': 'Storys',
    'foto': 'Foto'
  };
  return tipos[tipo] || tipo;
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

function getMesNome(mes) {
  const meses = {
    '1': 'Janeiro', '2': 'Fevereiro', '3': 'Março', '4': 'Abril',
    '5': 'Maio', '6': 'Junho', '7': 'Julho', '8': 'Agosto',
    '9': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
  };
  return meses[mes] || mes;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('pt-BR');
}

function isAtrasado(projeto) {
  if (!projeto.deadline || projeto.concluido) return false;
  return new Date(projeto.deadline) < new Date();
}

/* ================== STORAGE / UI ================== */

function saveToStorage() {
  localStorage.setItem('flowup_gestao_v1', JSON.stringify(projetos));
}

function loadFromStorage() {
  const stored = localStorage.getItem('flowup_gestao_v1');
  if (stored) {
    projetos = JSON.parse(stored);
  }
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

/* ================== MOCK DATA ================== */

function injectMockData() {
  const mockData = [
    {
      id: 101,
      titulo: "Reels Verão 2024",
      tipo: "reels",
      status: "gravacao",
      prioridade: "alta",
      destino: "gravacao",
      responsavel: "alone",
      descricao: "Reels com dicas de verão para redes sociais",
      legenda: "O verão chegou! 🌞 Confira nossas dicas para curtir a estação!",
      inspiracao: "https://exemplo.com/inspiracao-verao",
      mes: "1",
      deadline: "2024-01-20"
    },
    {
      id: 102,
      titulo: "Carrossel Produtos Novos",
      tipo: "carrossel",
      status: "design",
      prioridade: "media",
      destino: "design",
      responsavel: "maria",
      descricao: "Apresentação da nova linha de produtos",
      legenda: "Conheça nossos lançamentos! ✨",
      inspiracao: "https://exemplo.com/inspiracao-carrossel",
      mes: "1",
      deadline: "2024-01-25"
    },
    {
      id: 103,
      titulo: "Vídeo Tutorial",
      tipo: "video",
      status: "edicao_video",
      prioridade: "alta",
      destino: "edicao",
      responsavel: "joao",
      descricao: "Vídeo tutorial do produto principal",
      legenda: "Aprenda a usar como um expert! 🎬",
      inspiracao: "https://exemplo.com/inspiracao-tutorial",
      mes: "2",
      deadline: "2024-01-15" // Atrasado
    },
    {
      id: 104,
      titulo: "Storys Promocionais",
      tipo: "storys",
      status: "redacao",
      prioridade: "baixa",
      destino: "design",
      responsavel: "ana",
      descricao: "Série de storys para promoção especial",
      legenda: "Promoção relâmpago! ⚡",
      inspiracao: "https://exemplo.com/inspiracao-storys",
      mes: "2"
    },
    {
      id: 105,
      titulo: "Fotos Produto",
      tipo: "foto",
      status: "fotografia",
      prioridade: "media",
      destino: "fotografia",
      responsavel: "carlos",
      descricao: "Sessão de fotos do produto em uso",
      legenda: "Assim que se usa! 📸",
      inspiracao: "https://exemplo.com/inspiracao-fotos",
      mes: "1",
      deadline: "2024-01-30"
    },
    {
      id: 106,
      titulo: "Reels Behind the Scenes",
      tipo: "reels",
      status: "pronto_postar",
      prioridade: "baixa",
      destino: "publicacao",
      responsavel: "alone",
      descricao: "Reels mostrando bastidores da produção",
      legenda: "Nos bastidores! 🎭",
      inspiracao: "https://exemplo.com/inspiracao-bts",
      mes: "1",
      deadline: "2024-01-10"
    }
  ];

  // Adicionar histórico para alguns itens
  mockData[2].historico = [
    { status: 'redacao', at: '2024-01-01T10:00:00', by: 'Sistema' },
    { status: 'gravacao', at: '2024-01-05T14:30:00', by: 'Alone Souza' },
    { status: 'edicao_video', at: '2024-01-08T09:15:00', by: 'João Santos' }
  ];

  mockData[5].historico = [
    { status: 'redacao', at: '2024-01-02T11:00:00', by: 'Sistema' },
    { status: 'gravacao', at: '2024-01-03T15:20:00', by: 'Alone Souza' },
    { status: 'edicao_video', at: '2024-01-04T10:45:00', by: 'João Santos' },
    { status: 'revisao', at: '2024-01-05T14:00:00', by: 'Maria Silva' },
    { status: 'pronto_postar', at: '2024-01-06T16:30:00', by: 'Alone Souza' }
  ];

  mockData.forEach(item => {
    if (!item.historico) {
      item.historico = [
        { status: item.status, at: new Date().toISOString(), by: 'Sistema' }
      ];
    }
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    item.concluido = item.status === 'pronto_postar';
  });

  ingestFromPlanejamento(mockData);
}

// Expor funções para uso global ok
window.openProjetoModal = openProjetoModal;
window.ingestFromPlanejamento = ingestFromPlanejamento;


//pre