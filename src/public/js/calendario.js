// calendario.js
const LS_KEY = 'flowup_planejamentos_v1';

// Estado
let allPosts = [];          
let viewYear, viewMonth;    
let currentSelectedDate = '2025-01-15';

// DOM
const calTitle = document.getElementById('calTitle');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const tipoFilter = document.getElementById('tipoFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

const dayPanel = document.getElementById('dayPanel');
const dayPanelTitle = document.getElementById('dayPanelTitle');
const dayContent = document.getElementById('dayContent');
const closeDayPanel = document.getElementById('closeDayPanel');

// ==========================================================
// 1. INICIALIZAÇÃO
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeUserMenu(); 
    initializeCustomSelect(); 
    
    loadPostsFromStorage();
    
    // Janeiro 2025 como na imagem
    viewYear = 2025;
    viewMonth = 0; // 0 é Janeiro (0-indexado)
    
    renderCalendar();

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    tipoFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    if (closeDayPanel) {
        closeDayPanel.addEventListener('click', () => dayPanel.classList.remove('show'));
    }
    
    // Selecionar o dia 15 por padrão (como na imagem)
    setTimeout(() => {
        onDayClick('2025-01-15');
        highlightDay(15);
    }, 100);

    // Adicionar efeitos visuais
    addVisualEffects();
});

function addVisualEffects() {
    // Adicionar animação de entrada aos elementos
    const calendarElements = document.querySelectorAll('.table-cell-improved, .publicacao-item-improved, .stat-item');
    calendarElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ==========================================================
// 2. LÓGICA DO CALENDÁRIO (MANTIDA COM MELHORIAS)
// ==========================================================

function loadPostsFromStorage() {
    // Dados mock baseados na imagem
    const mockPosts = [
        { 
            titulo: 'Participação da Vista (Companhia Vista 2025)', 
            tipo: 'design', 
            status: 'aprovado', 
            data: '2025-01-15', 
            hora: '10:00', 
            responsavel: 'alone',
            descricao: 'GRAÇA DE LÍNGUA',
            prioridade: 'alta'
        },
        { 
            titulo: 'Caminho Responsável', 
            tipo: 'caminho', 
            status: 'aprovado', 
            data: '2025-01-15', 
            hora: '14:00', 
            responsavel: 'equipe',
            descricao: 'Equivalência: 25,00 punta\nCAMINHO',
            prioridade: 'media'
        },
        { 
            titulo: 'Brasília Básia', 
            tipo: 'brasilia', 
            status: 'aprovado', 
            data: '2026-01-15', 
            hora: '16:00', 
            responsavel: 'equipe',
            descricao: 'Embora poderá o trabalho\nCAMINHO',
            prioridade: 'media'
        }
    ];
    
    allPosts = mockPosts;
}

function applyFilters() {
    const tFilter = tipoFilter.value;
    const sFilter = statusFilter.value;
    
    const posts = allPosts.filter(p => {
        const same = p.data === currentSelectedDate;
        const tOk = (tFilter === 'all' || p.tipo === tFilter);
        const sOk = (sFilter === 'all' || p.status === sFilter);
        return same && tOk && sOk;
    });
    
    renderDayContent(currentSelectedDate, posts);
}

function clearFilters() {
    tipoFilter.value = 'all';
    statusFilter.value = 'all';
    applyFilters();
    
    // Efeito visual ao limpar filtros
    const filters = document.querySelectorAll('.filter-select-improved');
    filters.forEach(filter => {
        filter.style.transform = 'scale(1.05)';
        setTimeout(() => {
            filter.style.transform = 'scale(1)';
        }, 200);
    });
}

function changeMonth(delta) {
    if (window.innerWidth < 1200) {
        dayPanel.classList.remove('show');
    }

    viewMonth += delta;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
    
    // Efeito de transição
    const calendarTable = document.querySelector('.calendar-table-improved');
    calendarTable.style.opacity = '0.7';
    calendarTable.style.transform = 'translateX(' + (delta * 10) + 'px)';
    setTimeout(() => {
        calendarTable.style.opacity = '1';
        calendarTable.style.transform = 'translateX(0)';
    }, 300);
}

function renderCalendar() {
    const mesNome = getMesNome(viewMonth + 1);
    calTitle.textContent = `${mesNome} ${viewYear}`;
}

function highlightDay(day) {
    // Remove highlight de todas as células
    document.querySelectorAll('.table-cell-improved').forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    // Aplica highlight ao dia específico
    const dayCell = document.getElementById(`day-${day}`);
    if (dayCell) {
        dayCell.classList.add('highlight');
        
        // Efeito de pulso
        dayCell.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
            dayCell.style.animation = '';
        }, 600);
    }
}

