// Perfil Script
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do modal de avatar
  const editAvatarBtn = document.getElementById('editAvatar');
  const avatarModal = document.getElementById('avatarModal');
  const avatarModalClose = document.getElementById('avatarModalClose');
  const avatarCancelBtn = document.getElementById('avatarCancelBtn');
  const avatarSaveBtn = document.getElementById('avatarSaveBtn');
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarPreview = document.querySelector('.avatar-preview .profile-avatar');
  const fileInfo = document.getElementById('fileInfo');

  // Elementos de interação
  const editAboutBtn = document.getElementById('editAbout');
  const addPhotoBtn = document.getElementById('addPhoto');
  const addSkillBtn = document.getElementById('addSkill');

  // Inicialização
  function init() {
    setupEventListeners();
    animateSkills();
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Avatar modal
    editAvatarBtn.addEventListener('click', openAvatarModal);
    avatarModalClose.addEventListener('click', closeAvatarModal);
    avatarCancelBtn.addEventListener('click', closeAvatarModal);
    avatarModal.addEventListener('click', handleModalClick);
    avatarUpload.addEventListener('change', handleAvatarUpload);
    avatarSaveBtn.addEventListener('click', saveAvatar);

    // Botões de ação
    editAboutBtn.addEventListener('click', editAbout);
    addPhotoBtn.addEventListener('click', addPhoto);
    addSkillBtn.addEventListener('click', addSkill);

    // Fechar modal com ESC
    document.addEventListener('keydown', handleKeydown);
  }

  // Avatar Modal Functions
  function openAvatarModal() {
    avatarModal.classList.add('show');
    setTimeout(() => avatarModalClose.focus(), 100);
  }

  function closeAvatarModal() {
    avatarModal.classList.remove('show');
    avatarUpload.value = '';
    fileInfo.textContent = '';
    resetAvatarPreview();
  }

  function handleModalClick(e) {
    if (e.target === avatarModal) {
      closeAvatarModal();
    }
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validações
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      showNotification('Por favor, selecione uma imagem JPEG, PNG, GIF ou WebP.', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      showNotification('A imagem deve ter no máximo 5MB.', 'error');
      e.target.value = '';
      return;
    }

    // Preview da imagem
    const reader = new FileReader();
    reader.onload = function(e) {
      avatarPreview.style.backgroundImage = `url(${e.target.result})`;
      avatarPreview.style.backgroundSize = 'cover';
      avatarPreview.style.backgroundPosition = 'center';
      avatarPreview.innerHTML = ''; // Remove o ícone
    };
    reader.readAsDataURL(file);

    // Info do arquivo
    fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
    fileInfo.style.color = 'var(--purple-1)';
  }

  function resetAvatarPreview() {
    avatarPreview.style.backgroundImage = '';
    avatarPreview.style.background = 'var(--gradient)';
    avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function saveAvatar() {
    if (!avatarUpload.files || !avatarUpload.files[0]) {
      showNotification('Por favor, selecione uma foto.', 'error');
      return;
    }

    const file = avatarUpload.files[0];
    
    // Simular upload
    setButtonLoading(avatarSaveBtn, true);
    
    setTimeout(() => {
      // Em uma aplicação real, aqui faria o upload para o servidor
      const reader = new FileReader();
      reader.onload = function(e) {
        // Atualizar avatar na página principal
        const mainAvatar = document.querySelector('.profile-avatar');
        mainAvatar.style.backgroundImage = `url(${e.target.result})`;
        mainAvatar.style.backgroundSize = 'cover';
        mainAvatar.style.backgroundPosition = 'center';
        mainAvatar.innerHTML = '';
      };
      reader.readAsDataURL(file);
      
      // Fechar modal e mostrar sucesso
      closeAvatarModal();
      showNotification('Foto do perfil atualizada com sucesso!', 'success');
      
      // Resetar botão
      setButtonLoading(avatarSaveBtn, false);
    }, 2000);
  }

  // Action Functions
  function editAbout() {
    const aboutContent = document.querySelector('.about-content p');
    const currentText = aboutContent.textContent;
    
    const newText = prompt('Edite sua biografia:', currentText);
    if (newText && newText !== currentText) {
      aboutContent.textContent = newText;
      showNotification('Biografia atualizada com sucesso!', 'success');
    }
  }

  function addPhoto() {
    showNotification('Funcionalidade de adicionar foto em desenvolvimento!', 'info');
    
    // Simular adição de foto
    const photosGrid = document.querySelector('.photos-grid');
    const newPhoto = document.createElement('div');
    newPhoto.className = 'photo-item';
    newPhoto.innerHTML = `
      <div class="photo-placeholder">
        <i class="fas fa-image"></i>
      </div>
    `;
    
    photosGrid.appendChild(newPhoto);
    
    // Animação de entrada
    newPhoto.style.transform = 'scale(0)';
    newPhoto.style.opacity = '0';
    
    setTimeout(() => {
      newPhoto.style.transition = 'all 0.3s ease';
      newPhoto.style.transform = 'scale(1)';
      newPhoto.style.opacity = '1';
    }, 100);
  }

  function addSkill() {
    const skillName = prompt('Digite o nome da nova habilidade:');
    if (!skillName) return;
    
    const skillLevel = prompt('Digite o nível da habilidade (0-100):');
    if (!skillLevel || isNaN(skillLevel) || skillLevel < 0 || skillLevel > 100) {
      showNotification('Por favor, insira um nível válido entre 0 e 100.', 'error');
      return;
    }
    
    const skillsList = document.querySelector('.skills-list');
    const newSkill = document.createElement('div');
    newSkill.className = 'skill-item';
    newSkill.innerHTML = `
      <div class="skill-info">
        <span class="skill-name">${skillName}</span>
        <span class="skill-percent">${skillLevel}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-progress" style="width: 0%"></div>
      </div>
    `;
    
    skillsList.appendChild(newSkill);
    
    // Animação da barra de progresso
    setTimeout(() => {
      const progressBar = newSkill.querySelector('.skill-progress');
      progressBar.style.width = `${skillLevel}%`;
    }, 100);
    
    showNotification('Habilidade adicionada com sucesso!', 'success');
  }

  // Animation Functions
  function animateSkills() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    skillProgresses.forEach(progress => {
      const width = progress.style.width;
      progress.style.width = '0%';
      
      setTimeout(() => {
        progress.style.transition = 'width 1s ease-in-out';
        progress.style.width = width;
      }, 500);
    });
  }

  // Utility Functions
  function setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (loading) {
      button.disabled = true;
      btnText.style.opacity = '0.5';
      btnLoading.classList.add('show');
    } else {
      button.disabled = false;
      btnText.style.opacity = '1';
      btnLoading.classList.remove('show');
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && avatarModal.classList.contains('show')) {
      closeAvatarModal();
    }
  }

  // Inicializar
  init();
});

// Função de notificação (global)
function showNotification(message, type = 'info') {
  // Remover notificações existentes
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  // Estilos da notificação
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--dark-light);
    color: var(--light);
    padding: 16px 20px;
    border-radius: 12px;
    border-left: 4px solid var(--purple-1);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
    border: 1px solid rgba(139, 92, 246, 0.2);
  `;

  if (type === 'success') notification.style.borderLeftColor = 'var(--purple-1)';
  if (type === 'error') notification.style.borderLeftColor = '#EF4444';
  if (type === 'warning') notification.style.borderLeftColor = '#F59E0B';

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-weight: bold; font-size: 16px;">${icons[type] || icons.info}</span>
      <span style="flex: 1; font-size: 14px;">${message}</span>
      <button class="notification-close" style="background: none; border: none; color: var(--gray-light); cursor: pointer; padding: 4px; border-radius: 4px;">&times;</button>
    </div>
  `;

  document.body.appendChild(notification);
  
  // Animação de entrada
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  
  // Event listener para fechar
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  });
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(139, 92, 246, 0.1)';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
  });
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}