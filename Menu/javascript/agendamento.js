// FlowUp - Agendamento de Postagem (JavaScript Completo e Melhorado)

class PostScheduler {
    constructor() {
        this.scheduledPosts = JSON.parse(localStorage.getItem('flowup-scheduled-posts')) || [];
        this.currentEditId = null;
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.selectedQuickOption = null;
        this.currentTheme = localStorage.getItem('flowup-theme') || 'auto';
        this.searchTimeout = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.init();
    }

    initializeElements() {
        // Elementos do formulário
        this.postForm = document.getElementById('postForm');
        this.saveDraftBtn = document.getElementById('saveDraftBtn');
        this.postTitle = document.getElementById('postTitle');
        this.postContent = document.getElementById('postContent');
        this.postDate = document.getElementById('postDate');
        this.postTime = document.getElementById('postTime');
        this.postMedia = document.getElementById('postMedia');
        this.uploadArea = document.getElementById('uploadArea');
        this.mediaPreview = document.getElementById('mediaPreview');
        this.charCount = document.getElementById('charCount');
        
        // Elementos de preview
        this.previewText = document.getElementById('previewText');
        this.previewDateTime = document.getElementById('previewDateTime');
        this.previewMedia = document.getElementById('previewMedia');
        this.previewPlatforms = document.getElementById('previewPlatforms');
        
        // Elementos da lista
        this.postsList = document.getElementById('postsList');
        this.searchPosts = document.getElementById('searchPosts');
        this.sortPosts = document.getElementById('sortPosts');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.prevPage = document.getElementById('prevPage');
        this.nextPage = document.getElementById('nextPage');
        this.pageInfo = document.getElementById('pageInfo');
        
        // Elementos de estatísticas
        this.totalPosts = document.getElementById('totalPosts');
        this.todayPosts = document.getElementById('todayPosts');
        this.publishedPosts = document.getElementById('publishedPosts');
        
        // Modais
        this.quickScheduleModal = document.getElementById('quickScheduleModal');
        this.confirmationModal = document.getElementById('confirmationModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.quickModalClose = document.getElementById('quickModalClose');
        this.cancelQuickBtn = document.getElementById('cancelQuickBtn');
        this.confirmQuickBtn = document.getElementById('confirmQuickBtn');
        this.confirmationClose = document.getElementById('confirmationClose');
        this.cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
        this.confirmActionBtn = document.getElementById('confirmActionBtn');
        this.settingsModalClose = document.getElementById('settingsModalClose');
        this.cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        
        // Botões de ação
        this.quickScheduleBtn = document.getElementById('quickScheduleBtn');
        this.refreshPreview = document.getElementById('refreshPreview');
        this.filterBtn = document.getElementById('filterBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.settingsMenuBtn = document.getElementById('settings-menu-btn');
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        
        // Abas
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Ferramentas do editor
        this.toolBtns = document.querySelectorAll('.tool-btn');
        
        // Tema
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        // Configurações
        this.densityOptions = document.querySelectorAll('.density-option');
        this.notificationToggles = document.querySelectorAll('.settings-toggle input');
        
        // Templates
        this.templateButtons = document.querySelectorAll('[data-template]');
        
        // Importação
        this.importCsvBtn = document.getElementById('importCsvBtn');
        this.importJsonBtn = document.getElementById('importJsonBtn');
        
        // Notificações
        this.notificationContainer = document.getElementById('notificationContainer');
        
        // Menu do usuário
        this.userMenuTrigger = document.getElementById('user-menu-trigger');
        this.userMenu = document.getElementById('user-menu');
        
        // Upload button
        this.uploadBtn = document.querySelector('.upload-btn');
        
        // Seleção de empresa
        this.customSelects = document.querySelectorAll('.custom-select');
    }

    init() {
        // Configurar data mínima para hoje
        const today = new Date().toISOString().split('T')[0];
        this.postDate.min = today;
        
        // Configurar hora padrão
        this.setDefaultTime();
        
        // Aplicar tema salvo
        this.applyTheme(this.currentTheme);
        
        // Atualizar preview inicial
        this.updatePreview();
        
        // Carregar postagens
        this.renderScheduledPosts();
        
        // Atualizar estatísticas
        this.updateStats();
        
        // Configurar opções rápidas
        this.setupQuickOptions();
        
        // Configurar templates
        this.setupTemplates();
        
        // Carregar configurações salvas
        this.loadSettings();
        
        // Verificar postagens agendadas periodicamente
        this.startScheduleChecker();
    }

    setupEventListeners() {
        // Atualizar preview em tempo real
        this.postTitle.addEventListener('input', () => this.updatePreview());
        this.postContent.addEventListener('input', () => {
            this.updateCharCount();
            this.updatePreview();
        });
        this.postDate.addEventListener('change', () => this.updatePreview());
        this.postTime.addEventListener('change', () => this.updatePreview());
        
        // Plataformas selecionadas
        document.querySelectorAll('input[name="platform"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updatePreview());
        });
        
        // Upload de mídia com drag & drop
        this.setupMediaUpload();
        
        // Formulário
        this.postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        this.saveDraftBtn.addEventListener('click', () => this.handleSaveDraft());
        
        // Busca e filtros
        this.searchPosts.addEventListener('input', () => this.handleSearch());
        this.sortPosts.addEventListener('change', () => {
            this.currentSort = this.sortPosts.value;
            this.currentPage = 1;
            this.renderScheduledPosts();
        });
        
        // Filtros por aba
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleFilterTabClick(tab));
        });
        
        // Paginação
        this.prevPage.addEventListener('click', () => this.changePage(-1));
        this.nextPage.addEventListener('click', () => this.changePage(1));
        
        // Botões de ação
        this.quickScheduleBtn.addEventListener('click', () => this.openQuickScheduleModal());
        this.refreshPreview.addEventListener('click', () => this.refreshPreviewAction());
        this.filterBtn.addEventListener('click', () => this.showAdvancedFilters());
        this.exportBtn.addEventListener('click', () => this.exportPosts());
        this.settingsMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openSettingsModal();
        });
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        
        // Modais
        this.quickModalClose.addEventListener('click', () => this.closeQuickScheduleModal());
        this.cancelQuickBtn.addEventListener('click', () => this.closeQuickScheduleModal());
        this.confirmQuickBtn.addEventListener('click', () => this.confirmQuickSchedule());
        this.confirmationClose.addEventListener('click', () => this.closeConfirmationModal());
        this.cancelConfirmBtn.addEventListener('click', () => this.closeConfirmationModal());
        this.settingsModalClose.addEventListener('click', () => this.closeSettingsModal());
        this.cancelSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        // Abas do formulário
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn));
        });
        
        // Ferramentas do editor
        this.toolBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleToolClick(btn));
        });
        
        // Tema
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => this.selectTheme(option));
        });
        
        // Configurações
        this.densityOptions.forEach(option => {
            option.addEventListener('click', () => this.selectDensity(option));
        });
        
        // Templates
        this.templateButtons.forEach(btn => {
            btn.addEventListener('click', () => this.useTemplate(btn));
        });
        
        // Importação
        this.importCsvBtn.addEventListener('click', () => this.importFromCsv());
        this.importJsonBtn.addEventListener('click', () => this.importFromJson());
        
        // Menu do usuário
        if (this.userMenuTrigger && this.userMenu) {
            this.userMenuTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.userMenu.classList.toggle('show');
            });
            
            document.addEventListener('click', () => {
                this.userMenu.classList.remove('show');
            });
            
            this.userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // Logout
            this.userMenu.querySelector('.logout').addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Upload button
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.postMedia.click();
            });
        }
        
        // Seleção de empresa
        this.setupCompanySelector();
        
        // Fechar modais ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === this.quickScheduleModal) this.closeQuickScheduleModal();
            if (e.target === this.confirmationModal) this.closeConfirmationModal();
            if (e.target === this.settingsModal) this.closeSettingsModal();
        });
        
        // Atualizar estatísticas periodicamente
        setInterval(() => this.updateStats(), 30000);
    }

    setupCompanySelector() {
        this.customSelects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            const arrow = select.querySelector('.select-arrow');
            
            if (selected && items) {
                selected.addEventListener('click', (e) => {
                    e.stopPropagation();
                    items.classList.toggle('select-show');
                    if (arrow) {
                        arrow.style.transform = items.classList.contains('select-show') ? 'rotate(180deg)' : 'rotate(0)';
                    }
                });
                
                // Fechar ao clicar fora
                document.addEventListener('click', () => {
                    items.classList.remove('select-show');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0)';
                    }
                });
                
                // Selecionar opção
                const options = items.querySelectorAll('.select-option');
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        if (option.dataset.value === 'new') {
                            this.showNotification('Funcionalidade de nova empresa em desenvolvimento', 'info');
                        } else {
                            selected.querySelector('span').textContent = option.querySelector('span').textContent;
                            items.classList.remove('select-show');
                            if (arrow) {
                                arrow.style.transform = 'rotate(0)';
                            }
                            this.showNotification(`Empresa alterada para ${option.querySelector('span').textContent}`, 'success');
                        }
                    });
                });
            }
        });
    }

    setDefaultTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30 - (now.getMinutes() % 30)); // Arredonda para próximo múltiplo de 30
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        this.postTime.value = timeString;
    }

    setupMediaUpload() {
        // Click no área de upload
        this.uploadArea.addEventListener('click', () => this.postMedia.click());
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            this.handleMediaFiles(files);
        });
        
        // Change do input file
        this.postMedia.addEventListener('change', (e) => {
            this.handleMediaFiles(e.target.files);
        });
    }

    handleMediaFiles(files) {
        if (!files.length) return;
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                this.showNotification('Tipo de arquivo não suportado', 'error');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) { // 10MB
                this.showNotification('Arquivo muito grande (máx. 10MB)', 'error');
                return;
            }
            
            this.previewMediaFile(file);
        });
    }

    previewMediaFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaUrl = e.target.result;
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            
            if (file.type.startsWith('image/')) {
                mediaItem.innerHTML = `
                    <img src="${mediaUrl}" alt="Preview">
                    <button type="button" class="media-remove">&times;</button>
                `;
            } else {
                mediaItem.innerHTML = `
                    <video src="${mediaUrl}" controls></video>
                    <button type="button" class="media-remove">&times;</button>
                `;
            }
            
            mediaItem.querySelector('.media-remove').addEventListener('click', () => {
                mediaItem.remove();
                this.updateMediaPreview();
            });
            
            this.mediaPreview.appendChild(mediaItem);
            this.updateMediaPreview();
        };
        
        reader.readAsDataURL(file);
    }

    updateMediaPreview() {
        const mediaItems = this.mediaPreview.querySelectorAll('.media-item');
        
        if (mediaItems.length > 0) {
            this.uploadArea.style.display = 'none';
        } else {
            this.uploadArea.style.display = 'flex';
        }
        
        // Atualizar preview principal
        this.updatePreview();
    }

    updateCharCount() {
        const count = this.postContent.value.length;
        this.charCount.textContent = count;
        
        this.charCount.classList.remove('warning', 'error');
        if (count > 250) this.charCount.classList.add('warning');
        if (count > 280) this.charCount.classList.add('error');
    }

    updatePreview() {
        // Atualizar texto
        const title = this.postTitle.value || 'Título da postagem';
        const content = this.postContent.value || 'Seu texto aparecerá aqui...';
        this.previewText.textContent = content;
        
        // Atualizar data e hora
        const date = this.postDate.value;
        const time = this.postTime.value;
        if (date && time) {
            const dateObj = new Date(`${date}T${time}`);
            this.previewDateTime.textContent = this.formatDateTime(dateObj);
        } else {
            this.previewDateTime.textContent = '--/--/---- --:--';
        }
        
        // Atualizar plataformas
        this.updatePreviewPlatforms();
        
        // Atualizar mídia
        this.updatePreviewMedia();
    }

    refreshPreviewAction() {
        // Limpar todo o formulário e preview
        this.resetForm();
        this.showNotification('Formulário limpo e prévia atualizada!', 'success');
    }

    updatePreviewPlatforms() {
        this.previewPlatforms.innerHTML = '';
        const selectedPlatforms = document.querySelectorAll('input[name="platform"]:checked');
        
        selectedPlatforms.forEach(platform => {
            const platformValue = platform.value;
            const platformName = platform.parentElement.querySelector('.platform-name').textContent;
            
            const badge = document.createElement('div');
            badge.className = 'platform-badge';
            badge.innerHTML = `
                <div class="platform-icon ${platformValue}"></div>
                <span>${platformName}</span>
            `;
            
            this.previewPlatforms.appendChild(badge);
        });
        
        if (selectedPlatforms.length === 0) {
            this.previewPlatforms.innerHTML = '<div class="platform-badge">Nenhuma plataforma selecionada</div>';
        }
    }

    updatePreviewMedia() {
        const mediaItems = this.mediaPreview.querySelectorAll('.media-item');
        this.previewMedia.innerHTML = '';
        
        if (mediaItems.length === 0) {
            this.previewMedia.innerHTML = `
                <div class="media-placeholder">
                    <div class="placeholder-icon"></div>
                    <span>Nenhuma mídia selecionada</span>
                </div>
            `;
            return;
        }
        
        if (mediaItems.length === 1) {
            // Mostrar única mídia em tamanho maior
            const mediaItem = mediaItems[0].cloneNode(true);
            mediaItem.querySelector('.media-remove').remove();
            if (mediaItem.querySelector('video')) {
                mediaItem.querySelector('video').setAttribute('controls', 'true');
            }
            this.previewMedia.appendChild(mediaItem);
        } else {
            // Mostrar carrossel para múltiplas mídias
            const carousel = document.createElement('div');
            carousel.className = 'media-carousel';
            
            mediaItems.forEach(item => {
                const mediaClone = item.cloneNode(true);
                mediaClone.querySelector('.media-remove').remove();
                if (mediaClone.querySelector('video')) {
                    mediaClone.querySelector('video').setAttribute('controls', 'true');
                }
                carousel.appendChild(mediaClone);
            });
            
            this.previewMedia.appendChild(carousel);
        }
    }

    handleToolClick(btn) {
        const tool = btn.dataset.tool;
        const textarea = this.postContent;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let newText = '';
        
        switch (tool) {
            case 'bold':
                newText = `**${selectedText}**`;
                break;
            case 'italic':
                newText = `_${selectedText}_`;
                break;
            case 'link':
                const url = prompt('Digite a URL:');
                if (url) newText = `[${selectedText}](${url})`;
                else return;
                break;
            case 'emoji':
                // Simulando seleção de emoji
                newText = `${selectedText}😊`;
                break;
        }
        
        textarea.setRangeText(newText, start, end, 'select');
        textarea.dispatchEvent(new Event('input'));
        textarea.focus();
    }

    switchTab(btn) {
        const tabId = btn.dataset.tab;
        
        // Atualizar abas ativas
        this.tabBtns.forEach(t => t.classList.remove('active'));
        this.tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabId}Tab`).classList.add('active');
    }

    handleFilterTabClick(tab) {
        this.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        this.currentFilter = tab.dataset.filter;
        this.currentPage = 1;
        this.renderScheduledPosts();
    }

    handleSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.renderScheduledPosts();
        }, 300);
    }

    changePage(direction) {
        this.currentPage += direction;
        this.renderScheduledPosts();
    }

    collectFormData() {
        const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platform"]:checked'))
            .map(checkbox => checkbox.value);
        
        const mediaFiles = [];
        this.mediaPreview.querySelectorAll('.media-item').forEach(item => {
            const img = item.querySelector('img');
            const video = item.querySelector('video');
            if (img) mediaFiles.push(img.src);
            if (video) mediaFiles.push(video.src);
        });
        
        return {
            title: this.postTitle.value,
            content: this.postContent.value,
            type: document.getElementById('postType')?.value || 'image',
            project: document.getElementById('postProject')?.value || '',
            date: this.postDate.value,
            time: this.postTime.value,
            platforms: selectedPlatforms,
            media: mediaFiles,
            status: 'scheduled'
        };
    }

    validatePostData(postData) {
        if (!postData.title.trim()) {
            this.showNotification('Por favor, adicione um título para a postagem', 'error');
            this.postTitle.focus();
            return false;
        }
        
        if (!postData.content.trim()) {
            this.showNotification('Por favor, adicione conteúdo para a postagem', 'error');
            this.postContent.focus();
            return false;
        }
        
        if (!postData.date) {
            this.showNotification('Por favor, selecione uma data para agendamento', 'error');
            this.postDate.focus();
            return false;
        }
        
        if (!postData.time) {
            this.showNotification('Por favor, selecione um horário para agendamento', 'error');
            this.postTime.focus();
            return false;
        }
        
        if (postData.platforms.length === 0) {
            this.showNotification('Por favor, selecione pelo menos uma plataforma', 'error');
            return false;
        }
        
        // Verificar se a data/hora é futura
        const scheduledDateTime = new Date(`${postData.date}T${postData.time}`);
        if (scheduledDateTime <= new Date()) {
            this.showNotification('A data e hora de agendamento devem ser futuras', 'error');
            return false;
        }
        
        return true;
    }

    async handlePostSubmit(event) {
        event.preventDefault();
        
        const postData = this.collectFormData();
        
        if (!this.validatePostData(postData)) return;
        
        // Adicionar metadados
        postData.id = Date.now().toString();
        postData.createdAt = new Date().toISOString();
        postData.status = 'scheduled';
        
        try {
            // Simular processamento
            await this.simulateProcessing();
            
            // Adicionar à lista
            this.scheduledPosts.unshift(postData);
            this.saveToStorage();
            
            // Atualizar UI
            this.renderScheduledPosts();
            this.updateStats();
            
            // Resetar formulário
            this.resetForm();
            
            // Mostrar feedback
            this.showNotification('Postagem agendada com sucesso!', 'success');
            
        } catch (error) {
            this.showNotification('Erro ao agendar postagem', 'error');
        }
    }

    async handleSaveDraft() {
        const postData = this.collectFormData();
        
        if (!postData.title && !postData.content) {
            this.showNotification('Adicione conteúdo para salvar como rascunho', 'warning');
            return;
        }
        
        // Adicionar metadados
        postData.id = Date.now().toString();
        postData.createdAt = new Date().toISOString();
        postData.status = 'draft';
        
        try {
            await this.simulateProcessing();
            
            this.scheduledPosts.unshift(postData);
            this.saveToStorage();
            this.renderScheduledPosts();
            this.updateStats();
            this.resetForm();
            
            this.showNotification('Rascunho salvo com sucesso!', 'success');
            
        } catch (error) {
            this.showNotification('Erro ao salvar rascunho', 'error');
        }
    }

    simulateProcessing() {
        return new Promise(resolve => {
            // Simular delay de processamento
            setTimeout(resolve, 1000);
        });
    }

    resetForm() {
        this.postForm.reset();
        this.setDefaultTime();
        this.mediaPreview.innerHTML = '';
        this.uploadArea.style.display = 'flex';
        this.updatePreview();
        this.updateCharCount();
        
        // Voltar para a aba manual
        this.switchTab(document.querySelector('[data-tab="manual"]'));
    }

    renderScheduledPosts() {
        let filteredPosts = this.filterPosts();
        filteredPosts = this.sortPosts(filteredPosts);
        
        const totalPages = Math.ceil(filteredPosts.length / this.postsPerPage);
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + this.postsPerPage);
        
        this.postsList.innerHTML = '';
        
        if (paginatedPosts.length === 0) {
            this.showEmptyState();
        } else {
            paginatedPosts.forEach(post => {
                const postElement = this.createPostElement(post);
                this.postsList.appendChild(postElement);
            });
        }
        
        this.updatePagination(totalPages);
    }

    filterPosts() {
        let filtered = this.scheduledPosts;
        
        // Aplicar filtro de status
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(post => post.status === this.currentFilter);
        }
        
        // Aplicar busca
        const searchTerm = this.searchPosts.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    sortPosts(posts) {
        return posts.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-asc':
                    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
                case 'date-desc':
                    return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    }

    createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        
        const scheduledDateTime = new Date(`${post.date}T${post.time}`);
        const isPast = scheduledDateTime < new Date();
        const status = isPast ? 'published' : post.status;
        
        postElement.innerHTML = `
            <div class="post-media">
                ${post.media && post.media.length > 0 ? 
                    `<img src="${post.media[0]}" alt="${post.title}">` : 
                    `<div class="post-media-icon"></div>`
                }
            </div>
            <div class="post-details">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">
                    <span>${this.formatDateTime(scheduledDateTime)}</span>
                    <span>${post.project || 'Sem projeto'}</span>
                    <span class="status-badge status-${status}">
                        ${this.getStatusText(status)}
                    </span>
                </div>
                <div class="post-platforms">
                    ${post.platforms.map(platform => `
                        <div class="platform-badge">
                            <div class="platform-icon ${platform}"></div>
                            <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="post-actions">
                <button class="action-btn edit-post" data-id="${post.id}" title="Editar">
                    <div class="action-icon i-edit"></div>
                </button>
                <button class="action-btn delete-post" data-id="${post.id}" title="Excluir">
                    <div class="action-icon i-delete"></div>
                </button>
            </div>
        `;
        
        // Event listeners
        postElement.querySelector('.edit-post').addEventListener('click', () => this.editPost(post.id));
        postElement.querySelector('.delete-post').addEventListener('click', () => this.deletePost(post.id));
        
        return postElement;
    }

    showEmptyState() {
        this.postsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"></div>
                <h4>Nenhuma postagem encontrada</h4>
                <p>${this.getEmptyStateMessage()}</p>
            </div>
        `;
    }

    getEmptyStateMessage() {
        switch (this.currentFilter) {
            case 'scheduled': return 'Não há postagens agendadas';
            case 'published': return 'Não há postagens publicadas';
            case 'draft': return 'Não há rascunhos salvos';
            default: return 'Crie sua primeira postagem agendada';
        }
    }

    updatePagination(totalPages) {
        this.prevPage.disabled = this.currentPage === 1;
        this.nextPage.disabled = this.currentPage === totalPages || totalPages === 0;
        this.pageInfo.textContent = `Página ${this.currentPage} de ${totalPages || 1}`;
    }

    updateStats() {
        const total = this.scheduledPosts.length;
        const today = this.scheduledPosts.filter(post => {
            const postDate = new Date(`${post.date}T${post.time}`);
            const today = new Date();
            return postDate.toDateString() === today.toDateString();
        }).length;
        
        const published = this.scheduledPosts.filter(post => {
            const postDate = new Date(`${post.date}T${post.time}`);
            return postDate < new Date();
        }).length;
        
        this.totalPosts.textContent = total;
        this.todayPosts.textContent = today;
        this.publishedPosts.textContent = published;
    }

    // ===== AGENDAMENTO RÁPIDO =====
    setupQuickOptions() {
        const now = new Date();
        
        // 1 hora
        const time1h = new Date(now.getTime() + 60 * 60 * 1000);
        document.getElementById('time1h').textContent = this.formatTime(time1h);
        
        // 4 horas
        const time4h = new Date(now.getTime() + 4 * 60 * 60 * 1000);
        document.getElementById('time4h').textContent = this.formatTime(time4h);
        
        // Amanhã
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        document.getElementById('timeTomorrow').textContent = this.formatDate(tomorrow) + ' ' + this.formatTime(tomorrow);
        
        // Próxima semana
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.getElementById('timeNextWeek').textContent = this.formatDate(nextWeek) + ' ' + this.formatTime(nextWeek);
        
        // Event listeners para opções rápidas
        document.querySelectorAll('.quick-option').forEach(option => {
            option.addEventListener('click', () => this.selectQuickOption(option));
        });
    }

    selectQuickOption(option) {
        document.querySelectorAll('.quick-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        this.selectedQuickOption = option.dataset.hours;
    }

    openQuickScheduleModal() {
        this.quickScheduleModal.classList.add('show');
    }

    closeQuickScheduleModal() {
        this.quickScheduleModal.classList.remove('show');
        this.selectedQuickOption = null;
        document.querySelectorAll('.quick-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }

    confirmQuickSchedule() {
        if (!this.selectedQuickOption) {
            this.showNotification('Selecione uma opção de agendamento', 'warning');
            return;
        }
        
        const hours = parseInt(this.selectedQuickOption);
        const scheduledTime = new Date(Date.now() + hours * 60 * 60 * 1000);
        
        this.postDate.value = this.formatDate(scheduledTime, true);
        this.postTime.value = this.formatTime(scheduledTime, true);
        
        this.closeQuickScheduleModal();
        this.updatePreview();
        
        this.showNotification('Horário definido com sucesso!', 'success');
    }

    // ===== TEMA CLARO/ESCURO =====
    applyTheme(theme) {
        // Se for automático, detectar preferência do sistema
        if (theme === 'auto') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('flowup-theme', theme);
        
        // Atualizar opções ativas
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
        
        // Atualizar ícone do botão de tema
        this.updateThemeButtonIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
    }

    selectTheme(option) {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
        this.showNotification(`Tema ${theme === 'auto' ? 'automático' : theme === 'dark' ? 'escuro' : 'claro'} selecionado`, 'success');
    }

    updateThemeButtonIcon() {
        const themeIcon = this.themeToggleBtn.querySelector('.theme-icon');
        if (this.currentTheme === 'dark') {
            themeIcon.style.webkitMask = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'/></svg>\") no-repeat center/20px 20px";
            themeIcon.style.mask = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'/></svg>\") no-repeat center/20px 20px";
        } else {
            themeIcon.style.webkitMask = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='5'/><path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'/></svg>\") no-repeat center/20px 20px";
            themeIcon.style.mask = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='5'/><path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'/></svg>\") no-repeat center/20px 20px";
        }
    }

    // ===== CONFIGURAÇÕES =====
    openSettingsModal() {
        this.settingsModal.classList.add('show');
    }

    closeSettingsModal() {
        this.settingsModal.classList.remove('show');
    }

    selectDensity(option) {
        this.densityOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    }

    loadSettings() {
        // Carregar configurações do localStorage
        const settings = JSON.parse(localStorage.getItem('flowup-settings')) || {};
        
        // Aplicar densidade
        if (settings.density) {
            const densityOption = document.querySelector(`[data-density="${settings.density}"]`);
            if (densityOption) this.selectDensity(densityOption);
        }
        
        // Aplicar notificações
        this.notificationToggles.forEach(toggle => {
            const settingName = toggle.id;
            if (settings[settingName] !== undefined) {
                toggle.checked = settings[settingName];
            }
        });
    }

    saveSettings() {
        const settings = {
            density: document.querySelector('.density-option.active')?.dataset.density || 'normal'
        };
        
        // Salvar estado das notificações
        this.notificationToggles.forEach(toggle => {
            settings[toggle.id] = toggle.checked;
        });
        
        localStorage.setItem('flowup-settings', JSON.stringify(settings));
        this.closeSettingsModal();
        this.showNotification('Configurações salvas com sucesso!', 'success');
    }

    // ===== TEMPLATES =====
    setupTemplates() {
        this.templateButtons.forEach(btn => {
            btn.addEventListener('click', () => this.useTemplate(btn));
        });
    }

    useTemplate(btn) {
        const template = btn.dataset.template;
        
        const templates = {
            promo: {
                title: 'Promoção Especial 🎉',
                content: '🔥 OFERTA ESPECIAL! 🔥\n\nNão perca essa oportunidade única! \n\n👉 Clique no link da bio para aproveitar!\n\n#Promoção #Oferta #Especial'
            },
            news: {
                title: 'Novidade Importante 📢',
                content: '📰 ATENÇÃO! 📰\n\nTemos uma novidade incrível para compartilhar com vocês!\n\nFiquem ligados para mais informações em breve!\n\n#Novidade #Anúncio #Importante'
            },
            engagement: {
                title: 'Pergunta do Dia ❓',
                content: '🤔 PERGUNTA DO DIA! 🤔\n\nCompartilhe nos comentários:\n\nQual é o seu [assunto] favorito e por quê?\n\nVamos interagir! 👇\n\n#Engajamento #Pergunta #Interação'
            }
        };
        
        if (templates[template]) {
            this.postTitle.value = templates[template].title;
            this.postContent.value = templates[template].content;
            this.updatePreview();
            this.updateCharCount();
            this.showNotification('Template aplicado com sucesso!', 'success');
        }
    }

    // ===== IMPORT/EXPORT =====
    importFromCsv() {
        this.showNotification('Funcionalidade de importação CSV em desenvolvimento', 'info');
    }

    importFromJson() {
        this.showNotification('Funcionalidade de importação JSON em desenvolvimento', 'info');
    }

    exportPosts() {
        if (this.scheduledPosts.length === 0) {
            this.showNotification('Não há postagens para exportar', 'warning');
            return;
        }
        
        const dataStr = JSON.stringify(this.scheduledPosts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `postagens-flowup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Postagens exportadas com sucesso!', 'success');
    }

    // ===== EDIÇÃO/EXCLUSÃO =====
    editPost(postId) {
        const post = this.scheduledPosts.find(p => p.id === postId);
        if (!post) return;
        
        // Preencher formulário com dados da postagem
        this.postTitle.value = post.title;
        this.postContent.value = post.content;
        this.postDate.value = post.date;
        this.postTime.value = post.time;
        
        if (post.project) {
            document.getElementById('postProject').value = post.project;
        }
        
        // Selecionar plataformas
        document.querySelectorAll('input[name="platform"]').forEach(checkbox => {
            checkbox.checked = post.platforms.includes(checkbox.value);
        });
        
        // Limpar e preencher mídia
        this.mediaPreview.innerHTML = '';
        if (post.media && post.media.length > 0) {
            post.media.forEach(mediaUrl => {
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-item';
                
                if (mediaUrl.includes('data:image')) {
                    mediaItem.innerHTML = `
                        <img src="${mediaUrl}" alt="Preview">
                        <button type="button" class="media-remove">&times;</button>
                    `;
                } else {
                    mediaItem.innerHTML = `
                        <video src="${mediaUrl}" controls></video>
                        <button type="button" class="media-remove">&times;</button>
                    `;
                }
                
                mediaItem.querySelector('.media-remove').addEventListener('click', () => {
                    mediaItem.remove();
                    this.updateMediaPreview();
                });
                this.mediaPreview.appendChild(mediaItem);
            });
            this.updateMediaPreview();
        }
        
        // Remover postagem original
        this.scheduledPosts = this.scheduledPosts.filter(p => p.id !== postId);
        this.saveToStorage();
        this.renderScheduledPosts();
        this.updateStats();
        
        this.showNotification('Postagem carregada para edição', 'success');
    }

    deletePost(postId) {
        this.showConfirmationModal(
            'Excluir Postagem',
            'Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.',
            () => {
                this.scheduledPosts = this.scheduledPosts.filter(p => p.id !== postId);
                this.saveToStorage();
                this.renderScheduledPosts();
                this.updateStats();
                this.showNotification('Postagem excluída com sucesso', 'success');
            }
        );
    }

    // ===== SISTEMA DE AGENDAMENTO =====
    startScheduleChecker() {
        // Verificar a cada minuto se há postagens para publicar
        setInterval(() => {
            this.checkScheduledPosts();
        }, 60000);
        
        // Verificar imediatamente ao carregar
        this.checkScheduledPosts();
    }

    checkScheduledPosts() {
        const now = new Date();
        let hasChanges = false;
        
        this.scheduledPosts.forEach(post => {
            if (post.status === 'scheduled') {
                const postTime = new Date(`${post.date}T${post.time}`);
                if (postTime <= now) {
                    post.status = 'published';
                    hasChanges = true;
                    
                    // Simular publicação
                    this.simulatePostPublication(post);
                }
            }
        });
        
        if (hasChanges) {
            this.saveToStorage();
            this.renderScheduledPosts();
            this.updateStats();
        }
    }

    simulatePostPublication(post) {
        console.log(`📤 Publicando: ${post.title}`);
        // Aqui iria a integração real com as APIs das redes sociais
    }

    // ===== LOGOUT =====
    handleLogout() {
        this.showConfirmationModal(
            'Sair do Sistema',
            'Tem certeza que deseja sair do FlowUp?',
            () => {
                this.showNotification('Logout realizado com sucesso!', 'success');
                setTimeout(() => {
                    // Simulando redirecionamento para página de login
                    alert('Redirecionando para página de login...');
                    // window.location.href = '/login';
                }, 1000);
            }
        );
    }

    // ===== FUNÇÕES AUXILIARES =====
    formatDateTime(date) {
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(date, inputFormat = false) {
        if (inputFormat) {
            return date.toISOString().split('T')[0];
        }
        return date.toLocaleDateString('pt-BR');
    }

    formatTime(date, inputFormat = false) {
        if (inputFormat) {
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    getStatusText(status) {
        const statusMap = {
            'scheduled': 'Agendado',
            'published': 'Publicado',
            'draft': 'Rascunho',
            'failed': 'Falhou'
        };
        return statusMap[status] || status;
    }

    showNotification(message, type = 'info') {
        const notificationId = 'notification-' + Date.now();
        
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || 'ℹ'}</div>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        this.notificationContainer.appendChild(notification);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            const notif = document.getElementById(notificationId);
            if (notif) {
                notif.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notif.remove(), 300);
            }
        }, 5000);
    }

    showConfirmationModal(title, message, confirmCallback) {
        document.getElementById('confirmationTitle').textContent = title;
        document.getElementById('confirmationMessage').textContent = message;
        this.confirmationModal.classList.add('show');
        
        this.confirmActionBtn.onclick = () => {
            confirmCallback();
            this.closeConfirmationModal();
        };
    }

    closeConfirmationModal() {
        this.confirmationModal.classList.remove('show');
    }

    saveToStorage() {
        localStorage.setItem('flowup-scheduled-posts', JSON.stringify(this.scheduledPosts));
    }

    showAdvancedFilters() {
        this.showNotification('Filtros avançados em desenvolvimento', 'info');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados de exemplo se necessário
    loadSampleData();
    
    // Inicializar o agendador
    const scheduler = new PostScheduler();
    
    console.log('🚀 FlowUp - Agendamento de Postagem inicializado com sucesso!');
});

