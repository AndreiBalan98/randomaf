// Elemente DOM
let navbar = null;
let menuBtn = null;
let mainDiv = null;

// Încărcare conținut dinamic
function loadContent(file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;

      // Execută inițializarea după încărcarea HTML-ului
      if (file.includes('home.html')) {
        initializeHome();
      }
      // if (file.includes('detalii.html')) { se apeleaza in alta parte, in home.js
      //   initializeDetalii();
      // }
      if (file.includes('map.html')) {
        initializeMap();
      }
      if (file.includes('add-imobile.html')) {
        initializeAdd();
      }
    })
    .catch(err => console.error("Eroare la încărcarea fișierului:", err));
  }

// Ascunde meniu și extinde conținut
function hideMenuAndExpandContent() {
  navbar.style.display = 'none';
  if(mainDiv) {
    mainDiv.style.marginLeft = '0';
    mainDiv.style.transition = 'margin-left 0.3s';
  }
}

// Afișează meniu și restrânge conținut
function showMenuAndShrinkContent() {
  navbar.style.display = 'block';
  if(mainDiv) {
    mainDiv.style.marginLeft = '15%';
    mainDiv.style.transition = 'margin-left 0.3s';
  }
}

// Toggle meniu
function toggleMenu() {
  if (navbar.style.display === 'none') {
    showMenuAndShrinkContent();
  } else {
    hideMenuAndExpandContent();
  }
}

// Activare link navigație
function activateNavLink(clickedLink) {
  document.querySelectorAll('nav li a').forEach(l => l.classList.remove('active'));
  clickedLink.classList.add('active');
}

// Inițializare stare meniu
function initializeMenuState() {
  if (window.innerWidth > 768) {
    showMenuAndShrinkContent();
  } else {
    hideMenuAndExpandContent();
  }
}

// Adaptare redimensionare
function handleResize() {
  if (window.innerWidth > 768) {
    if (navbar.style.display === 'none') {
      showMenuAndShrinkContent();
    }
  } else {
    if (navbar.style.display === 'block') {
      hideMenuAndExpandContent();
    }
  }
}

// Event listeners și inițializare
window.addEventListener('DOMContentLoaded', function() {
  // Elemente DOM
  navbar = document.getElementById('navbar');
  menuBtn = document.getElementById('menuBtn');
  mainDiv = document.getElementById('content');
  
  menuBtn.addEventListener('click', toggleMenu);
  
  document.querySelectorAll('nav li a').forEach(link => {
    link.addEventListener('click', function() {
      activateNavLink(this);
    });
  });
  
  initializeMenuState();
  window.addEventListener('resize', handleResize);
});

window.loadContent = loadContent;