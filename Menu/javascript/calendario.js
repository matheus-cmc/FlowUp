// calendario.js
const LS_KEY = 'flowup_planejamentos_v1';

// Estado
let allPosts = [];          
let viewYear, viewMonth;    

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


// ==========================================================
// 1. LÓGICA DO SELETOR DE EMPRESA E MENU DO USUÁRIO
// ==========================================================

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

function initializeCustomSelect() {
    const customSelect = document.querySelector(".custom-select");
    const selectSelected = document.querySelector(".select-selected");
    const selectItems = document.querySelector(".select-items");

    if (customSelect && selectSelected && selectItems) {
        selectSelected.addEventListener("click", function(e) {
            e.stopPropagation(); 
            selectItems.classList.toggle("select-hide");
            selectSelected.classList.toggle("select-arrow-active");
        });

        const allOptions = selectItems.querySelectorAll(".select-option");
        allOptions.forEach(option => {
            option.addEventListener("click", function(e) {
                if (!option.classList.contains('select-new-company')) {
                    selectSelected.querySelector("span").textContent = option.querySelector("span").textContent.trim();
                } 
                selectItems.classList.add("select-hide");
                selectSelected.classList.remove("select-arrow-active");
            });
        });

        document.addEventListener("click", function() {
            if (selectItems && !selectItems.classList.contains("select-hide")) {
                selectItems.classList.add("select-hide");
            }
            if (selectSelected && selectSelected.classList.contains("select-arrow-active")) {
                selectSelected.classList.remove("select-arrow-active");
            }
        });
    }
}

// ==========================================================
// 2. LÓGICA DO CALENDÁRIO (INCLUINDO CORREÇÃO DO "PRI: UNDEFINED")
// ==========================================================

// Init
document.addEventListener('DOMContentLoaded', () => {
    initializeUserMenu(); 
    initializeCustomSelect(); 
    
    loadPostsFromStorage();
    
    viewYear = 2025;
    viewMonth = 11; // 11 é Dezembro (0-indexado)
    
    renderCalendar();

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    tipoFilter.addEventListener('change', renderCalendar);
    statusFilter.addEventListener('change', renderCalendar);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    if (closeDayPanel) {
        closeDayPanel.addEventListener('click', () => dayPanel.classList.remove('show'));
    }
    
    if (window.innerWidth >= 1200) {
        dayList.innerHTML = `<div class="day-item"><div><h4>Seja Bem-vindo(a)</h4><div class="meta">Clique em um dia no calendário para visualizar os posts agendados.</div></div></div>`;
        dayPanelTitle.textContent = `Posts do Dia`;
    }
});

