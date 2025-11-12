// Sistema de Mensagens - Funcional
class MessageSystem {
  constructor() {
    this.currentConversation = null;
    this.currentUser = null;
    this.isTyping = false;
    this.conversations = [
      {
        id: '1',
        user: 'Maria Silva',
        preview: 'Precisamos ajustar o briefing do projeto...',
        time: '10:30',
        unread: 2,
        online: true
      },
      {
        id: '2', 
        user: 'João Santos',
        preview: 'Os designs estão prontos para revisão',
        time: 'Ontem',
        unread: 0,
        online: false
      },
      {
        id: '3',
        user: 'Ana Costa',
        preview: 'Copy aprovado para a campanha',
        time: 'Seg',
        unread: 0,
        online: true
      },
      {
        id: '4',
        user: 'Equipe FlowUp',
        preview: 'Atualização do sistema disponível',
        time: 'Sex',
        unread: 0,
        online: true
      },
      {
        id: '5',
        user: 'Carlos Mendes',
        preview: 'Reunião confirmada para amanhã',
        time: 'Qui',
        unread: 0,
        online: false
      }
    ];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderConversations();
    console.log('Sistema de mensagens inicializado');
  }

  bindEvents() {
    // Modal nova mensagem
    document.getElementById('newMessageBtn').addEventListener('click', () => this.openNewMessageModal());
    document.getElementById('newMessageModalClose').addEventListener('click', () => this.closeNewMessageModal());
    document.getElementById('newMessageCancelBtn').addEventListener('click', () => this.closeNewMessageModal());
    document.getElementById('newMessageSendBtn').addEventListener('click', () => this.sendNewMessage());
    
    // Modal nova empresa
    document.getElementById('addCompanyBtn').addEventListener('click', () => this.openNewCompanyModal());
    document.getElementById('newCompanyModalClose').addEventListener('click', () => this.closeNewCompanyModal());
    document.getElementById('newCompanyCancelBtn').addEventListener('click', () => this.closeNewCompanyModal());
    document.getElementById('newCompanySaveBtn').addEventListener('click', () => this.saveNewCompany());
    
    // Chat
    document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Busca
    document.getElementById('conversationSearch').addEventListener('input', (e) => this.searchConversations(e.target.value));

    // Fechar modais ao clicar fora
    document.getElementById('newMessageModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeNewMessageModal();
    });
    
