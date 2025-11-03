// agendamento.js - Versão Redesign
// Estado da aplicação
let projetosAgendamento = [];
let currentProjetoId = null;
let mediaFiles = [];
let selectedProjetoId = null;

// Elementos DOM
const agendamentoList = document.getElementById('agendamentoList');
const panelPlaceholder = document.getElementById('panelPlaceholder');
const panelContent = document.getElementById('panelContent');
const agendamentoModal = document.getElementById('agendamentoModal');
const confirmacaoModal = document.getElementById('confirmacaoModal');
const importarProjetosBtn = document.getElementById('importarProjetosBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  loadFromStorage();
  setupEventListeners();
  initializeUserMenu();
  renderAgendamentoList();
});

// Configuração de Event Listeners
function setupEventListeners() {
  // Botões de importação
  importarProjetosBtn.addEventListener('click', importarProjetosConcluidos);
  
  // Filtros
  document.getElementById('searchProjeto').addEventListener('input', renderAgendamentoList);
  document.getElementById('tipoFilter').addEventListener('change', renderAgendamentoList);
  document.getElementById('statusFilter').addEventListener('change', renderAgendamentoList);
  document.getElementById('mesFilter').addEventListener('change', renderAgendamentoList);
  
  // Botão limpar filtros
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
  
  // Botões do painel
  document.getElementById('editarAgendamentoBtn').addEventListener('click', editarAgendamento);
  document.getElementById('agendarNovamenteBtn').addEventListener('click', agendarNovamente);
  
  // Modal de agendamento
  document.getElementById('modalAgendamentoClose').addEventListener('click', closeAgendamentoModal);
  document.getElementById('cancelAgendamentoBtn').addEventListener('click', closeAgendamentoModal);
  document.getElementById('salvarAgendamentoBtn').addEventListener('click', salvarAgendamento);
  
  // Modal de confirmação
  document.getElementById('confirmacaoModalClose').addEventListener('click', closeConfirmacaoModal);
  document.getElementById('confirmacaoOkBtn').addEventListener('click', closeConfirmacaoModal);
  
  // Contador de caracteres
  document.getElementById('legendaPostagem').addEventListener('input', updateCharCount);
  
  // Upload de mídia
  document.getElementById('adicionarMidiaBtn').addEventListener('click', () => {
    document.getElementById('uploadMidia').click();
  });
  document.getElementById('uploadMidia').addEventListener('change', handleMediaUpload);
  
  // Fechar modais ao clicar fora
  window.addEventListener('click', function(event) {
    if (event.target === agendamentoModal) closeAgendamentoModal();
    if (event.target === confirmacaoModal) closeConfirmacaoModal();
  });
}

