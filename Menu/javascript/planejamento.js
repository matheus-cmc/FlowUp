// Dados de exemplo
let planejamentos = [
    {
        id: 1,
        titulo: "Campanha Verão 2024",
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
        createdAt: "2024-01-01",
        updatedAt: "2024-01-10"
    }
];

let currentPlanejamentoId = null;
let postCounter = 1;

// Elementos DOM
const planejamentoList = document.getElementById('planejamentoList');
const planejamentoModal = document.getElementById('planejamentoModal');
const detailModal = document.getElementById('detailModal');
const actionsModal = document.getElementById('actionsModal');
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderPlanejamentoList();
    setupEventListeners();
    initializeUserMenu();
    initializeCustomSelects();
});

function setupEventListeners() {
    novoPlanejamentoBtn.addEventListener('click', openNewPlanejamentoModal);
    addPostBtn.addEventListener('click', addPost);
    savePlanejamentoBtn.addEventListener('click', savePlanejamento);
    cancelBtn.addEventListener('click', closeModal);
    closeDetailBtn.addEventListener('click', closeDetailModal);
    editPlanejamentoBtn.addEventListener('click', editCurrentPlanejamento);
    detailActionsBtn.addEventListener('click', openActionsModal);
    confirmDeleteBtn.addEventListener('click', deletePlanejamento);
    cancelDeleteBtn.addEventListener('click', closeConfirmModal);
    
    // Filtros
    document.getElementById('monthFilter').addEventListener('change', renderPlanejamentoList);
    document.getElementById('yearFilter').addEventListener('change', renderPlanejamentoList);
    document.getElementById('searchPlanejamento').addEventListener('input', renderPlanejamentoList);
    
    // Controle do tipo de planejamento
    // Tipo de planejamento – agora o mês SEMPRE aparece
    document.getElementById('planejamentoTipo').addEventListener('change', function() {
    const mesGroup = document.getElementById('mesGroup');
    mesGroup.style.display = 'block';
    document.getElementById('planejamentoMes').required = true;
    });

    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === planejamentoModal) closeModal();
        if (event.target === detailModal) closeDetailModal();
        if (event.target === actionsModal) closeActionsModal();
        if (event.target === confirmModal) closeConfirmModal();
    });
    
    // Fechar modais com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
            closeDetailModal();
            closeActionsModal();
            closeConfirmModal();
        }
    });
}

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
                <div class="empty-icon">📋</div>
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