    document.getElementById('newCompanyModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeNewCompanyModal();
    });
  }

  renderConversations() {
    const container = document.getElementById('conversationsList');
    container.innerHTML = '';

    this.conversations.forEach(conversation => {
      const conversationElement = document.createElement('div');
      conversationElement.className = 'conversation';
      conversationElement.setAttribute('data-conversation', conversation.id);
      conversationElement.setAttribute('data-user', conversation.user);
      
      conversationElement.innerHTML = `
        <div class="conversation-avatar"></div>
        <div class="conversation-info">
          <div class="conversation-header">
            <div class="conversation-name">${conversation.user}</div>
            <div class="conversation-time">${conversation.time}</div>
          </div>
          <div class="conversation-preview">${conversation.preview}</div>
          ${conversation.unread > 0 ? `<div class="conversation-badge">${conversation.unread}</div>` : ''}
        </div>
      `;

      conversationElement.addEventListener('click', () => this.selectConversation(conversation));
      container.appendChild(conversationElement);
    });
  }

  selectConversation(conversation) {
    // Remover active de todas as conversas
    document.querySelectorAll('.conversation').forEach(c => c.classList.remove('active'));
    
    // Adicionar active na conversa selecionada
    const conversationElement = document.querySelector(`[data-conversation="${conversation.id}"]`);
    if (conversationElement) {
      conversationElement.classList.add('active');
    }

    // Atualizar estado atual
    this.currentConversation = conversation.id;
    this.currentUser = conversation.user;

    // Mostrar área de chat
    this.showChatArea();
    
    // Atualizar header do chat
    document.getElementById('currentUserName').textContent = conversation.user;
    document.getElementById('currentUserStatus').textContent = conversation.online ? 'Online' : 'Offline';
    document.getElementById('currentUserStatus').className = `chat-user-status ${conversation.online ? '' : 'offline'}`;

    // Carregar mensagens
    this.loadMessages(conversation.id);
    
    // Remover badge de não lidas
    if (conversation.unread > 0) {
      conversation.unread = 0;
      this.renderConversations();
    }

    console.log('Conversa selecionada:', conversation.user);
  }

  showChatArea() {
    document.getElementById('noConversation').style.display = 'none';
    document.getElementById('chatContent').style.display = 'flex';
  }

  hideChatArea() {
    document.getElementById('noConversation').style.display = 'flex';
    document.getElementById('chatContent').style.display = 'none';
  }

  loadMessages(conversationId) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Mostrar loading
    chatMessages.innerHTML = this.createLoadingState();
    
    // Simular carregamento
    setTimeout(() => {
      const messages = this.getConversationMessages(conversationId);
      this.renderMessages(messages);
      this.scrollToBottom();
    }, 500);
  }

  createLoadingState() {
    return `
      <div class="message-loading">
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div class="loading-text">Carregando mensagens...</div>
      </div>
    `;
  }

  getConversationMessages(conversationId) {
    const messagesData = {
      '1': [
        { type: 'received', text: 'Olá Alone, tudo bem?', time: '10:15' },
        { type: 'received', text: 'Precisamos ajustar o briefing do projeto Verão. Podemos conversar?', time: '10:16' },
        { type: 'sent', text: 'Oi Maria! Tudo ótimo, e com você?', time: '10:28' },
        { type: 'sent', text: 'Claro, quais ajustes você sugere?', time: '10:29' },
        { type: 'received', text: 'Acho que precisamos reforçar mais o público-alvo jovem. O que você acha?', time: '10:30' },
        { type: 'sent', text: 'Concordo plenamente! Vou revisar o briefing e trazer algumas ideias.', time: '10:31' },
        { type: 'received', text: 'Perfeito! Podemos marcar uma call amanhã para alinhar os detalhes?', time: '10:32' }
      ],
      '2': [
        { type: 'received', text: 'Alone, os designs do projeto Verão estão prontos!', time: '14:20' },
        { type: 'received', text: 'Preciso que você dê uma olhada antes de enviar para o cliente.', time: '14:21' },
        { type: 'sent', text: 'Ótimo! Pode enviar os arquivos?', time: '14:35' },
        { type: 'received', text: 'Já enviei por email. Vou mandar o link do Figma também.', time: '14:36' }
      ],
      '3': [
        { type: 'received', text: 'Boa tarde! O copy da campanha foi aprovado pelo cliente.', time: '11:15' },
        { type: 'sent', text: 'Que ótima notícia! Vamos começar a produção então.', time: '11:20' },
        { type: 'received', text: 'Sim! Preciso que você revise os textos finais antes de publicar.', time: '11:21' }
      ],
      '4': [
        { type: 'received', text: 'Olá! Temos uma nova atualização do sistema disponível.', time: '09:00' },
        { type: 'received', text: 'Incluímos novas funcionalidades de relatórios e melhorias de performance.', time: '09:01' },
        { type: 'sent', text: 'Ótimo! Quando posso atualizar?', time: '09:15' }
      ],
      '5': [
        { type: 'received', text: 'Alone, confirmando nossa reunião para amanhã às 14h.', time: '16:45' },
        { type: 'sent', text: 'Perfeito! Estarei lá. Vamos discutir o planejamento do próximo trimestre.', time: '16:50' }
      ]
    };
    
    return messagesData[conversationId] || [];
  }

  renderMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    messages.forEach((message, index) => {
      const messageElement = this.createMessageElement(message);
      messageElement.style.animationDelay = `${index * 0.1}s`;
      chatMessages.appendChild(messageElement);
    });
  }

  createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    
    if (message.type === 'received') {
      messageElement.innerHTML = `
        <div class="message-avatar"></div>
        <div class="message-content">
          <div class="message-text">${message.text}</div>
          <div class="message-time">${message.time}</div>
        </div>
      `;
    } else {
      messageElement.innerHTML = `
        <div class="message-content">
          <div class="message-text">${message.text}</div>
          <div class="message-time">${message.time}</div>
          <div class="message-status">
            <span class="status-check"></span> Entregue
          </div>
        </div>
      `;
    }
    
    return messageElement;
  }

  sendMessage() {
    if (!this.currentConversation) {
      this.showNotification('Selecione uma conversa primeiro', 'error');
      return;
    }

    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
      this.showInputError('Digite uma mensagem antes de enviar');
      return;
    }
    
    if (message.length > 1000) {
      this.showInputError('Mensagem muito longa (máx. 1000 caracteres)');
      return;
    }
    
    // Adicionar mensagem ao chat
    this.addMessageToChat(message, 'sent');
    messageInput.value = '';
    
    // Simular resposta
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.simulateReply();
    }, 2000 + Math.random() * 2000);
  }

  addMessageToChat(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = this.createMessageElement({
      type,
      text,
      time: this.getCurrentTime(),
      status: type === 'sent' ? 'sending' : null
    });
    
    // Animação de entrada
    messageElement.style.opacity = '0';
    messageElement.style.transform = type === 'sent' ? 'translateX(20px)' : 'translateX(-20px)';
    
    chatMessages.appendChild(messageElement);
    
    // Animar entrada
    setTimeout(() => {
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'translateX(0)';
    }, 50);
    
    this.scrollToBottom();
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const chatMessages = document.getElementById('chatMessages');
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
      <div class="message-avatar"></div>
      <div class="message-content">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
        <div class="typing-text">${this.currentUser} está digitando...</div>
      </div>
    `;
    
    chatMessages.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
      typingElement.style.opacity = '0';
      setTimeout(() => typingElement.remove(), 300);
    }
  }

  simulateReply() {
    const replies = {
      'Maria Silva': [
        "Entendi, vou verificar isso.",
        "Perfeito! Obrigada pelo retorno.",
        "Podemos marcar uma reunião para discutir?",
        "Já estou trabalhando nisso."
      ],
      'João Santos': [
        "Certo, vou ajustar os designs.",
        "Ótimo feedback! Vou fazer as alterações.",
        "Pode revisar novamente amanhã?"
      ],
      'Ana Costa': [
        "Perfeito! Vou preparar os textos.",
        "Obrigada pela rápida resposta!",
        "Vou enviar a versão final hoje."
      ],
      'Equipe FlowUp': [
        "A atualização está disponível agora!",
        "Tem alguma dúvida sobre as novas funcionalidades?"
      ],
      'Carlos Mendes': [
        "Confirmado! Te vejo amanhã.",
        "Levarei os documentos necessários."
      ]
    };
    
    const userReplies = replies[this.currentUser] || ["Obrigada pelo retorno!"];
    const randomReply = userReplies[Math.floor(Math.random() * userReplies.length)];
    
    this.addMessageToChat(randomReply, 'received');
  }

  // Modal Nova Mensagem
  openNewMessageModal() {
    document.getElementById('newMessageModal').classList.add('show');
  }

  closeNewMessageModal() {
    document.getElementById('newMessageModal').classList.remove('show');
    document.getElementById('recipient').value = '';
    document.getElementById('newMessage').value = '';
  }

  sendNewMessage() {
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('newMessage').value.trim();
    
    if (!recipient || !message) {
      this.showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    this.closeNewMessageModal();
    this.showNotification('Mensagem enviada com sucesso!', 'success');
    
    // Aqui você pode adicionar a lógica para realmente enviar a mensagem
    console.log('Nova mensagem:', { recipient, message });
  }

  // Modal Nova Empresa
  openNewCompanyModal() {
    document.getElementById('newCompanyModal').classList.add('show');
  }

  closeNewCompanyModal() {
    document.getElementById('newCompanyModal').classList.remove('show');
    document.getElementById('companyName').value = '';
    document.getElementById('companyEmail').value = '';
    document.getElementById('companyIndustry').value = '';
  }

  saveNewCompany() {
    const name = document.getElementById('companyName').value.trim();
    const email = document.getElementById('companyEmail').value.trim();
    const industry = document.getElementById('companyIndustry').value;
    
    if (!name || !email || !industry) {
      this.showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    // Adicionar nova empresa à lista
    this.addNewCompany(name);
    
    this.closeNewCompanyModal();
    this.showNotification('Empresa cadastrada com sucesso!', 'success');
  }

  addNewCompany(name) {
    // Adicionar à lista de empresas no dropdown
    const selectItems = document.querySelector('.select-items');
    const newOption = document.createElement('div');
    newOption.className = 'select-option';
    newOption.setAttribute('data-value', name);
    newOption.innerHTML = `
      <div class="option-avatar"></div>
      <span>${name}</span>
    `;
    
    // Inserir antes do divisor
    const divider = selectItems.querySelector('.select-divider');
    selectItems.insertBefore(newOption, divider);
    
    console.log('Nova empresa adicionada:', name);
  }

  // Busca
  searchConversations(searchTerm) {
    const conversations = document.querySelectorAll('.conversation');
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    conversations.forEach(conversation => {
      const name = conversation.querySelector('.conversation-name').textContent.toLowerCase();
      const preview = conversation.querySelector('.conversation-preview').textContent.toLowerCase();
      const isVisible = name.includes(normalizedSearch) || preview.includes(normalizedSearch);
      
      conversation.style.display = isVisible ? 'flex' : 'none';
    });
  }

  // Utilitários
  showInputError(message) {
    const inputContainer = document.querySelector('.chat-input');
    inputContainer.style.borderColor = '#ef4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    
    const existingError = inputContainer.querySelector('.input-error');
    if (existingError) existingError.remove();
    
    inputContainer.appendChild(errorElement);
    
    setTimeout(() => {
      inputContainer.style.borderColor = 'var(--line)';
      errorElement.remove();
    }, 3000);
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 16px;
      z-index: 10000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="font-size: 16px; margin-top: 2px;">${icons[type] || icons.info}</div>
        <div style="flex: 1;">
          <div style="font-size: 14px; line-height: 1.4; color: var(--text);">${message}</div>
        </div>
        <button class="notification-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--muted); padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">&times;</button>
      </div>
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
}

// Inicializar o sistema
document.addEventListener('DOMContentLoaded', () => {
  window.messageSystem = new MessageSystem();
});