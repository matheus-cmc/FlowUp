// Script para selecionar dias no calendário
document.addEventListener('DOMContentLoaded', function() {
  const weekDays = document.querySelectorAll('.week-day:not(.empty)');
  const dayDetails = document.getElementById('dayDetails');
  
  weekDays.forEach(day => {
    day.addEventListener('click', function() {
      // Remove seleção anterior
      weekDays.forEach(d => d.classList.remove('selected'));
      
      // Adiciona seleção atual
      this.classList.add('selected');
      
      // Atualiza detalhes do dia (simulação)
      const dayNumber = this.getAttribute('data-day');
      updateDayDetails(dayNumber);
    });
  });

  function updateDayDetails(dayNumber) {
    const detailsDate = dayDetails.querySelector('.details-date');
    const detailsDay = dayDetails.querySelector('.details-day');
    const summaryCount = dayDetails.querySelector('.summary-count');
    
    // Simulação de dados - na prática viria de uma API
    const dayData = {
      '15': {
        date: '15 de Janeiro de 2024',
        day: 'Segunda-feira',
        posts: 3
      },
      '16': {
        date: '16 de Janeiro de 2024', 
        day: 'Terça-feira',
        posts: 2
      },
      '17': {
        date: '17 de Janeiro de 2024',
        day: 'Quarta-feira', 
        posts: 1
      }
    };

    const data = dayData[dayNumber] || {
      date: `${dayNumber} de Janeiro de 2024`,
      day: 'Dia da semana',
      posts: 0
    };

    detailsDate.textContent = data.date;
    detailsDay.textContent = data.day;
    summaryCount.textContent = data.posts;
  }

  // Inicializa com o dia atual selecionado
  const todayElement = document.querySelector('.week-day.today');
  if (todayElement) {
    todayElement.classList.add('selected');
    const todayNumber = todayElement.getAttribute('data-day');
    updateDayDetails(todayNumber);
  }
});