function openDetailModal(id) {
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) return;

    currentPlanejamentoId = id;
    
    // Calcular estatísticas
    const stats = calcularEstatisticas(planejamento.posts);

    detailModalContent.innerHTML = `
        <div class="detail-header">
            <div class="detail-title-section">
                <h2>${planejamento.titulo}</h2>
                <div class="detail-meta">
                    ${planejamento.tipo === 'especial' ? 'Planejamento Especial' : `${getMesNome(planejamento.mes)} ${planejamento.ano}`}
                    • ${planejamento.posts.length} publicações programadas
                </div>
                <div class="stats-row">
                    <div class="stat-badge" style="background: #d1fae5; color: #059669;">
                        ✅ ${stats.aprovados} aprovados
                    </div>
                    <div class="stat-badge" style="background: #fef3c7; color: #d97706;">
                        🔄 ${stats.emRevisao} em revisão
                    </div>
                    <div class="stat-badge" style="background: #dbeafe; color: #1e40af;">
                        ⏳ ${stats.emProducao} em produção
                    </div>
                    <div class="stat-badge" style="background: #f3f4f6; color: #6b7280;">
                        📝 ${stats.rascunhos} rascunhos
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-content">
            <div class="form-section" style="border: none; margin: 0; padding: 0;">
                <h3>📝 Descrição</h3>
                <p style="color: var(--muted); line-height: 1.6; margin: 0;">${planejamento.descricao || 'Sem descrição'}</p>
            </div>

            <div class="detail-posts">
                <h3>📋 Publicações Programadas (${planejamento.posts.length})</h3>
                ${planejamento.posts.map((post, index) => `
                    <div class="detail-post">
                        <div class="detail-post-header">
                            <h4 class="detail-post-title">${post.titulo}</h4>
                            <div class="detail-post-badges">
                                <span class="post-type-badge">${getTipoNome(post.tipo)}</span>
                                <span class="status-badge ${post.status}">${getStatusNome(post.status)}</span>
                                <span class="post-priority ${post.prioridade}">${post.prioridade}</span>
                            </div>
                        </div>
                        
                        <div class="post-info-grid">
                            <div class="post-info-item">
                                <label>Data</label>
                                <p>${formatDate(post.data)}</p>
                            </div>
                            <div class="post-info-item">
                                <label>Responsável</label>
                                <p>${getResponsavelNome(post.responsavel)}</p>
                            </div>
                            <div class="post-info-item">
                                <label>Descrição</label>
                                <p>${post.descricao}</p>
                            </div>
                            <div class="post-info-item">
                                <label>Destino</label>
                                <p>${getDestinoNome(post.destino)}</p>
                            </div>
                        </div>
                        
                        ${post.legenda ? `
                            <div class="post-info-item">
                                <label>Legenda</label>
                                <p style="font-style: italic; color: var(--muted);">${post.legenda}</p>
                            </div>
                        ` : ''}
                        
                        ${post.inspiracao ? `
                            <div class="post-info-item">
                                <label>Inspirações</label>
                                <p style="word-break: break-all; color: var(--g1);">${post.inspiracao}</p>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    detailModal.style.display = 'flex';
    setTimeout(() => detailModal.classList.add('show'), 10);
}

function closeDetailModal() {
    detailModal.classList.remove('show');
    setTimeout(() => {
        detailModal.style.display = 'none';
    }, 300);
}

// Mês sempre visível, independente do tipo
    const mesGroup = document.getElementById('mesGroup');
    mesGroup.style.display = 'block';
    document.getElementById('planejamentoMes').required = true;


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
    document.getElementById('modalTitle').textContent = 'Novo Planejamento';
    planejamentoForm.reset();
    postsContainer.innerHTML = '';
    
    // Adicionar primeiro post
    addPost();
    
    // Mostrar grupo do mês por padrão
    document.getElementById('mesGroup').style.display = 'block';
    
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
    document.getElementById('modalTitle').textContent = 'Editar Planejamento';
    
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
    } else {
        mesGroup.style.display = 'block';
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
    
    planejamentoModal.style.display = 'flex';
    setTimeout(() => planejamentoModal.classList.add('show'), 10);
}

// Função auxiliar para atualizar selects customizados
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

// Função para atualizar selects dentro de um elemento específico
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
    
    if (!formData.get('mes')) {
    alert('Selecione o mês do planejamento.');
    return;
    }


    const planejamentoData = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        tipo: formData.get('tipo'),
        mes: formData.get('mes'),
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

// Funções de Ações
function openActionsModal(id) {
    currentPlanejamentoId = id;
    const planejamento = planejamentos.find(p => p.id === id);
    if (planejamento) {
        document.getElementById('actionsModalTitle').textContent = `Ações: ${planejamento.titulo}`;
    }
    actionsModal.style.display = 'flex';
    setTimeout(() => actionsModal.classList.add('show'), 10);
}

function closeActionsModal() {
    actionsModal.classList.remove('show');
    setTimeout(() => {
        actionsModal.style.display = 'none';
    }, 300);
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
    doc.setTextColor(109, 40, 217);
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
        doc.setTextColor(109, 40, 217);
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
            
            // Legenda
            if (post.legenda) {
                const legendaLines = doc.splitTextToSize(`Legenda: ${post.legenda}`, 170);
                doc.text(legendaLines, 20, y);
                y += legendaLines.length * 7;
            }
            
            // Inspirações
            if (post.inspiracao) {
                const inspiracaoLines = doc.splitTextToSize(`Inspirações: ${post.inspiracao}`, 170);
                doc.text(inspiracaoLines, 20, y);
                y += inspiracaoLines.length * 7;
            }
            
            y += 10; // Espaço entre publicações
        });
    } else {
        doc.text('Nenhuma publicação programada.', 20, y);
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
    closeActionsModal();
    showNotification('PDF gerado com sucesso!', 'success');
}

function compartilharEmail(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    const assunto = `Planejamento: ${planejamento.titulo}`;
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
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.open(mailtoLink);
    closeActionsModal();
}

function compartilharWhatsApp(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    let mensagem = `*${planejamento.titulo}*\n\n`;
    mensagem += ` *Período:* ${planejamento.tipo === 'especial' ? 'Planejamento Especial' : `${getMesNome(planejamento.mes)} ${planejamento.ano}`}\n`;
    mensagem += ` *Descrição:* ${planejamento.descricao || 'Não informada'}\n\n`;
    mensagem += `*Publicações (${planejamento.posts.length}):*\n\n`;
    
    planejamento.posts.forEach((post, index) => {
        mensagem += `*${index + 1}. ${post.titulo}*\n`;
        mensagem += ` Tipo: ${getTipoNome(post.tipo)}\n`;
        mensagem += ` Status: ${getStatusNome(post.status)}\n`;
        mensagem += `Data: ${formatDate(post.data)}\n`;
        mensagem += `Responsável: ${getResponsavelNome(post.responsavel)}\n\n`;
    });
    
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, '_blank');
    closeActionsModal();
}

function duplicarPlanejamento(planejamentoId) {
    const planejamento = planejamentos.find(p => p.id === planejamentoId);
    if (!planejamento) return;

    const novoPlanejamento = {
        ...JSON.parse(JSON.stringify(planejamento)),
        id: Math.max(...planejamentos.map(p => p.id)) + 1,
        titulo: `${planejamento.titulo} (Cópia)`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
    };
    
    planejamentos.push(novoPlanejamento);
    renderPlanejamentoList();
    closeActionsModal();
    showNotification('Planejamento duplicado com sucesso!', 'success');
}

function confirmDelete(id) {
    currentPlanejamentoId = id;
    confirmModal.style.display = 'flex';
    setTimeout(() => confirmModal.classList.add('show'), 10);
}

function deletePlanejamento() {
    planejamentos = planejamentos.filter(p => p.id !== currentPlanejamentoId);
    renderPlanejamentoList();
    closeConfirmModal();
    closeDetailModal();
    showNotification('Planejamento excluído com sucesso!', 'success');
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