// Importar projetos concluídos da Gestão de Projetos
function importarProjetosConcluidos() {
  // Buscar projetos da Gestão de Projetos no localStorage
  const projetosGestao = JSON.parse(localStorage.getItem('flowup_gestao_v1') || '[]');
  
  // Filtrar apenas projetos concluídos (status "pronto_postar")
  const projetosConcluidos = projetosGestao.filter(projeto => 
    projeto.status === 'pronto_postar' && 
    !projetosAgendamento.some(p => p.id === projeto.id)
  );
  
  if (projetosConcluidos.length === 0) {
    showNotification('Nenhum projeto concluído encontrado para importar.', 'info');
    return;
  }
  
  // Converter para formato de agendamento
  const projetosImportados = projetosConcluidos.map(projeto => ({
    id: projeto.id,
    titulo: projeto.titulo,
    tipo: projeto.tipo,
    descricao: projeto.descricao,
    legenda: projeto.legenda || '',
    inspiracao: projeto.inspiracao || '',
    mes: projeto.mes,
    status: 'pronto', // pronto, agendado, publicado
    dataAgendamento: null,
    plataforma: 'instagram',
    tipoPostagem: projeto.tipo === 'reels' ? 'reels' : 
                  projeto.tipo === 'storys' ? 'storys' : 
                  projeto.tipo === 'carrossel' ? 'carrossel' : 'feed',
    midia: [],
    comentariosAtivos: true,
    compartilhamentoAtivo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  // Adicionar aos projetos de agendamento
  projetosAgendamento.push(...projetosImportados);
  
  // Salvar e renderizar
  saveToStorage();
  renderAgendamentoList();
  showNotification(`${projetosImportados.length} projeto(s) importado(s) com sucesso!`, 'success');
}

// Renderizar lista lateral
function renderAgendamentoList() {
  const filteredProjetos = filterProjetos();
  
  if (filteredProjetos.length === 0) {
    agendamentoList.innerHTML = `
      <div class="empty-list">
        <div class="empty-icon">📱</div>
        <h4>Nenhum agendamento encontrado</h4>
        <p>Importe projetos concluídos para começar</p>
      </div>
    `;
    return;
  }
  
  agendamentoList.innerHTML = filteredProjetos.map(projeto => `
    <div class="agendamento-item ${selectedProjetoId === projeto.id ? 'active' : ''}" 
         onclick="selectProjeto(${projeto.id})">
      <div class="item-header">
        <h3 class="item-titulo">${projeto.titulo}</h3>
        <span class="item-status status-${projeto.status}">
          ${getStatusNome(projeto.status)}
        </span>
      </div>
      
      <div class="item-meta">
        <div class="item-tipo">
          <span class="tipo-icon">${getTipoIcon(projeto.tipo)}</span>
          ${getTipoNome(projeto.tipo)}
        </div>
        <div class="item-data">
          ${projeto.dataAgendamento ? formatDateTime(projeto.dataAgendamento) : 'Não agendado'}
        </div>
      </div>
      
      <div class="item-descricao">
        ${projeto.descricao || 'Sem descrição disponível.'}
      </div>
    </div>
  `).join('');
}

// Selecionar projeto
function selectProjeto(id) {
  selectedProjetoId = id;
  renderAgendamentoList();
  showProjetoDetails(id);
}

// Mostrar detalhes do projeto no painel
function showProjetoDetails(id) {
  const projeto = projetosAgendamento.find(p => p.id === id);
  if (!projeto) return;

  // Esconder placeholder e mostrar conteúdo
  panelPlaceholder.style.display = 'none';
  panelContent.style.display = 'flex';

  // Preencher dados
  document.getElementById('panelTitulo').textContent = projeto.titulo;
  document.getElementById('panelTipo').textContent = getTipoNome(projeto.tipo);
  document.getElementById('panelStatus').innerHTML = `<span class="item-status status-${projeto.status}">${getStatusNome(projeto.status)}</span>`;
  document.getElementById('panelData').textContent = projeto.dataAgendamento ? formatDateTime(projeto.dataAgendamento) : 'Não agendado';
  document.getElementById('panelPlataforma').textContent = getPlataformaNome(projeto.plataforma);
  document.getElementById('panelLegenda').textContent = projeto.legenda || 'Sem legenda definida.';
  document.getElementById('panelHashtags').textContent = projeto.hashtags || 'Sem hashtags definidas.';

  // Renderizar mídia
  renderPanelMedia(projeto.midia);
}

// Renderizar mídia no painel
function renderPanelMedia(midia) {
  const panelMedia = document.getElementById('panelMedia');
  
  if (midia.length === 0) {
    panelMedia.innerHTML = '<p style="color: var(--muted); font-style: italic;">Nenhuma mídia adicionada.</p>';
    return;
  }
  
  panelMedia.innerHTML = midia.map(media => `
    <div class="media-item">
      ${media.type === 'image' ? 
        `<img src="${media.url}" alt="Mídia">` : 
        `<video src="${media.url}" muted></video>`
      }
    </div>
  `).join('');
}

// Filtrar projetos
function filterProjetos() {
  const searchTerm = document.getElementById('searchProjeto').value.toLowerCase();
  const tipoFilter = document.getElementById('tipoFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  const mesFilter = document.getElementById('mesFilter').value;

  return projetosAgendamento.filter(projeto => {
    const matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm) ||
                         projeto.descricao.toLowerCase().includes(searchTerm);
    const matchesTipo = tipoFilter === 'all' || projeto.tipo === tipoFilter;
    const matchesStatus = statusFilter === 'all' || projeto.status === statusFilter;
    const matchesMes = mesFilter === 'all' || projeto.mes === mesFilter;

    return matchesSearch && matchesTipo && matchesStatus && matchesMes;
  });
}

// Limpar filtros
function clearFilters() {
  document.getElementById('searchProjeto').value = '';
  document.getElementById('tipoFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';
  document.getElementById('mesFilter').value = 'all';
  renderAgendamentoList();
}

// Editar agendamento
function editarAgendamento() {
  if (!selectedProjetoId) return;
  openAgendamentoModal(selectedProjetoId);
}

// Agendar novamente
function agendarNovamente() {
  if (!selectedProjetoId) return;
  openAgendamentoModal(selectedProjetoId);
}

// Abrir modal de agendamento
function openAgendamentoModal(id) {
  const projeto = projetosAgendamento.find(p => p.id === id);
  if (!projeto) return;

  currentProjetoId = id;
  mediaFiles = [...projeto.midia];
  
  // Preencher dados do projeto
  document.getElementById('modalAgendamentoTitulo').textContent = `Agendar: ${projeto.titulo}`;
  document.getElementById('agendamentoTitulo').textContent = projeto.titulo;
  document.getElementById('agendamentoTipo').textContent = getTipoNome(projeto.tipo);
  document.getElementById('agendamentoMes').textContent = getMesNome(projeto.mes);
  
  // Preencher campos de agendamento
  document.getElementById('dataAgendamento').value = projeto.dataAgendamento ? 
    projeto.dataAgendamento.split('T')[0] : '';
  document.getElementById('horaAgendamento').value = projeto.dataAgendamento ? 
    projeto.dataAgendamento.split('T')[1].substring(0, 5) : '12:00';
  document.getElementById('plataformaAgendamento').value = projeto.plataforma;
  document.getElementById('tipoPostagem').value = projeto.tipoPostagem;
  
  // Preencher conteúdo
  document.getElementById('legendaPostagem').value = projeto.legenda;
  document.getElementById('hashtagsPostagem').value = projeto.hashtags || '';
  document.getElementById('localizacaoPostagem').value = projeto.localizacao || '';
  document.getElementById('marcarPessoas').value = projeto.marcarPessoas || '';
  
  // Configurações avançadas
  document.getElementById('comentariosAtivos').checked = projeto.comentariosAtivos !== false;
  document.getElementById('compartilhamentoAtivo').checked = projeto.compartilhamentoAtivo !== false;
  document.getElementById('salvarRascunho').checked = projeto.salvarRascunho || false;
  
  // Atualizar contador de caracteres
  updateCharCount();
  
  // Renderizar mídia
  renderMediaPreview();
  
  // Mostrar modal
  agendamentoModal.style.display = 'flex';
  setTimeout(() => agendamentoModal.classList.add('show'), 10);
}

// Fechar modal de agendamento
function closeAgendamentoModal() {
  agendamentoModal.classList.remove('show');
  setTimeout(() => {
    agendamentoModal.style.display = 'none';
    mediaFiles = [];
  }, 300);
}

// Atualizar contador de caracteres
function updateCharCount() {
  const textarea = document.getElementById('legendaPostagem');
  const charCount = document.getElementById('charCount');
  charCount.textContent = textarea.value.length;
  
  if (textarea.value.length > 2200) {
    charCount.style.color = '#dc3545';
  } else if (textarea.value.length > 2000) {
    charCount.style.color = '#fd7e14';
  } else {
    charCount.style.color = 'var(--muted)';
  }
}

// Manipular upload de mídia
function handleMediaUpload(event) {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      mediaFiles.push({
        id: generateId(),
        file: file,
        url: e.target.result,
        type: file.type.startsWith('image/') ? 'image' : 'video'
      });
      renderMediaPreview();
    };
    reader.readAsDataURL(file);
  });
  
  // Limpar input para permitir novos uploads
  event.target.value = '';
}

// Renderizar prévia de mídia
function renderMediaPreview() {
  const mediaPreview = document.getElementById('mediaPreview');
  
  mediaPreview.innerHTML = mediaFiles.map(media => `
    <div class="media-item">
      ${media.type === 'image' ? 
        `<img src="${media.url}" alt="Mídia">` : 
        `<video src="${media.url}" muted></video>`
      }
      <button class="media-remove" onclick="removeMedia('${media.id}')">×</button>
    </div>
  `).join('');
}

// Remover mídia
function removeMedia(id) {
  mediaFiles = mediaFiles.filter(media => media.id !== id);
  renderMediaPreview();
}

// Salvar agendamento
function salvarAgendamento() {
  const projeto = projetosAgendamento.find(p => p.id === currentProjetoId);
  if (!projeto) return;

  // Validar campos obrigatórios
  const dataAgendamento = document.getElementById('dataAgendamento').value;
  const horaAgendamento = document.getElementById('horaAgendamento').value;
  
  if (!dataAgendamento || !horaAgendamento) {
    showNotification('Por favor, preencha a data e horário de agendamento.', 'error');
    return;
  }
  
  // Atualizar projeto
  projeto.dataAgendamento = `${dataAgendamento}T${horaAgendamento}:00`;
  projeto.plataforma = document.getElementById('plataformaAgendamento').value;
  projeto.tipoPostagem = document.getElementById('tipoPostagem').value;
  projeto.legenda = document.getElementById('legendaPostagem').value;
  projeto.hashtags = document.getElementById('hashtagsPostagem').value;
  projeto.localizacao = document.getElementById('localizacaoPostagem').value;
  projeto.marcarPessoas = document.getElementById('marcarPessoas').value;
  projeto.midia = mediaFiles;
  projeto.comentariosAtivos = document.getElementById('comentariosAtivos').checked;
  projeto.compartilhamentoAtivo = document.getElementById('compartilhamentoAtivo').checked;
  projeto.salvarRascunho = document.getElementById('salvarRascunho').checked;
  projeto.status = projeto.salvarRascunho ? 'pronto' : 'agendado';
  projeto.updatedAt = new Date().toISOString();
  
  // Salvar e renderizar
  saveToStorage();
  renderAgendamentoList();
  
  // Atualizar painel se estiver visível
  if (selectedProjetoId === currentProjetoId) {
    showProjetoDetails(currentProjetoId);
  }
  
  closeAgendamentoModal();
  
  // Mostrar confirmação
  const mensagem = projeto.salvarRascunho ? 
    'Rascunho salvo com sucesso!' : 
    'Publicação agendada com sucesso!';
  
  document.getElementById('confirmacaoMensagem').textContent = mensagem;
  confirmacaoModal.style.display = 'flex';
  setTimeout(() => confirmacaoModal.classList.add('show'), 10);
  
  showNotification(mensagem, 'success');
}

// Fechar modal de confirmação
function closeConfirmacaoModal() {
  confirmacaoModal.classList.remove('show');
  setTimeout(() => {
    confirmacaoModal.style.display = 'none';
  }, 300);
}

// Funções auxiliares
function getStatusNome(status) {
  const statusMap = {
    'pronto': 'Pronto',
    'agendado': 'Agendado',
    'publicado': 'Publicado'
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

function getTipoIcon(tipo) {
  const icons = {
    'reels': '🎬',
    'video': '📹',
    'carrossel': '🖼️',
    'storys': '📱',
    'foto': '📸'
  };
  return icons[tipo] || '📄';
}

function getPlataformaNome(plataforma) {
  const plataformas = {
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'twitter': 'Twitter',
    'linkedin': 'LinkedIn'
  };
  return plataformas[plataforma] || plataforma;
}

function getMesNome(mes) {
  const meses = {
    '1': 'Janeiro', '2': 'Fevereiro', '3': 'Março', '4': 'Abril',
    '5': 'Maio', '6': 'Junho', '7': 'Julho', '8': 'Agosto',
    '9': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
  };
  return meses[mes] || mes;
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Persistência
function saveToStorage() {
  localStorage.setItem('flowup_agendamento_v1', JSON.stringify(projetosAgendamento));
}

function loadFromStorage() {
  const stored = localStorage.getItem('flowup_agendamento_v1');
  if (stored) {
    projetosAgendamento = JSON.parse(stored);
  }
}

// Notificações
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
    color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
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

// Expor funções para uso global
window.selectProjeto = selectProjeto;
window.removeMedia = removeMedia;