// ===== DADOS DE EXEMPLO =====
function loadSampleData() {
    const samplePosts = [
        {
            id: '1',
            title: 'Lançamento Novo Produto',
            content: '🎉 ESTAMOS LANÇANDO! 🎉\n\nApresentamos nosso mais novo produto que vai revolucionar o mercado!\n\n👉 Confira todos os detalhes no link da bio!\n\n#Lançamento #Novidade #Produto',
            type: 'image',
            project: 'lancamento',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:00',
            platforms: ['instagram', 'facebook', 'linkedin'],
            media: [],
            status: 'scheduled',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Promoção de Verão',
            content: '☀️ PROMOÇÃO DE VERÃO! ☀️\n\nAproveite nossos descontos especiais para a estação mais quente do ano!\n\n🔥 Até 50% de desconto!\n\n#Verão #Promoção #Desconto',
            type: 'image',
            project: 'campanha-verao',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:30',
            platforms: ['instagram', 'facebook'],
            media: [],
            status: 'scheduled',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Rascunho - Campanha Brand Awareness',
            content: 'Conteúdo em desenvolvimento para campanha de brand awareness...',
            type: 'image',
            project: 'brand-awareness',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '09:00',
            platforms: ['instagram', 'twitter'],
            media: [],
            status: 'draft',
            createdAt: new Date().toISOString()
        }
    ];
    
    const currentPosts = JSON.parse(localStorage.getItem('flowup-scheduled-posts')) || [];
    if (currentPosts.length === 0) {
        localStorage.setItem('flowup-scheduled-posts', JSON.stringify(samplePosts));
    }
}