function loadPostsFromStorage() {
    const raw = localStorage.getItem(LS_KEY);
    const planejamentos = raw ? JSON.parse(raw) : [];
    const posts = [];

    // --- DADOS MOCK PARA EXEMPLO (Dezembro/2025) ---
    const mockPosts = [
        { titulo: 'Reels: Tendências de 2026', tipo: 'reels', status: 'aprovado', data: '2025-12-03', hora: '10:00', responsavel: 'alone', descricao: 'Conteúdo viral com música popular do TikTok.', prioridade: 'alta' },
        { titulo: 'Carrossel: Top 5 Dicas', tipo: 'carrossel', status: 'em_producao', data: '2025-12-07', hora: '14:30', responsavel: 'maria', legenda: 'Use o CTA para linkar ao novo e-book.', prioridade: 'media' },
        { titulo: 'Stories: Enquete Rápida', tipo: 'storys', status: 'agendado', data: '2025-12-07', hora: '18:00', responsavel: 'joao', descricao: 'Pergunta simples de "Sim ou Não" sobre o produto B.', prioridade: 'baixa' },
        { titulo: 'Vídeo Longo: Review do Mês', tipo: 'video', status: 'aprovado', data: '2025-12-15', hora: '12:00', responsavel: 'ana', descricao: 'Vídeo de 3 minutos para IGTV e YouTube. Foco em SEO.', prioridade: 'alta' },
        { titulo: 'Foto Natalina', tipo: 'foto', status: 'em_revisao', data: '2025-12-24', hora: '10:00', responsavel: 'carlos', descricao: 'Foto do time desejando boas festas. Aguardando aprovação final do cliente.', prioridade: 'media' },
        { titulo: 'Stories: Boas Festas', tipo: 'storys', status: 'agendado', data: '2025-12-24', hora: '20:00', responsavel: 'alone', descricao: 'Template animado de final de ano.', prioridade: 'baixa' },
        { titulo: 'Post sem prioridade', tipo: 'foto', status: 'rascunho', data: '2025-12-28', hora: '10:00', responsavel: 'alone', descricao: 'Teste para post sem prioridade definida.' },
    ];
    posts.push(...mockPosts);
    // --------------------------------------------------

    planejamentos.forEach(pl => {
        (pl.posts || []).forEach(post => {
            if (!post?.data) return; 
            posts.push({
                titulo: post.titulo,
                tipo: post.tipo,
                status: post.status || 'rascunho',
                prioridade: post.prioridade || '', // Garante string vazia se undefined/null
                data: post.data,            
                hora: post.hora || '',      
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
    if (window.innerWidth < 1200) {
        dayPanel.classList.remove('show');
    }

    viewMonth += delta;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
    
    if (window.innerWidth >= 1200) {
        dayList.innerHTML = `<div class="day-item"><div><h4>Mês Alterado</h4><div class="meta">Clique em um dia do novo mês para ver as postagens.</div></div></div>`;
        dayPanelTitle.textContent = `Posts do Mês`;
    }
}

function renderCalendar() {
    const weekDays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const headerRow = `
        <div class="cal-header-row">
            ${weekDays.map(d => `<div class="cal-header-cell">${d}</div>`).join('')}
        </div>
    `;

    const mesNome = getMesNome(viewMonth + 1);
    calTitle.textContent = `${mesNome} ${viewYear}`;

    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekDay = firstDay.getDay(); 
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();

    const prevMonthDays = startWeekDay; 
    const prevMonthDate = new Date(viewYear, viewMonth, 0);
    const prevMonthLastDay = prevMonthDate.getDate();

    const tFilter = tipoFilter.value;
    const sFilter = statusFilter.value;
    const grouped = groupPostsByDate(allPosts, tFilter, sFilter);

    let cells = [];

    for (let i = prevMonthDays; i > 0; i--) {
        const dayNum = prevMonthLastDay - i + 1;
        const dateStr = formatYMD(new Date(viewYear, viewMonth-1, dayNum));
        cells.push(renderCell(dayNum, true, grouped[dateStr] || [], dateStr));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = formatYMD(new Date(viewYear, viewMonth, d));
        cells.push(renderCell(d, false, grouped[dateStr] || [], dateStr));
    }

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
                ${posts.length > 4 ? `<div class="badge" style="background:#334155; color:#fff; padding-left: 10px;">+${posts.length - 4} mais</div>` : ''}
            </div>
        </div>
    `;
}

function onDayClick(dateStr) {
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

    if (window.innerWidth < 1200) {
        dayPanel.classList.add('show');
    }
}

function renderDayItem(p) {
    // Tags dinâmicas - Prioridade só aparece se existir e não for vazia
    let tagsHtml = '';
    if (p.prioridade) { 
        tagsHtml += `<span class="tag priority">Prioridade: ${p.prioridade}</span>`;
    }
    if (p.planejamentoTitulo) {
        tagsHtml += `<span class="tag">Projeto: ${p.planejamentoTitulo}</span>`;
    }

    return `
        <div class="day-item">
            <div>
                <h4>${p.titulo}</h4>
                <div class="meta">
                    ${getTipoNome(p.tipo)} • ${getStatusNome(p.status)} • ${p.hora || 'Sem hora'} • ${getResponsavelNome(p.responsavel)}
                </div>
                
                ${p.descricao ? `
                    <div class="meta-bloco">
                        **Descrição:** ${p.descricao}
                    </div>
                ` : ''}
                
                ${p.legenda ? `
                    <div class="meta-bloco" style="border-left-color: var(--g3); font-style:italic;">
                        **Legenda:** ${p.legenda}
                    </div>
                ` : ''}
            </div>
            
            ${tagsHtml ? `<div class="day-item-tags">${tagsHtml}</div>` : ''}
        </div>
    `;
}

// Funções auxiliares

function openMonthYearSelector() {
    // Função para possível seletor de mês/ano
    return;
}
window.openMonthYearSelector = openMonthYearSelector;


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

window.onDayClick = onDayClick;