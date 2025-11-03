// calendario.js
const LS_KEY = 'flowup_planejamentos_v1';

// Estado
let allPosts = [];          // todos os posts (com data/hora) agregados
let viewYear, viewMonth;    // mês/ano exibidos (0-11)

// DOM
const calendarGrid = document.getElementById('calendarGrid');
const calTitle = document.getElementById('calTitle');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const tipoFilter = document.getElementById('tipoFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

const dayPanel = document.getElementById('dayPanel');
const dayPanelTitle = document.getElementById('dayPanelTitle');
const dayList = document.getElementById('dayList');
const closeDayPanel = document.getElementById('closeDayPanel');

// Init
document.addEventListener('DOMContentLoaded', () => {
  initializeUserMenu();
  loadPostsFromStorage();
  const today = new Date();
  viewYear = today.getFullYear();
  viewMonth = today.getMonth(); // 0-11
  renderCalendar();

  prevMonthBtn.addEventListener('click', () => changeMonth(-1));
  nextMonthBtn.addEventListener('click', () => changeMonth(1));
  tipoFilter.addEventListener('change', renderCalendar);
  statusFilter.addEventListener('change', renderCalendar);
  clearFiltersBtn.addEventListener('click', clearFilters);
  closeDayPanel.addEventListener('click', () => dayPanel.classList.remove('show'));
});

// Carrega planejamentos e agrega todos os posts (com data/hora)
function loadPostsFromStorage() {
  const raw = localStorage.getItem(LS_KEY);
  const planejamentos = raw ? JSON.parse(raw) : [];
  const posts = [];

  planejamentos.forEach(pl => {
    (pl.posts || []).forEach(post => {
      if (!post?.data) return; // precisa ter data
      posts.push({
        titulo: post.titulo,
        tipo: post.tipo,
        status: post.status || 'rascunho',
        prioridade: post.prioridade || 'media',
        data: post.data,              // YYYY-MM-DD
        hora: post.hora || '',        // HH:MM (opcional)
        responsavel: post.responsavel,
        destino: post.destino || '',
        descricao: post.descricao || '',
        legenda: post.legenda || '',
        inspiracao: post.inspiracao || '',
        planejamentoTitulo: pl.titulo,
        planejamentoMes: pl.mes,
        planejamentoAno: pl.ano
      });
    });
  });

  allPosts = posts;
}

function clearFilters() {
  tipoFilter.value = 'all';
  statusFilter.value = 'all';
  renderCalendar();
}

function changeMonth(delta) {
  viewMonth += delta;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
}

function renderCalendar() {
  // Header row (nomes dos dias)
  const weekDays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const headerRow = `
    <div class="cal-header-row">
      ${weekDays.map(d => `<div class="cal-header-cell">${d}</div>`).join('')}
    </div>
  `;

  // Título Mês/Ano
  calTitle.textContent = `${getMesNome(viewMonth+1)} ${viewYear}`;

  // Datas utilitárias
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekDay = firstDay.getDay(); // 0=Dom
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();

  // Células do mês anterior para preencher a primeira semana
  const prevMonthDays = startWeekDay; // qtd.
  const prevMonthDate = new Date(viewYear, viewMonth, 0);
  const prevMonthLastDay = prevMonthDate.getDate();

  // Filtros
  const tFilter = tipoFilter.value;
  const sFilter = statusFilter.value;

  // Agrupar posts por data YYYY-MM-DD
  const grouped = groupPostsByDate(allPosts, tFilter, sFilter);

  let cells = [];

  // Dias do mês anterior (cinzas)
  for (let i = prevMonthDays; i > 0; i--) {
    const dayNum = prevMonthLastDay - i + 1;
    const dateStr = formatYMD(new Date(viewYear, viewMonth-1, dayNum));
    cells.push(renderCell(dayNum, true, grouped[dateStr] || [], dateStr));
  }

  // Dias do mês atual
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatYMD(new Date(viewYear, viewMonth, d));
    cells.push(renderCell(d, false, grouped[dateStr] || [], dateStr));
  }

  // Dias do próximo mês para completar 6 linhas (42 células)
  while (cells.length % 7 !== 0) {
    const dayNum = cells.length - (prevMonthDays + daysInMonth) + 1;
    const dateStr = formatYMD(new Date(viewYear, viewMonth+1, dayNum));
    cells.push(renderCell(dayNum, true, grouped[dateStr] || [], dateStr));
  }

  calendarGrid.innerHTML = headerRow + cells.join('');
}

