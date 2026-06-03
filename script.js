// 1. LOGIKA SMART HIDDEN NAVBAR (EFEK PUDAR SAAT SCROLL)
let lastScrollTop = 0;
const navbar = document.getElementById('main-nav');

window.addEventListener('scroll', function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  if (currentScroll > 80) {
    if (currentScroll > lastScrollTop) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
  } else {
    navbar.classList.remove('nav-hidden');
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

// 2. LOGIKA BUKA/TUTUP HAMBURGER MENU (MOBILE)
const menuToggle = document.getElementById('mobile-menu');
const navOverlay = document.getElementById('nav-overlay');
const closeMenu = document.getElementById('close-menu');
const overlayLinks = document.querySelectorAll('.overlay-links a');

menuToggle.addEventListener('click', () => {
  navOverlay.classList.add('open');
});

closeMenu.addEventListener('click', () => {
  navOverlay.classList.remove('open');
});

overlayLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Hanya menutup otomatis jika sedang dalam mode HP (lebar tirai aktif)
    if (window.innerWidth <= 768) {
      navOverlay.classList.remove('open');
    }
  });
});
