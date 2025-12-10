// Configurações do Sistema
class ConfiguracoesFlowUp {
    constructor() {
        this.currentEmail = 'alone.souza@flowup.com';
        this.init();
        this.carregarConfiguracoes();
    }

    init() {
        this.configurarNavegacao();
        this.configurarMenuUsuario();
        this.configurarSelecaoEmpresa();
        this.configurarUploadAvatar();
        this.configurarCamposEditaveis();
        this.configurarForcaSenha();
        this.configurarModalExclusao();
        this.configurarNotificacoes();
        this.configurarPermissoes();
        this.configurarIntegracoes();
        this.configurarPreferencias();
        this.configurarConta();
        this.configurarExtras();
        this.configurarToggleTema();
    }

    // 🌙 Toggle de Tema
    configurarToggleTema() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.alternarTema();
            });
        }

        // Botão de tema no perfil
        const themeOptions = document.querySelectorAll('input[name="tema"]');
        themeOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.aplicarTema(e.target.value);
                this.salvarPreferenciasTema();
            });
        });
    }

    alternarTema() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.aplicarTema(newTheme);
        this.salvarPreferenciasTema();
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.mostrarNotificacao(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
    }

    aplicarTema(tema) {
        if (tema === 'escuro' || tema === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (tema === 'claro' || tema === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            // Tema automático
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
        
        // Atualizar radio buttons
        const themeRadios = document.querySelectorAll('input[name="tema"]');
        themeRadios.forEach(radio => {
            if ((tema === 'escuro' || tema === 'dark') && radio.value === 'escuro') {
                radio.checked = true;
            } else if ((tema === 'claro' || tema === 'light') && radio.value === 'claro') {
                radio.checked = true;
            } else if (tema === 'auto' && radio.value === 'auto') {
                radio.checked = true;
            }
        });
    }

    salvarPreferenciasTema() {
        const tema = document.documentElement.getAttribute('data-theme');
        localStorage.setItem('flowup-tema', tema);
    }

    // ✉️ Sistema de Alteração de Email
    atualizarEmail(novoEmail) {
        // Validar email
        if (!this.validarEmail(novoEmail)) {
            this.mostrarNotificacao('Por favor, insira um email válido', 'error');
            return false;
        }

        // Simular atualização no servidor
        this.mostrarNotificacao('Atualizando email...', 'info');
        
        setTimeout(() => {
            this.currentEmail = novoEmail;
            
            // Atualizar em todos os lugares
            this.atualizarEmailNaInterface(novoEmail);
            
            // Salvar no localStorage
            localStorage.setItem('flowup-email', novoEmail);
            
            this.mostrarNotificacao('Email atualizado com sucesso!', 'success');
        }, 2000);
        
        return true;
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    atualizarEmailNaInterface(novoEmail) {
        // Atualizar no perfil
        const emailPrincipal = document.getElementById('emailPrincipal');
        if (emailPrincipal) {
            emailPrincipal.value = novoEmail;
        }

        // Atualizar no menu do usuário
        const userMenuEmail = document.querySelector('.user-menu-email');
        if (userMenuEmail) {
            userMenuEmail.textContent = novoEmail;
        }

        // Atualizar no topbar (se existir)
        const userEmailElements = document.querySelectorAll('.user .email');
        userEmailElements.forEach(element => {
            element.textContent = novoEmail;
        });

        // Atualizar na seção de conta
        const accountEmail = document.querySelector('.account-info .email-with-action strong');
        if (accountEmail) {
            accountEmail.textContent = novoEmail;
        }

        // Atualizar no perfil header
        const profileEmail = document.querySelector('.profile-info p.current-email');
        if (profileEmail) {
            profileEmail.textContent = novoEmail;
        }

        // Atualizar nos membros da equipe (se for o usuário atual)
        const memberEmails = document.querySelectorAll('.member-email');
        memberEmails.forEach(email => {
            if (email.textContent === this.currentEmail) {
                email.textContent = novoEmail;
            }
        });
    }

    // 🔄 Funções do Perfil Atualizadas
    salvarPerfil() {
        const dadosPerfil = {
            nomeCompleto: document.getElementById('nomeCompleto').value,
            nomeExibicao: document.getElementById('nomeExibicao').value,
            email: this.currentEmail,
            telefone: document.getElementById('telefone').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            empresa: document.getElementById('empresa').value,
            cargo: document.getElementById('cargo').value,
            website: document.getElementById('website').value,
            bio: document.getElementById('bio').value,
            idioma: document.getElementById('idioma').value,
            fusoHorario: document.getElementById('fusoHorario').value,
            tema: document.querySelector('input[name="tema"]:checked')?.value || 'claro',
            layout: document.querySelector('input[name="layout"]:checked')?.value || 'padrao',
            painelAnalise: document.getElementById('painelAnalise')?.checked || true,
            calendarioPostagem: document.getElementById('calendarioPostagem')?.checked || true,
            animacoes: document.getElementById('animacoes')?.checked || true,
            confirmacoes: document.getElementById('confirmacoes')?.checked || true
        };

        console.log('Salvando perfil:', dadosPerfil);
        
        // Aplicar tema se alterado
        this.aplicarTema(dadosPerfil.tema);
        
        // Salvar no localStorage
        localStorage.setItem('flowup-perfil', JSON.stringify(dadosPerfil));
        
        this.mostrarNotificacao('Perfil atualizado com sucesso', 'success');
    }

    // 📧 Modal de Alteração de Email Atualizado
    confirmarAlteracaoEmail() {
        const novoEmail = document.getElementById('novoEmail').value;
        const confirmarEmail = document.getElementById('confirmarEmail').value;
        const senhaAtual = document.getElementById('senhaAtualEmail').value;

        if (!novoEmail || !confirmarEmail || !senhaAtual) {
            this.mostrarNotificacao('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (novoEmail !== confirmarEmail) {
            this.mostrarNotificacao('Os e-mails não coincidem', 'error');
            return;
        }

        if (!this.validarEmail(novoEmail)) {
            this.mostrarNotificacao('Por favor, insira um email válido', 'error');
            return;
        }

        // Simular verificação de senha
        this.mostrarNotificacao('Verificando credenciais...', 'info');
        
        setTimeout(() => {
            if (this.atualizarEmail(novoEmail)) {
                this.fecharModalAlterarEmail();
            }
        }, 1500);
    }

    // 🔧 Carregar Configurações Atualizado
    carregarConfiguracoes() {
        // Carregar tema
        const temaSalvo = localStorage.getItem('flowup-tema') || 'light';
        this.aplicarTema(temaSalvo);

        // Carregar email
        const emailSalvo = localStorage.getItem('flowup-email');
        if (emailSalvo) {
            this.currentEmail = emailSalvo;
            this.atualizarEmailNaInterface(emailSalvo);
        }

        // Carregar outras configurações
        const configuracoesSalvas = localStorage.getItem('flowup-perfil');
        const densidadeSalva = localStorage.getItem('flowup-densidade');
        
        if (configuracoesSalvas) {
            const config = JSON.parse(configuracoesSalvas);
            this.aplicarConfiguracoesSalvas(config);
        }

        if (densidadeSalva) {
            this.aplicarDensidade(densidadeSalva);
        }

        // Atualizar ícone do toggle
        const themeToggleIcon = document.querySelector('#themeToggle i');
        if (themeToggleIcon) {
            themeToggleIcon.className = temaSalvo === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    aplicarConfiguracoesSalvas(config) {
        Object.keys(config).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = config[key];
                } else if (element.type === 'radio') {
                    const radio = document.querySelector(`input[name="${key}"][value="${config[key]}"]`);
                    if (radio) radio.checked = true;
                } else if (key !== 'email') { // Não sobrescrever email carregado separadamente
                    element.value = config[key];
                }
            }
        });
    }

    // Navegação entre seções
    configurarNavegacao() {
        const navItems = document.querySelectorAll('.settings-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove classe active de todos os itens
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Adiciona classe active ao item clicado
                item.classList.add('active');
                
                // Mostra a seção correspondente
                const sectionId = item.getAttribute('data-section');
                this.mostrarSecao(sectionId);
            });
        });
    }

    mostrarSecao(sectionId) {
        // Esconde todas as seções
        const sections = document.querySelectorAll('.settings-section');
        sections.forEach(section => section.classList.remove('active'));
        
        // Mostra a seção selecionada
        const sectionAlvo = document.getElementById(sectionId);
        if (sectionAlvo) {
            sectionAlvo.classList.add('active');
            
            // Scroll para o topo da seção
            sectionAlvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Menu do usuário
    configurarMenuUsuario() {
        const userMenuTrigger = document.getElementById('user-menu-trigger');
        const userMenu = document.getElementById('user-menu');

        if (userMenuTrigger && userMenu) {
            userMenuTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = userMenu.classList.contains('user-menu-show');
                
                if (isVisible) {
                    userMenu.classList.remove('user-menu-show');
                } else {
                    userMenu.classList.add('user-menu-show');
                }
            });

            // Fecha o menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target) && e.target !== userMenuTrigger) {
                    userMenu.classList.remove('user-menu-show');
                }
            });
        }
    }

    // Seleção de empresa
    configurarSelecaoEmpresa() {
        const selectSelected = document.querySelector('.select-selected');
        const selectItems = document.querySelector('.select-items');
        const selectOptions = document.querySelectorAll('.select-option');

        if (selectSelected && selectItems) {
            selectSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = selectItems.classList.contains('select-show');
                
                if (isVisible) {
                    selectItems.classList.remove('select-show');
                } else {
                    selectItems.classList.add('select-show');
                }
            });

            selectOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = option.getAttribute('data-value');
                    
                    if (value === 'new') {
                        this.abrirModalNovaEmpresa();
                    } else {
                        const selectedText = option.querySelector('span').textContent;
                        document.querySelector('.select-selected span').textContent = selectedText;
                        this.alterarEmpresa(value);
                    }
                    
                    selectItems.classList.remove('select-show');
                });
            });

            // Fecha o dropdown ao clicar fora
            document.addEventListener('click', () => {
                selectItems.classList.remove('select-show');
            });
        }
    }

    alterarEmpresa(empresaId) {
        console.log('Alterando para empresa:', empresaId);
        this.mostrarNotificacao(`Empresa alterada para ${empresaId}`, 'success');
    }

    abrirModalNovaEmpresa() {
        this.mostrarNotificacao('Funcionalidade de cadastro de nova empresa em desenvolvimento', 'info');
    }

    // Upload de avatar
    configurarUploadAvatar() {
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');

        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Validar tipo de arquivo
                    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                    if (!validTypes.includes(file.type)) {
                        this.mostrarNotificacao('Formato de arquivo não suportado. Use JPG, PNG ou WEBP.', 'error');
                        return;
                    }

                    // Validar tamanho (5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        this.mostrarNotificacao('Arquivo muito grande. Máximo 5MB.', 'error');
                        return;
                    }

                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        avatarPreview.src = e.target.result;
                        avatarPreview.style.display = 'block';
                        avatarPlaceholder.style.display = 'none';
                        this.mostrarNotificacao('Foto de perfil atualizada com sucesso', 'success');
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Campos editáveis inline
    configurarCamposEditaveis() {
        const camposEditaveis = document.querySelectorAll('.editable-field');
        
        camposEditaveis.forEach(campo => {
            campo.addEventListener('focus', () => {
                campo.style.background = 'var(--card-bg)';
                campo.style.borderColor = 'var(--g1)';
            });
            
            campo.addEventListener('blur', () => {
                campo.style.background = 'var(--input-bg)';
                campo.style.borderColor = 'var(--line)';
            });
        });
    }

    // Força da senha
    configurarForcaSenha() {
        const senhaInput = document.getElementById('novaSenha');
        const confirmarSenha = document.getElementById('confirmarSenha');

        if (senhaInput) {
            senhaInput.addEventListener('input', () => {
                this.atualizarForcaSenha();
                this.verificarConfirmacaoSenha();
            });
        }

        if (confirmarSenha) {
            confirmarSenha.addEventListener('input', () => {
                this.verificarConfirmacaoSenha();
            });
        }
    }

    atualizarForcaSenha() {
        const senha = document.getElementById('novaSenha').value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const strengthRules = document.getElementById('strengthRules');

        if (!strengthFill || !strengthText) return;

        const forca = this.calcularForcaSenha(senha);
        
        strengthFill.style.width = forca.percent + '%';
        strengthFill.style.backgroundColor = forca.cor;
        strengthText.textContent = forca.texto;
        strengthText.style.color = forca.cor;
        
        // Atualizar regras
        const regras = [];
        if (senha.length < 8) regras.push('Mín. 8 caracteres');
        if (!senha.match(/[a-z]/)) regras.push('Letra minúscula');
        if (!senha.match(/[A-Z]/)) regras.push('Letra maiúscula');
        if (!senha.match(/\d/)) regras.push('Número');
        if (!senha.match(/[^a-zA-Z\d]/)) regras.push('Símbolo');
        
        strengthRules.textContent = regras.length > 0 ? regras.join(' • ') : 'Senha forte!';
    }

    verificarConfirmacaoSenha() {
        const senha = document.getElementById('novaSenha').value;
        const confirmar = document.getElementById('confirmarSenha').value;
        const matchElement = document.getElementById('passwordMatch');

        if (!matchElement) return;

        if (confirmar === '') {
            matchElement.textContent = '';
            matchElement.style.color = '';
        } else if (senha === confirmar) {
            matchElement.textContent = '✓ Senhas coincidem';
            matchElement.style.color = '#10b981';
        } else {
            matchElement.textContent = '✗ Senhas não coincidem';
            matchElement.style.color = '#ef4444';
        }
    }

    calcularForcaSenha(senha) {
        let score = 0;
        const regras = [
            senha.length >= 8,
            senha.match(/[a-z]/) && senha.match(/[A-Z]/),
            senha.match(/\d/),
            senha.match(/[^a-zA-Z\d]/)
        ];

        score = regras.filter(Boolean).length;
        
        const niveis = [
            { percent: 25, cor: '#ef4444', texto: 'Fraca' },
            { percent: 50, cor: '#f97316', texto: 'Moderada' },
            { percent: 75, cor: '#eab308', texto: 'Forte' },
            { percent: 100, cor: '#22c55e', texto: 'Muito Forte' }
        ];
        
        return niveis[Math.min(score, niveis.length - 1)];
    }

    // Modal de exclusão de conta
    configurarModalExclusao() {
        const modal = document.getElementById('modalExclusao');
        const confirmarCheck1 = document.getElementById('confirmarExclusao1');
        const confirmarCheck2 = document.getElementById('confirmarExclusao2');
        const confirmacaoTexto = document.getElementById('confirmacaoTexto');
        const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');

        const atualizarBotaoConfirmacao = () => {
            const checksMarcados = confirmarCheck1.checked && confirmarCheck2.checked;
            const textoCorreto = confirmacaoTexto.value === 'EXCLUIR CONTA';
            btnConfirmarExclusao.disabled = !(checksMarcados && textoCorreto);
        };

        if (confirmarCheck1 && confirmarCheck2 && confirmacaoTexto) {
            confirmarCheck1.addEventListener('change', atualizarBotaoConfirmacao);
            confirmarCheck2.addEventListener('change', atualizarBotaoConfirmacao);
            confirmacaoTexto.addEventListener('input', atualizarBotaoConfirmacao);
        }
    }

    // Configurações de notificações
    configurarNotificacoes() {
        // Modo Não Perturbe
        const modoDND = document.getElementById('modoDND');
        const dndDuration = document.getElementById('dndDuration');

        if (modoDND && dndDuration) {
            modoDND.addEventListener('change', (e) => {
                dndDuration.style.display = e.target.checked ? 'block' : 'none';
                
                if (e.target.checked) {
                    this.mostrarNotificacao('Modo Não Perturbe ativado', 'info');
                }
            });
        }
    }

    // Configurações de permissões
    configurarPermissoes() {
        // Configurar eventos para membros da equipe
        const botoesEditar = document.querySelectorAll('.btn-action');
        botoesEditar.forEach(botao => {
            if (botao.textContent.includes('✏️')) {
                botao.addEventListener('click', function() {
                    const memberItem = this.closest('.member-item');
                    const memberName = memberItem.querySelector('.member-name').textContent;
                    window.configuracoesFlowUp.mostrarNotificacao(`Editando permissões de ${memberName}`, 'info');
                });
            }
        });
    }

    // Configurações de integrações
    configurarIntegracoes() {
        // Configurar eventos para integrações
        const botoesConectar = document.querySelectorAll('.integration-actions .btn-primary');
        botoesConectar.forEach(botao => {
            botao.addEventListener('click', function() {
                const integrationCard = this.closest('.integration-card');
                const integrationName = integrationCard.querySelector('h4').textContent;
                window.configuracoesFlowUp.mostrarNotificacao(`Conectando ${integrationName}...`, 'info');
                
                // Simular conexão
                setTimeout(() => {
                    integrationCard.classList.add('connected');
                    integrationCard.querySelector('.integration-status').textContent = 'Conectado';
                    integrationCard.querySelector('.integration-status').classList.add('connected');
                    window.configuracoesFlowUp.mostrarNotificacao(`${integrationName} conectado com sucesso!`, 'success');
                }, 2000);
            });
        });

        // Configurar eventos para tokens de API
        const botoesCopiarToken = document.querySelectorAll('.token-actions .btn-action');
        botoesCopiarToken.forEach(botao => {
            if (botao.textContent.includes('📋')) {
                botao.addEventListener('click', function() {
                    const tokenItem = this.closest('.token-item');
                    const tokenCode = tokenItem.querySelector('code').textContent;
                    window.configuracoesFlowUp.copiarParaAreaTransferencia(tokenCode);
                    window.configuracoesFlowUp.mostrarNotificacao('Token copiado para a área de transferência', 'success');
                });
            }
        });
    }

    // Configurações de preferências
    configurarPreferencias() {
        // Configurar seletores de tema
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                window.configuracoesFlowUp.aplicarTema(theme);
                
                // Atualizar estado visual
                themeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Configurar seletores de densidade
        const densityOptions = document.querySelectorAll('.density-option');
        densityOptions.forEach(option => {
            option.addEventListener('click', function() {
                const density = this.getAttribute('data-density');
                window.configuracoesFlowUp.aplicarDensidade(density);
                
                // Atualizar estado visual
                densityOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    aplicarDensidade(densidade) {
        // Aplicar classes CSS para diferentes densidades
        document.body.classList.remove('density-compact', 'density-normal', 'density-comfortable');
        document.body.classList.add(`density-${densidade}`);
        
        // Salvar preferência
        localStorage.setItem('flowup-densidade', densidade);
    }

    // Configurações de conta
    configurarConta() {
        // Configurar eventos específicos da seção de conta
        const btnAlterarEmail = document.querySelector('.email-with-action .btn-action');
        if (btnAlterarEmail) {
            btnAlterarEmail.addEventListener('click', () => {
                this.abrirModalAlterarEmail();
            });
        }

        // Configurar eventos de faturas
        const botoesBaixarFatura = document.querySelectorAll('.invoice-actions .btn-action');
        botoesBaixarFatura.forEach(botao => {
            botao.addEventListener('click', function() {
                const invoiceItem = this.closest('.invoice-item');
                const invoiceName = invoiceItem.querySelector('strong').textContent;
                window.configuracoesFlowUp.mostrarNotificacao(`Baixando fatura ${invoiceName}...`, 'info');
                
                // Simular download
                setTimeout(() => {
                    window.configuracoesFlowUp.mostrarNotificacao('Fatura baixada com sucesso', 'success');
                }, 1500);
            });
        });
    }

    // Configurações de extras
    configurarExtras() {
        // Modo Foco
        const modoFoco = document.getElementById('modoFoco');
        const focusDuration = document.getElementById('focusDuration');

        if (modoFoco && focusDuration) {
            modoFoco.addEventListener('change', (e) => {
                focusDuration.style.display = e.target.checked ? 'block' : 'none';
                
                if (e.target.checked) {
                    const duration = focusDuration.querySelector('select').value;
                    this.mostrarNotificacao(`Modo Foco ativado por ${duration} minutos`, 'info');
                } else {
                    this.mostrarNotificacao('Modo Foco desativado', 'info');
                }
            });
        }

        // Modo Beta
        const modoBeta = document.getElementById('modoBeta');
        if (modoBeta) {
            modoBeta.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.mostrarNotificacao('Modo Beta ativado. Recursos experimentais disponíveis.', 'warning');
                } else {
                    this.mostrarNotificacao('Modo Beta desativado', 'info');
                }
            });
        }
    }

    redefinirPerfil() {
        if (confirm('Tem certeza que deseja redefinir todas as alterações do perfil?')) {
            document.getElementById('nomeCompleto').value = 'Alone Souza';
            document.getElementById('nomeExibicao').value = 'Alone';
            document.getElementById('telefone').value = '+55 (11) 99999-9999';
            document.getElementById('empresa').value = 'Empresa A';
            document.getElementById('cargo').value = 'Social Media Manager';
            document.getElementById('idioma').value = 'pt-BR';
            document.getElementById('fusoHorario').value = '-3';
            
            // Restaurar checkboxes
            const checkboxes = ['painelAnalise', 'calendarioPostagem', 'animacoes', 'confirmacoes'];
            checkboxes.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.checked = true;
            });
            
            this.mostrarNotificacao('Perfil redefinido para os valores padrão', 'info');
        }
    }

    // Funções de segurança
    alterarSenha(event) {
        event.preventDefault();
        
        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        // Validar força da senha
        const forca = this.calcularForcaSenha(novaSenha);
        if (forca.texto === 'Fraca' || forca.texto === 'Moderada') {
            this.mostrarNotificacao('A senha é muito fraca. Use uma senha mais forte.', 'error');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            this.mostrarNotificacao('As senhas não coincidem', 'error');
            return;
        }

        // Simular alteração de senha
        setTimeout(() => {
            this.mostrarNotificacao('Senha alterada com sucesso', 'success');
            event.target.reset();
            this.atualizarForcaSenha();
            this.verificarConfirmacaoSenha();
        }, 1000);
    }

    ativar2FA() {
        const metodo2FA = document.querySelector('input[name="2fa"]:checked').value;
        
        // Simular ativação do 2FA
        setTimeout(() => {
            this.mostrarNotificacao(`Autenticação em duas etapas ativada via ${metodo2FA}`, 'success');
            
            // Mostrar QR Code (simulado)
            const qrSection = document.getElementById('qrCodeSection');
            if (qrSection) {
                qrSection.style.display = 'block';
            }
        }, 1500);
    }

    copiarCodigos() {
        const codes = ['A1B2-C3D4', 'E5F6-G7H8', 'I9J0-K1L2', 'M3N4-O5P6'];
        this.copiarParaAreaTransferencia(codes.join('\n'));
        this.mostrarNotificacao('Códigos de recuperação copiados', 'success');
    }

    encerrarSessao(botao) {
        const sessaoItem = botao.closest('.session-item');
        const dispositivo = sessaoItem.querySelector('strong').textContent;
        
        if (confirm(`Deseja encerrar a sessão em ${dispositivo}?`)) {
            sessaoItem.style.opacity = '0.5';
            botao.disabled = true;
            botao.textContent = 'Encerrando...';
            
            setTimeout(() => {
                sessaoItem.remove();
                this.mostrarNotificacao('Sessão encerrada com sucesso', 'success');
            }, 1000);
        }
    }

    encerrarTodasSessoes() {
        if (confirm('Deseja encerrar todas as sessões ativas? Você será desconectado de todos os dispositivos.')) {
            const sessoes = document.querySelectorAll('.session-item:not(.current)');
            
            sessoes.forEach(sessao => {
                sessao.style.opacity = '0.5';
                const botao = sessao.querySelector('button');
                if (botao) botao.disabled = true;
            });
            
            setTimeout(() => {
                sessoes.forEach(sessao => sessao.remove());
                this.mostrarNotificacao('Todas as sessões foram encerradas', 'success');
            }, 1500);
        }
    }

    filtrarLogins() {
        const filtro = document.getElementById('filtroLogin').value;
        const dataInicio = document.getElementById('dataInicioLogin').value;
        const dataFim = document.getElementById('dataFimLogin').value;
        
        this.mostrarNotificacao(`Filtro aplicado: ${filtro}`, 'info');
    }

    limparHistoricoLogin() {
        if (confirm('Deseja limpar todo o histórico de login?')) {
            const historyItems = document.querySelectorAll('.history-item');
            historyItems.forEach(item => item.remove());
            this.mostrarNotificacao('Histórico de login limpo', 'success');
        }
    }

    salvarAlertas() {
        this.mostrarNotificacao('Preferências de alertas salvas', 'success');
    }

    exportarDados() {
        const format = document.querySelector('.export-format').value;
        this.mostrarNotificacao(`Exportando dados em formato ${format.toUpperCase()}...`, 'info');
        
        // Simular exportação
        setTimeout(() => {
            this.mostrarNotificacao('Dados exportados com sucesso', 'success');
        }, 2000);
    }

    // Modal de exclusão
    abrirModalExclusao() {
        const modal = document.getElementById('modalExclusao');
        modal.classList.add('show');
    }

    fecharModalExclusao() {
        const modal = document.getElementById('modalExclusao');
        modal.classList.remove('show');
        
        // Resetar formulário
        document.getElementById('confirmarExclusao1').checked = false;
        document.getElementById('confirmarExclusao2').checked = false;
        document.getElementById('confirmacaoTexto').value = '';
    }

    confirmarExclusao() {
        if (confirm('CONFIRMAÇÃO FINAL: Esta ação é IRREVERSÍVEL. Tem certeza absoluta que deseja excluir permanentemente sua conta?')) {
            // Simular exclusão
            this.mostrarNotificacao('Sua conta está sendo excluída...', 'warning');
            
            setTimeout(() => {
                this.fecharModalExclusao();
                this.mostrarNotificacao('Conta excluída permanentemente', 'success');
                // Redirecionar para página inicial
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }, 3000);
        }
    }

    // Funções de permissões
    abrirModalConvidar() {
        const modal = document.getElementById('modalConvidar');
        modal.classList.add('show');
    }

    fecharModalConvidar() {
        const modal = document.getElementById('modalConvidar');
        modal.classList.remove('show');
    }

    enviarConvite() {
        const email = document.getElementById('emailMembro').value;
        const funcao = document.getElementById('funcaoMembro').value;
        const mensagem = document.getElementById('mensagemConvite').value;

        if (!email) {
            this.mostrarNotificacao('Por favor, informe o e-mail do membro', 'error');
            return;
        }

        // Simular envio de convite
        setTimeout(() => {
            this.mostrarNotificacao(`Convite enviado para ${email}`, 'success');
            this.fecharModalConvidar();
            
            // Resetar formulário
            document.getElementById('formConvidar').reset();
        }, 1000);
    }

    editarMembro(botao) {
        const memberItem = botao.closest('.member-item');
        const memberName = memberItem.querySelector('.member-name').textContent;
        this.mostrarNotificacao(`Editando permissões de ${memberName}`, 'info');
    }

    suspenderMembro(botao) {
        const memberItem = botao.closest('.member-item');
        const memberName = memberItem.querySelector('.member-name').textContent;
        
        if (confirm(`Deseja suspender o acesso de ${memberName}?`)) {
            memberItem.style.opacity = '0.5';
            botao.disabled = true;
            this.mostrarNotificacao(`${memberName} suspenso temporariamente`, 'warning');
        }
    }

    removerMembro(botao) {
        const memberItem = botao.closest('.member-item');
        const memberName = memberItem.querySelector('.member-name').textContent;
        
        if (confirm(`Deseja remover permanentemente ${memberName} da equipe?`)) {
            memberItem.style.opacity = '0.5';
            setTimeout(() => {
                memberItem.remove();
                this.mostrarNotificacao(`${memberName} removido da equipe`, 'success');
            }, 1000);
        }
    }

    exportarLogs() {
        this.mostrarNotificacao('Exportando logs em formato CSV...', 'info');
        
        // Simular exportação
        setTimeout(() => {
            this.mostrarNotificacao('Logs exportados com sucesso', 'success');
        }, 1500);
    }

    // Funções de notificações
    marcarTodasComoLidas() {
        const notificacoes = document.querySelectorAll('.notification-item.unread');
        notificacoes.forEach(notif => {
            notif.classList.remove('unread');
            notif.style.background = 'var(--card-bg)';
        });
        this.mostrarNotificacao('Todas as notificações marcadas como lidas', 'success');
    }

    limparHistoricoNotificacoes() {
        if (confirm('Deseja limpar todo o histórico de notificações?')) {
            const notificacoes = document.querySelectorAll('.notification-item');
            notificacoes.forEach(notif => notif.remove());
            this.mostrarNotificacao('Histórico de notificações limpo', 'success');
        }
    }

    // Funções de integrações
    conectarIntegracao(servico) {
        this.mostrarNotificacao(`Conectando ${servico}...`, 'info');
        
        // Simular conexão
        setTimeout(() => {
            this.mostrarNotificacao(`${servico} conectado com sucesso!`, 'success');
        }, 2000);
    }

    desconectarIntegracao(servico) {
        if (confirm(`Deseja desconectar ${servico}?`)) {
            this.mostrarNotificacao(`Desconectando ${servico}...`, 'info');
            
            // Simular desconexão
            setTimeout(() => {
                this.mostrarNotificacao(`${servico} desconectado com sucesso`, 'success');
            }, 1500);
        }
    }

    testarIntegracao(servico) {
        this.mostrarNotificacao(`Testando integração com ${servico}...`, 'info');
        
        // Simular teste
        setTimeout(() => {
            this.mostrarNotificacao(`Integração com ${servico} funcionando perfeitamente!`, 'success');
        }, 1500);
    }

    gerarNovaChave() {
        const novaChave = `sk_live_${Math.random().toString(36).substr(2, 12)}`;
        this.mostrarNotificacao('Nova chave de API gerada', 'success');
        
        // Aqui você adicionaria a lógica para salvar a nova chave
        console.log('Nova chave:', novaChave);
    }

    copiarToken(token) {
        this.copiarParaAreaTransferencia(token);
        this.mostrarNotificacao('Token copiado para a área de transferência', 'success');
    }

    revogarToken(botao) {
        if (confirm('Deseja revogar esta chave de API? Esta ação é irreversível.')) {
            const tokenItem = botao.closest('.token-item');
            tokenItem.style.opacity = '0.5';
            setTimeout(() => {
                tokenItem.remove();
                this.mostrarNotificacao('Chave de API revogada com sucesso', 'success');
            }, 1000);
        }
    }

    // Funções de preferências
    solicitarExclusaoHistorico() {
        if (confirm('Deseja solicitar a exclusão do seu histórico de atividades?')) {
            this.mostrarNotificacao('Solicitação de exclusão de histórico enviada', 'info');
        }
    }

    // Funções de conta
    abrirModalAlterarEmail() {
        const modal = document.getElementById('modalAlterarEmail');
        modal.classList.add('show');
    }

    fecharModalAlterarEmail() {
        const modal = document.getElementById('modalAlterarEmail');
        modal.classList.remove('show');
        
        // Resetar formulário
        document.getElementById('formAlterarEmail').reset();
    }

    gerenciarPlano() {
        this.mostrarNotificacao('Abrindo gerenciador de planos...', 'info');
    }

    atualizarPagamento() {
        this.mostrarNotificacao('Abrindo atualização de método de pagamento...', 'info');
    }

    baixarFatura(mes) {
        this.mostrarNotificacao(`Baixando fatura de ${mes}...`, 'info');
        
        // Simular download
        setTimeout(() => {
            this.mostrarNotificacao('Fatura baixada com sucesso', 'success');
        }, 1500);
    }

    cancelarAssinatura() {
        if (confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium.')) {
            this.mostrarNotificacao('Processando cancelamento...', 'warning');
            
            setTimeout(() => {
                this.mostrarNotificacao('Assinatura cancelada com sucesso', 'success');
            }, 2000);
        }
    }

    // Funções de extras
    exportarDadosCompletos() {
        this.mostrarNotificacao('Preparando exportação completa de dados...', 'info');
        
        setTimeout(() => {
            this.mostrarNotificacao('Dados exportados com sucesso', 'success');
        }, 3000);
    }

    solicitarExclusaoConta() {
        this.abrirModalExclusao();
    }

    reverterConfiguracoes() {
        if (confirm('Deseja reverter para as configurações padrão anteriores?')) {
            this.mostrarNotificacao('Configurações revertidas com sucesso', 'success');
        }
    }

    exportarHistorico() {
        this.mostrarNotificacao('Exportando histórico de configurações...', 'info');
        
        setTimeout(() => {
            this.mostrarNotificacao('Histórico exportado com sucesso', 'success');
        }, 1500);
    }

    verStatusAPIs() {
        this.mostrarNotificacao('Verificando status das APIs...', 'info');
        
        setTimeout(() => {
            this.mostrarNotificacao('Todas as APIs estão funcionando normalmente', 'success');
        }, 2000);
    }

    // Funções utilitárias
    reenviarVerificacao() {
        this.mostrarNotificacao('E-mail de verificação reenviado', 'info');
    }

    removerAvatar() {
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
        
        avatarPreview.style.display = 'none';
        avatarPreview.src = '';
        avatarPlaceholder.style.display = 'flex';
        
        this.mostrarNotificacao('Foto de perfil removida', 'info');
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input.parentNode.querySelector('.toggle-password');
        
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
        }
    }

    copiarParaAreaTransferencia(texto) {
        navigator.clipboard.writeText(texto).catch(err => {
            console.error('Erro ao copiar texto: ', err);
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }

    // Utilitários
    mostrarNotificacao(mensagem, tipo = 'info') {
        const container = document.getElementById('notifications-container');
        if (!container) return;

        const notificacao = document.createElement('div');
        notificacao.className = `notification ${tipo}`;
        notificacao.innerHTML = `
            <div class="notification-icon">
                ${tipo === 'success' ? '✅' : 
                  tipo === 'error' ? '❌' : 
                  tipo === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div class="notification-content">
                <strong>${mensagem}</strong>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notificacao);
        
        // Botão fechar
        const btnFechar = notificacao.querySelector('.notification-close');
        btnFechar.addEventListener('click', () => {
            notificacao.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificacao.remove(), 300);
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notificacao.remove(), 300);
            }
        }, 5000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.configuracoesFlowUp = new ConfiguracoesFlowUp();
});

// Salvar configurações antes de sair
window.addEventListener('beforeunload', () => {
    const tema = document.documentElement.getAttribute('data-theme');
    const densidade = localStorage.getItem('flowup-densidade');
    
    if (tema) {
        localStorage.setItem('flowup-tema', tema);
    }
    if (densidade) {
        localStorage.setItem('flowup-densidade', densidade);
    }
});

// Funções globais para os botões HTML
function salvarPerfil() { window.configuracoesFlowUp.salvarPerfil(); }
function redefinirPerfil() { window.configuracoesFlowUp.redefinirPerfil(); }
function alterarSenha(event) { window.configuracoesFlowUp.alterarSenha(event); }
function atualizarForcaSenha() { window.configuracoesFlowUp.atualizarForcaSenha(); }
function ativar2FA() { window.configuracoesFlowUp.ativar2FA(); }
function copiarCodigos() { window.configuracoesFlowUp.copiarCodigos(); }
function encerrarSessao(element) { window.configuracoesFlowUp.encerrarSessao(element); }
function encerrarTodasSessoes() { window.configuracoesFlowUp.encerrarTodasSessoes(); }
function filtrarLogins() { window.configuracoesFlowUp.filtrarLogins(); }
function limparHistoricoLogin() { window.configuracoesFlowUp.limparHistoricoLogin(); }
function salvarAlertas() { window.configuracoesFlowUp.salvarAlertas(); }
function exportarDados() { window.configuracoesFlowUp.exportarDados(); }
function abrirModalExclusao() { window.configuracoesFlowUp.abrirModalExclusao(); }
function fecharModalExclusao() { window.configuracoesFlowUp.fecharModalExclusao(); }
function confirmarExclusao() { window.configuracoesFlowUp.confirmarExclusao(); }
function abrirModalConvidar() { window.configuracoesFlowUp.abrirModalConvidar(); }
function fecharModalConvidar() { window.configuracoesFlowUp.fecharModalConvidar(); }
function enviarConvite() { window.configuracoesFlowUp.enviarConvite(); }
function editarMembro(element) { window.configuracoesFlowUp.editarMembro(element); }
function suspenderMembro(element) { window.configuracoesFlowUp.suspenderMembro(element); }
function removerMembro(element) { window.configuracoesFlowUp.removerMembro(element); }
function exportarLogs() { window.configuracoesFlowUp.exportarLogs(); }
function marcarTodasComoLidas() { window.configuracoesFlowUp.marcarTodasComoLidas(); }
function limparHistoricoNotificacoes() { window.configuracoesFlowUp.limparHistoricoNotificacoes(); }
function reenviarVerificacao() { window.configuracoesFlowUp.reenviarVerificacao(); }
function removerAvatar() { window.configuracoesFlowUp.removerAvatar(); }
function togglePassword(inputId) { window.configuracoesFlowUp.togglePassword(inputId); }
function conectarIntegracao(servico) { window.configuracoesFlowUp.conectarIntegracao(servico); }
function desconectarIntegracao(servico) { window.configuracoesFlowUp.desconectarIntegracao(servico); }
function testarIntegracao(servico) { window.configuracoesFlowUp.testarIntegracao(servico); }
function gerarNovaChave() { window.configuracoesFlowUp.gerarNovaChave(); }
function copiarToken(token) { window.configuracoesFlowUp.copiarToken(token); }
function revogarToken(element) { window.configuracoesFlowUp.revogarToken(element); }
function solicitarExclusaoHistorico() { window.configuracoesFlowUp.solicitarExclusaoHistorico(); }
function alterarEmail() { window.configuracoesFlowUp.abrirModalAlterarEmail(); }
function fecharModalAlterarEmail() { window.configuracoesFlowUp.fecharModalAlterarEmail(); }
function confirmarAlteracaoEmail() { window.configuracoesFlowUp.confirmarAlteracaoEmail(); }
function gerenciarPlano() { window.configuracoesFlowUp.gerenciarPlano(); }
function atualizarPagamento() { window.configuracoesFlowUp.atualizarPagamento(); }
function baixarFatura(mes) { window.configuracoesFlowUp.baixarFatura(mes); }
function cancelarAssinatura() { window.configuracoesFlowUp.cancelarAssinatura(); }
function exportarDadosCompletos() { window.configuracoesFlowUp.exportarDadosCompletos(); }
function solicitarExclusaoConta() { window.configuracoesFlowUp.solicitarExclusaoConta(); }
function reverterConfiguracoes() { window.configuracoesFlowUp.reverterConfiguracoes(); }
function exportarHistorico() { window.configuracoesFlowUp.exportarHistorico(); }
function verStatusAPIs() { window.configuracoesFlowUp.verStatusAPIs(); }
function alternarTema() { window.configuracoesFlowUp.alternarTema(); }