function onDayClick(dateStr) {
    currentSelectedDate = dateStr;
    
    const tFilter = tipoFilter.value;
    const sFilter = statusFilter.value;
    
    const posts = allPosts.filter(p => {
        const same = p.data === dateStr;
        const tOk = (tFilter === 'all' || p.tipo === tFilter);
        const sOk = (sFilter === 'all' || p.status === sFilter);
        return same && tOk && sOk;
    });

    renderDayContent(dateStr, posts);

    if (window.innerWidth < 1200) {
        dayPanel.classList.add('show');
    }
    
    // Destacar o dia clicado
    const dayNum = parseInt(dateStr.split('-')[2]);
    highlightDay(dayNum);
    
    // Efeito de clique
    const clickedCell = document.querySelector(`[onclick="onDayClick('${dateStr}')"]`);
    if (clickedCell) {
        clickedCell.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedCell.style.transform = 'scale(1)';
        }, 150);
    }
}

function renderDayContent(dateStr, posts) {
    const { day, month, year } = explodeYMD(dateStr);
    dayPanelTitle.textContent = `${day} de ${getMesNome(month)} de ${year}`;
    
    // Atualizar contador de posts
    const postsCount = document.querySelector('.posts-count');
    if (postsCount) {
        postsCount.textContent = `${posts.length} postagem${posts.length !== 1 ? 's' : ''}`;
    }
    
    if (dateStr === '2025-01-15' && posts.length > 0) {
        dayContent.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <div class="section-icon">📱</div>
                    <h4>3 Porta Aparência</h4>
                </div>
                <div class="publicacao-dia-improved">
                    ${posts.map((post, index) => `
                        <div class="publicacao-item-improved" style="animation-delay: ${index * 0.1}s">
                            <div class="post-header">
                                <div class="post-type-badge ${post.tipo}">${post.tipo}</div>
                                <div class="post-time">${post.hora}</div>
                            </div>
                            <h5>${post.titulo}</h5>
                            <div class="post-content">
                                <div class="post-meta">${post.descricao.split('\n')[0]}</div>
                                <div class="post-desc">${post.descricao.split('\n')[1] || ''}</div>
                            </div>
                            <div class="post-footer">
                                <span class="post-responsavel">👤 ${getResponsavelNome(post.responsavel)}</span>
                                <span class="post-status approved">${getStatusNome(post.status)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="content-section agenda">
                <div class="section-header">
                    <div class="section-icon">📅</div>
                    <h4>Agenda Social</h4>
                </div>
                <div class="agenda-content">
                    <div class="agenda-item">
                        <div class="agenda-meta">Edital Agência</div>
                        <div class="agenda-desc">Publicação pela manhã</div>
                    </div>
                </div>
            </div>

            <div class="content-section stats">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${posts.length}</div>
                        <div class="stat-label">Postagens</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${new Set(posts.map(p => p.tipo)).size}</div>
                        <div class="stat-label">Tipos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${Math.round((posts.filter(p => p.status === 'aprovado').length / posts.length) * 100)}%</div>
                        <div class="stat-label">Aprovado</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        dayContent.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <div class="section-icon">📱</div>
                    <h4>Sem publicações</h4>
                </div>
                <div class="publicacao-dia-improved">
                    <div class="publicacao-item-improved">
                        <div class="post-content">
                            <div class="post-meta">Nenhum post agendado para esta data.</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Re-aplicar efeitos visuais aos novos elementos
    setTimeout(() => {
        addVisualEffects();
    }, 50);
}

// ==========================================================
// 3. FUNÇÕES AUXILIARES (MANTIDAS)
// ==========================================================

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
    const map = {
        1:'Janeiro', 2:'Fevereiro', 3:'Março', 4:'Abril', 
        5:'Maio', 6:'Junho', 7:'Julho', 8:'Agosto', 
        9:'Setembro', 10:'Outubro', 11:'Novembro', 12:'Dezembro'
    };
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

function openMonthYearSelector() {
    // Função para possível seletor de mês/ano
    alert('Seletor de Mês/Ano - Em desenvolvimento');
}

// ==========================================================
// 4. EXPORTAÇÃO PARA ESCOPO GLOBAL
// ==========================================================

window.onDayClick = onDayClick;
window.openMonthYearSelector = openMonthYearSelector;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;

// Adicionar animação CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);