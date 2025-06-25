// Elemente DOM
let navbar = null;
let menuBtn = null;
let mainDiv = null;

// Incarcare continut dinamic cu istoric
function loadContent(file, push = true) {
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

      // Adauga in istoric daca e nevoie
      if (push) {
        history.pushState({ file }, '', '#' + file);
      }
    })
    .catch(err => console.error("Eroare la incarcarea fisierului:", err));
}

// Modifica checkAuthAndLoad sa transmita push=false la back/forward
async function checkAuthAndLoad(file, push = true) {
  const protectedPages = ['add-imobile.html', 'favorites.html', 'profile.html'];
  const needsAuth = protectedPages.some(page => file.includes(page));
  if (needsAuth) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/current-user', {
        method: 'GET',
        credentials: 'include'
      });
      const result = await response.json();
      if (!result.success || !result.user) {
        loadContent('html/auth.html', push);
        return;
      }
      sessionStorage.setItem('currentUser', JSON.stringify(result.user));
      loadContent(file, push);
    } catch (error) {
      console.error('Eroare verificare auth:', error);
      loadContent('html/auth.html', push);
    }
  } else {
    loadContent(file, push);
  }
}

// La incarcare, incarca din hash daca exista
window.addEventListener('DOMContentLoaded', function() {
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

  // Incarca pagina din hash daca exista
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    if (hash.includes('add-imobile.html') || hash.includes('favorites.html') || hash.includes('profile.html')) {
      checkAuthAndLoad(hash, false);
    } else {
      loadContent(hash, false);
    }
  } else {
    loadContent('html/home.html', false);
  }
});


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

// La incarcare, incarca din hash daca exista
window.addEventListener('DOMContentLoaded', function() {
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

  // Incarca pagina din hash daca exista
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    if (hash.includes('add-imobile.html') || hash.includes('favorites.html') || hash.includes('profile.html')) {
      checkAuthAndLoad(hash, false);
    } else {
      loadContent(hash, false);
    }
  } else {
    loadContent('html/home.html', false);
  }
});

// Navigare cu back/forward in browser
window.onpopstate = function(event) {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    if (hash.includes('add-imobile.html') || hash.includes('favorites.html') || hash.includes('profile.html')) {
      checkAuthAndLoad(hash, false);
    } else {
      loadContent(hash, false);
    }
  } else {
    loadContent('html/home.html', false);
  }
};


window.loadContent = loadContent;
window.checkAuthAndLoad = checkAuthAndLoad;