// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      menu.classList.toggle('active');
      const icon = this.querySelector('i');
      if (menu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Fechar menu ao clicar em um link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
      mobileMenuBtn.querySelector('i').classList.remove('fa-times');
      mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    });
  });
  
  // Carousel do Hero
  const carouselTrack = document.querySelector('.hero-track');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.hero-frame').length;
  
  function goToSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    carouselTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Atualizar dots
    carouselDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === slideIndex);
    });
    
    currentSlide = slideIndex;
  }
  
  // Adicionar eventos aos dots
  carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });
  
  // Auto-play do carousel
  let carouselInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
  
  // Pausar auto-play ao passar o mouse
  const heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    heroCarousel.addEventListener('mouseenter', () => {
      clearInterval(carouselInterval);
    });
    
    heroCarousel.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000);
    });
  }
  
  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Animação de entrada para elementos
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observar elementos para animação
  document.querySelectorAll('.step-card, .feature-card, .segment-card, .panel-card').forEach(el => {
    observer.observe(el);
  });
});