/**
 * Mobile menu functionality for betting site
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile script loaded');
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  
  console.log('Menu elements:', { 
    mobileMenuToggle: mobileMenuToggle, 
    nav: nav 
  });
  
  if (mobileMenuToggle && nav) {
    console.log('Adding click listener to mobile menu toggle');
    
    mobileMenuToggle.addEventListener('click', function(e) {
      console.log('Mobile menu toggle clicked');
      e.stopPropagation(); // Предотвращаем всплытие события
      this.classList.toggle('mobile-menu-toggle--active');
      nav.classList.toggle('nav--active');
    });
  } else {
    console.warn('Mobile menu elements not found');
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (nav && nav.classList.contains('nav--active') && 
        !nav.contains(event.target) && 
        !mobileMenuToggle.contains(event.target)) {
      console.log('Closing mobile menu (outside click)');
      nav.classList.remove('nav--active');
      mobileMenuToggle.classList.remove('mobile-menu-toggle--active');
    }
  });

  // Bet slip functionality for mobile
  const betSlipHeader = document.querySelector('.bet-slip__header');
  const betSlip = document.querySelector('.bet-slip');
  
  if (betSlipHeader && betSlip) {
    betSlipHeader.addEventListener('click', function() {
      betSlip.classList.toggle('bet-slip--expanded');
    });
  }

  // Handle form layout
  function setupMobileFormLayout() {
    const formGroups = document.querySelectorAll('.form-group');
    const isMobile = window.innerWidth <= 1024;
    
    formGroups.forEach(group => {
      const label = group.querySelector('label');
      const input = group.querySelector('.form-input');
      
      if (label && input) {
        // For mobile - stack label above input
        if (isMobile && !group.classList.contains('mobile-layout')) {
          group.classList.add('mobile-layout');
        } 
        // For desktop - revert to original layout if needed
        else if (!isMobile && group.classList.contains('mobile-layout')) {
          group.classList.remove('mobile-layout');
        }
      }
    });
  }

  // Run on load and resize
  setupMobileFormLayout();
  window.addEventListener('resize', setupMobileFormLayout);
  
  // Вывести информацию о текущем размере экрана
  console.log('Window width:', window.innerWidth, 'Mobile breakpoint:', 1024);
}); 