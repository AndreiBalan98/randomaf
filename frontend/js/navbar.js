window.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const Btn = document.getElementById('Btn');
  const mainDiv = document.querySelector('div[style^="margin-left"]');
  // Functii pentru meniu
  function hideMenuAndExpandContent() {
    navbar.style.display = 'none';
    if(mainDiv) {
      mainDiv.style.marginLeft = '0';
      mainDiv.style.transition = 'margin-left 0.3s';
    }
  }

  function showMenuAndShrinkContent() {
    navbar.style.display = 'block';
    if(mainDiv) {
      mainDiv.style.marginLeft = '15%';
      mainDiv.style.transition = 'margin-left 0.3s';
    }
  }

  // Click pe Home
  Btn.addEventListener('click', function(e) {
    e.preventDefault();
    hideMenuAndExpandContent();
  });

  // Toggle pe butonul de meniu
  let menuVisible = true;
  menuBtn.addEventListener('click', function() {
    if (navbar.style.display === 'none') {
      showMenuAndShrinkContent();
    } else {
      hideMenuAndExpandContent();
    }
  });

  window.addEventListener('hashchange', function() {
  document.querySelectorAll('nav li a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === window.location.hash);
  });
});

// La încărcare, setează activul corect
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('nav li a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === window.location.hash);
  });
});
});