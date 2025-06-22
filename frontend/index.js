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
    .catch(err => console.error("Eroare la încărcarea fișierului:", err));
}

// Verifică autentificarea și redirectează dacă e necesar
async function checkAuthAndLoad(file) {
  // Paginile care necesită autentificare
  const protectedPages = ['add-imobile.html', 'favorites.html', 'profile.html'];
  
  // Verifică dacă pagina necesită autentificare
  const needsAuth = protectedPages.some(page => file.includes(page));
  
  if (needsAuth) {
    // Verifică dacă user-ul este conectat
    try {
      const response = await fetch('http://localhost:3001/api/auth/current-user', {
        method: 'GET',
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (!result.success || !result.user) {
        // Nu este conectat, încarcă pagina de auth
        loadContent('html/auth.html');
        return;
      }
      
      // Este conectat, salvează user-ul și încarcă pagina
      sessionStorage.setItem('currentUser', JSON.stringify(result.user));
      loadContent(file);
    } catch (error) {
      console.error('Eroare verificare auth:', error);
      loadContent('html/auth.html');
    }
  } else {
    // Pagina nu necesită autentificare
    loadContent(file);
  }
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
  
  loadContent('html/home.html');
});

window.loadContent = loadContent;
window.checkAuthAndLoad = checkAuthAndLoad;