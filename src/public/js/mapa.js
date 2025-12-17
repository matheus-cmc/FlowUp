// mapa.js - Interatividade para a página Mapa Geral

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar componentes
  initializeCustomSelect();
  initializeUserMenu();
  initializeProjectCards();
  initializeTeamMembers();
  initializePostCards();
  initializeWorkloadIndicators();
});

// Inicializar seleção personalizada de empresa
function initializeCustomSelect() {
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const optionsContainer = select.querySelector('.select-items');
    const options = select.querySelectorAll('.select-option');
    
    // Toggle dropdown
    selected.addEventListener('click', function(e) {
      e.stopPropagation();
      closeAllSelect(this);
      optionsContainer.classList.toggle('select-show');
      
      // Rotacionar seta
      const arrow = this.querySelector('.select-arrow');
      arrow.style.transform = optionsContainer.classList.contains('select-show') 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)';
    });
    
    // Selecionar opção
    options.forEach(option => {
      option.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        
        if (value === 'new') {
          openNewCompanyModal();
          return;
        }
        
        // Atualizar texto selecionado
        const selectedSpan = selected.querySelector('span');
        selectedSpan.textContent = this.querySelector('span').textContent;
        
        // Fechar dropdown
        optionsContainer.classList.remove('select-show');
        const arrow = selected.querySelector('.select-arrow');
        arrow.style.transform = 'rotate(0deg)';
        
        // Disparar evento de mudança
        const event = new CustomEvent('companyChange', {
          detail: { company: value }
        });
        select.dispatchEvent(event);
      });
    });
  });
  
  // Fechar dropdown ao clicar fora
  document.addEventListener('click', function() {
    const openSelects = document.querySelectorAll('.select-show');
    openSelects.forEach(select => {
      select.classList.remove('select-show');
      const arrow = select.parentElement.querySelector('.select-arrow');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    });
  });
}

// Inicializar menu do usuário
function initializeUserMenu() {
  const userTrigger = document.getElementById('user-menu-trigger');
  const userMenu = document.getElementById('user-menu');
  
  if (userTrigger && userMenu) {
    userTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      userMenu.classList.toggle('user-menu-show');
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function() {
      userMenu.classList.remove('user-menu-show');
    });
  }
}

// Inicializar cards de projeto com interatividade
function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      const projectName = this.querySelector('.project-name').textContent;
      console.log('Projeto selecionado:', projectName);
      
      // Adicionar efeito visual
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// Inicializar membros da equipe
function initializeTeamMembers() {
  const memberCards = document.querySelectorAll('.team-member-card');
  
  memberCards.forEach(card => {
    card.addEventListener('click', function() {
      const memberName = this.querySelector('.member-name').textContent;
      console.log('Membro selecionado:', memberName);
      
      // Adicionar efeito visual
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// Inicializar cards de postagem
function initializePostCards() {
  const postCards = document.querySelectorAll('.post-card');
  
  postCards.forEach(card => {
    card.addEventListener('click', function() {
      const postTitle = this.querySelector('.post-title').textContent;
      console.log('Post selecionado:', postTitle);
      
      // Adicionar efeito visual
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// Inicializar indicadores de carga de trabalho
function initializeWorkloadIndicators() {
  const workloadCards = document.querySelectorAll('.workload-card');
  
  workloadCards.forEach(card => {
    card.addEventListener('click', function() {
      const workloadType = this.classList[1]; // light, moderate, high, overloaded
      console.log('Carga de trabalho:', workloadType);
      
      // Adicionar efeito visual
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// Abrir modal de nova empresa (simulado)
function openNewCompanyModal() {
  console.log('Abrir modal de nova empresa');
  
  // Aqui você pode implementar a lógica para abrir um modal real
  // Por enquanto, apenas um alerta
  alert('Funcionalidade de cadastrar nova empresa será implementada aqui.');
}

// Fechar todos os dropdowns abertos
function closeAllSelect(element) {
  const allSelects = document.querySelectorAll('.select-items');
  allSelects.forEach(select => {
    if (element !== select && element !== select.parentElement) {
      select.classList.remove('select-show');
      const arrow = select.parentElement.querySelector('.select-arrow');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
  });
}

// Simular dados em tempo real (opcional)
function simulateLiveData() {
  setInterval(() => {
    // Atualizar indicadores
    const postsValue = document.querySelector('.indicator-card:nth-child(1) .indicator-value');
    const completionValue = document.querySelector('.indicator-card:nth-child(4) .indicator-value');
    
    if (postsValue && completionValue) {
      const currentPosts = parseInt(postsValue.textContent);
      const currentCompletion = parseInt(completionValue.textContent);
      
      // Simular pequenas mudanças
      const newPosts = Math.max(1, Math.min(99, currentPosts + Math.floor(Math.random() * 3) - 1));
      const newCompletion = Math.max(50, Math.min(95, currentCompletion + Math.floor(Math.random() * 5) - 2));
      
      postsValue.textContent = newPosts;
      completionValue.textContent = newCompletion + '%';
      
      // Animar mudança
      postsValue.style.transform = 'scale(1.1)';
      completionValue.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        postsValue.style.transform = 'scale(1)';
        completionValue.style.transform = 'scale(1)';
      }, 300);
    }
  }, 10000); // Atualizar a cada 10 segundos
}

// Iniciar simulação de dados (opcional)
// simulateLiveData();

// Função para filtrar projetos por status
function filterProjects(status) {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    const cardStatus = card.querySelector('.project-status').textContent.toLowerCase();
    
    if (status === 'all' || cardStatus.includes(status)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Função para filtrar membros por carga de trabalho
function filterMembers(workload) {
  const memberCards = document.querySelectorAll('.team-member-card');
  
  memberCards.forEach(card => {
    const workloadClass = Array.from(card.querySelector('.member-workload').classList)
      .find(cls => ['light', 'moderate', 'high', 'overloaded'].includes(cls));
    
    if (workload === 'all' || workloadClass === workload) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}