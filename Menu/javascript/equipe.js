document.addEventListener('DOMContentLoaded', function() {
    const membersGrid = document.getElementById('membersGrid');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const sendInviteBtn = document.getElementById('sendInviteBtn');
    
    // Membros iniciais da equipe
    const initialMembers = [
        {
            name: 'Maria Silva',
            role: 'Editor',
            email: 'maria.silva@empresa.com',
            phone: '(11) 99999-9999',
            days: ['seg', 'ter', 'qua', 'qui', 'sex'],
            hours: 'integral',
            permissions: ['create_post', 'edit_post']
        },
        {
            name: 'João Santos',
            role: 'Designer',
            email: 'joao.santos@empresa.com',
            phone: '(11) 98888-8888',
            days: ['seg', 'ter', 'qua', 'qui', 'sex'],
            hours: 'manha',
            permissions: ['create_post']
        },
        {
            name: 'Ana Costa',
            role: 'Revisor',
            email: 'ana.costa@empresa.com',
            phone: '(11) 97777-7777',
            days: ['seg', 'qua', 'sex'],
            hours: 'tarde',
            permissions: ['approve_post']
        }
    ];

    // Função para criar card de membro
    function createMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-header">
                <div class="member-avatar">${member.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">${member.role}</div>
                </div>
            </div>
            <div class="member-details">
                <div class="member-detail">
                    <span class="icon">📧</span>
                    <span>${member.email}</span>
                </div>
                <div class="member-detail">
                    <span class="icon">📞</span>
                    <span>${member.phone}</span>
                </div>
                <div class="member-detail">
                    <span class="icon">📅</span>
                    <span>${getDaysText(member.days)}</span>
                </div>
                <div class="member-detail">
                    <span class="icon">⏰</span>
                    <span>${getHoursText(member.hours)}</span>
                </div>
            </div>
            <div class="member-actions">
                <button class="btn-remove" onclick="removeMember(this)">Remover</button>
            </div>
        `;
        return card;
    }

    // Função para obter texto dos dias
    function getDaysText(days) {
        const daysMap = {
            'seg': 'Segunda',
            'ter': 'Terça',
            'qua': 'Quarta',
            'qui': 'Quinta',
            'sex': 'Sexta',
            'sab': 'Sábado',
            'dom': 'Domingo'
        };
        return days.map(day => daysMap[day]).join(', ');
    }

    // Função para obter texto do horário
    function getHoursText(hours) {
        const hoursMap = {
            'manha': 'Manhã (08:00 - 12:00)',
            'tarde': 'Tarde (13:00 - 17:00)',
            'noite': 'Noite (18:00 - 22:00)',
            'integral': 'Integral (08:00 - 18:00)',
            'flexivel': 'Horário Flexível'
        };
        return hoursMap[hours] || hours;
    }

    // Função para adicionar membro
    function addMember() {
        const name = document.getElementById('memberName').value.trim();
        const role = document.getElementById('memberRole').value;
        const email = document.getElementById('memberEmail').value.trim();
        const phone = document.getElementById('memberPhone').value.trim();
        const hours = document.getElementById('workHours').value;
        
        // Obter dias selecionados
        const days = Array.from(document.querySelectorAll('input[name="days"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Obter permissões selecionadas
        const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked'))
            .map(checkbox => checkbox.value);

        // Validação
        if (!name || !role || !email || !phone || !hours || days.length === 0) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        const newMember = {
            name,
            role,
            email,
            phone,
            days,
            hours,
            permissions
        };

        const memberCard = createMemberCard(newMember);
        membersGrid.appendChild(memberCard);

        // Limpar formulário
        document.getElementById('memberName').value = '';
        document.getElementById('memberRole').value = '';
        document.getElementById('memberEmail').value = '';
        document.getElementById('memberPhone').value = '';
        document.getElementById('workHours').value = '';
        document.querySelectorAll('input[name="days"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('input[name="permissions"]').forEach(checkbox => checkbox.checked = false);

        showNotification('Membro adicionado com sucesso!', 'success');
    }

    // Função para enviar convite
    function sendInvite() {
        const email = document.getElementById('inviteEmail').value.trim();
        const role = document.getElementById('inviteRole').value;

        if (!email || !role) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Simular envio de convite
        setTimeout(() => {
            showNotification(`Convite enviado para ${email} como ${role}`, 'success');
            document.getElementById('inviteEmail').value = '';
            document.getElementById('inviteRole').value = '';
        }, 1000);
    }

    // Função para remover membro
    window.removeMember = function(button) {
        const card = button.closest('.member-card');
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.remove();
            showNotification('Membro removido da equipe!', 'success');
        }, 300);
    }

    // Função para mostrar notificações
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Event Listeners
    addMemberBtn.addEventListener('click', addMember);
    sendInviteBtn.addEventListener('click', sendInvite);

    // Carregar membros iniciais
    initialMembers.forEach((member, index) => {
        setTimeout(() => {
            const memberCard = createMemberCard(member);
            membersGrid.appendChild(memberCard);
        }, index * 200);
    });

    // Efeitos de foco nos inputs
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});