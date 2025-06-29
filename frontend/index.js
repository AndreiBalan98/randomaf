let navbar = null;
let menuBtn = null;
let mainDiv = null;

function loadContent(file, push = true) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;

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

      if (push) {
        history.pushState({ file }, '', '#' + file);
      }
    })
    .catch(err => console.error("Eroare la incarcarea fisierului:", err));
}

async function checkAuthAndLoad(file, push = true) {
  const protectedPages = ['add-imobile.html', 'favorites.html', 'profile.html'];
  const needsAuth = protectedPages.some(page => file.includes(page));
  if (needsAuth) {
    try {
      const response = await fetch(BACKEND_URL + API_AUTH_CURRENT_USER, {
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


let menuOpen = window.innerWidth > 768;
let menuOverlay = null;

function showMenuAndShrinkContent() {
  if (window.innerWidth <= 768) {

    const navUl = navbar.querySelector('ul');
    navUl.classList.add('show');
    
    if (!menuOverlay) {
      menuOverlay = document.createElement('div');
      menuOverlay.className = 'menu-overlay';
      document.body.appendChild(menuOverlay);
      
      menuOverlay.addEventListener('click', hideMenuAndExpandContent);
    }
    menuOverlay.classList.add('show');
  } else {
    navbar.style.display = 'block';
    if(mainDiv) {
      mainDiv.style.marginLeft = '15%';
      mainDiv.style.transition = 'margin-left 0.3s';
    }
  }
  menuOpen = true;
}

function hideMenuAndExpandContent() {
  if (window.innerWidth <= 768) {
    const navUl = navbar.querySelector('ul');
    navUl.classList.remove('show');
    if (menuOverlay) {
      menuOverlay.classList.remove('show');
    }
  } else {
    navbar.style.display = 'none';
    if(mainDiv) {
      mainDiv.style.marginLeft = '0';
      mainDiv.style.transition = 'margin-left 0.3s';
    }
  }
  menuOpen = false;
}

function toggleMenu() {
  if (!menuOpen) {
    showMenuAndShrinkContent();
  } else {
    hideMenuAndExpandContent();
  }
}

function activateNavLink(clickedLink) {
  document.querySelectorAll('nav li a').forEach(l => l.classList.remove('active'));
  clickedLink.classList.add('active');

  if (window.innerWidth <= 768) {
    hideMenuAndExpandContent();
  }
}

function initializeMenuState() {
  const navUl = navbar.querySelector('ul');
  if (window.innerWidth > 768) {
    navbar.style.display = 'block';
    navUl.classList.remove('show');
    if (menuOverlay) {
      menuOverlay.classList.remove('show');
    }
    menuOpen = true;
  } else {
    navbar.style.display = 'block';
    navUl.classList.remove('show');
    if (menuOverlay) {
      menuOverlay.classList.remove('show');
    }
    menuOpen = false;
  }
}

function handleResize() {
  const navUl = navbar.querySelector('ul');
  if (window.innerWidth > 768) {
    navbar.style.display = 'block';
    navUl.classList.remove('show');
    if (menuOverlay) {
      menuOverlay.classList.remove('show');
    }
    if(mainDiv) {
      mainDiv.style.marginLeft = '15%';
    }
    menuOpen = true;
  } else {
    navbar.style.display = 'block';
    navUl.classList.remove('show');
    if (menuOverlay) {
      menuOverlay.classList.remove('show');
    }
    if(mainDiv) {
      mainDiv.style.marginLeft = '0';
    }
    menuOpen = false;
  }
}

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