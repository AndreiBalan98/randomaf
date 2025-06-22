// Elemente DOM
let navbar = null;
let menuBtn = null;
let mainDiv = null;

// Incarcare continut dinamic
function loadContent(file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;

      // Executa initializarea dupa incarcarea HTML-ului
      if (file.includes('home.html')) {
        initializeHome();
      }
      if (file.includes('map.html')) {
        initializeMap();
      }
      if (file.includes('add-imobile.html')) {
        initializeAdd();
      }
      if (file.includes('auth.html')) {
        initializeAuthentication();
      }
      if (file.includes('profile.html')) {
        initializeProfile();
      }
      if (file.includes('favorites.html')) {
        initializeFavorites();
      }
    })
    .catch(err => console.error("Eroare la incarcarea fisierului:", err));
}

// Verifica autentificarea si redirecteaza daca e necesar
async function checkAuthAndLoad(file) {
  // Paginile care necesita autentificare
  const protectedPages = ['add-imobile.html', 'favorites.html', 'profile.html'];
  
  // Verifica daca pagina necesita autentificare
  const needsAuth = protectedPages.some(page => file.includes(page));
  
  if (needsAuth) {
    // Verifica daca user-ul este conectat
    try {
      const response = await fetch(CONFIG.getBackendUrl('/api/auth/current-user'), {
        method: 'GET',
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (!result.success || !result.user) {
        // Nu este conectat, incarca pagina de auth
        loadContent('html/auth.html');
        return;
      }
      
      // Este conectat, salveaza user-ul si incarca pagina
      sessionStorage.setItem('currentUser', JSON.stringify(result.user));
      loadContent(file);
    } catch (error) {
      console.error('Eroare verificare auth:', error);
      loadContent('html/auth.html');
    }
  } else {
    // Pagina nu necesita autentificare
    loadContent(file);
  }
}

// Ascunde meniu si extinde continut
function hideMenuAndExpandContent() {
  navbar.style.display = 'none';
  if(mainDiv) {
    mainDiv.style.marginLeft = '0';
    mainDiv.style.transition = 'margin-left 0.3s';
  }
}

// Afiseaza meniu si restrange continut
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

// Activare link navigatie
function activateNavLink(clickedLink) {
  document.querySelectorAll('nav li a').forEach(l => l.classList.remove('active'));
  clickedLink.classList.add('active');
}

// Initializare stare meniu
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

// Event listeners si initializare
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
  
  loadContent('html/home.html');
});

window.loadContent = loadContent;
window.checkAuthAndLoad = checkAuthAndLoad;