function renderCell(day, isOut, posts, dateStr) {
  const badgesHtml = posts.slice(0,4).map(p => `
    <div class="badge ${p.tipo}">
      <span>${p.titulo}</span>
      <span class="time">${p.hora || '—'}</span>
    </div>
  `).join('');

  return `
    <div class="cal-cell ${isOut ? 'out' : ''}" data-date="${dateStr}" onclick="onDayClick('${dateStr}')">
      <div class="cal-day">${day}</div>
      <div class="badges">
        ${badgesHtml}
        ${posts.length > 4 ? `<div class="badge" style="background:#334155;">+${posts.length - 4} mais</div>` : ''}
      </div>
    </div>
  `;
}

function onDayClick(dateStr) {
  // Lista filtrada para a data
  const tFilter = tipoFilter.value;
  const sFilter = statusFilter.value;

  const posts = allPosts.filter(p => {
    const same = p.data === dateStr;
    const tOk = (tFilter === 'all' || p.tipo === tFilter);
    const sOk = (sFilter === 'all' || p.status === sFilter);
    return same && tOk && sOk;
  });

  const { day, month, year } = explodeYMD(dateStr);
  dayPanelTitle.textContent = `Posts de ${day}/${month}/${year}`;
  dayList.innerHTML = posts.length ? posts.map(renderDayItem).join('') :
    `<div class="day-item"><div><h4>Sem publicações</h4><div class="meta">Nenhum post planejado para esta data.</div></div></div>`;

  dayPanel.classList.add('show');
}

function renderDayItem(p) {
  return `
    <div class="day-item">
      <div>
        <h4>${p.titulo}</h4>
        <div class="meta">
          ${getTipoNome(p.tipo)} • ${getStatusNome(p.status)} • ${p.hora || 'Sem hora'} • ${getResponsavelNome(p.responsavel)}
        </div>
        <div class="meta" style="margin-top:6px;">${p.descricao}</div>
        ${p.legenda ? `<div class="meta" style="margin-top:6px; font-style:italic;">Legenda: ${p.legenda}</div>` : ''}
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
        <span class="tag">Pri: ${p.prioridade}</span>
        <span class="tag">${p.planejamentoTitulo || ''}</span>
      </div>
    </div>
  `;
}

// Helpers
function groupPostsByDate(posts, tFilter, sFilter) {
  const out = {};
  posts.forEach(p => {
    if (!p.data) return;
    if (tFilter !== 'all' && p.tipo !== tFilter) return;
    if (sFilter !== 'all' && p.status !== sFilter) return;
    if (!out[p.data]) out[p.data] = [];
    out[p.data].push(p);
  });
  return out;
}

function formatYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${da}`;
}
function explodeYMD(s) {
  const [y,m,d] = s.split('-').map(Number);
  return { year:y, month:m, day:d };
}

function getMesNome(mes) {
  const map = {1:'Janeiro',2:'Fevereiro',3:'Março',4:'Abril',5:'Maio',6:'Junho',7:'Julho',8:'Agosto',9:'Setembro',10:'Outubro',11:'Novembro',12:'Dezembro'};
  return map[mes] || mes;
}
function getTipoNome(tipo) {
  const map = { reels:'Reels', video:'Vídeo', carrossel:'Carrossel', storys:'Storys', foto:'Foto' };
  return map[tipo] || tipo;
}
function getStatusNome(status) {
  const map = {
    rascunho:'Rascunho', em_producao:'Em Produção', em_revisao:'Em Revisão',
    aprovado:'Aprovado', agendado:'Agendado', publicado:'Publicado'
  };
  return map[status] || status;
}
function getResponsavelNome(responsavel) {
  const map = { alone:'Alone Souza', maria:'Maria Silva', joao:'João Santos', ana:'Ana Costa', carlos:'Carlos Oliveira' };
  return map[responsavel] || (responsavel || '—');
}

// Menu do usuário (mesmo padrão das demais páginas)
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
    userMenu.addEventListener('click', function(e) { e.stopPropagation(); });
  }
}

// Expor global p/ onclick
window.onDayClick = onDayClick;
