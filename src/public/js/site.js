// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      menu.classList.toggle('active');
    });
  }
  
  // Fechar menu ao clicar em um link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
    });
  });
  
  // Carousel do hero
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const heroTrack = document.querySelector('.hero-track');
  
  if (carouselDots.length && heroTrack) {
    carouselDots.forEach(dot => {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        
        // Atualizar dots ativos
        carouselDots.forEach(d => d.classList.remove('active'));
        this.classList.add('active');
        
        // Mover carousel
        heroTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
      });
    });
    
    // Auto-rotate carousel
    let currentSlide = 0;
    setInterval(() => {
      currentSlide = (currentSlide + 1) % carouselDots.length;
      
      carouselDots.forEach(d => d.classList.remove('active'));
      carouselDots[currentSlide].classList.add('active');
      
      heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 5000);
  }
  
  // Scroll suave para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});