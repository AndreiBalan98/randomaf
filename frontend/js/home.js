// ========================================
// CONSTANTE SI CONFIGURATII
// ========================================

const API_BASE_URL = 'http://localhost:3001';

// Optiuni pentru selectoarele din filtre
const FILTER_OPTIONS = {
  tip: [
    { value: 'apartament', text: 'Apartament' },
    { value: 'casa', text: 'Casa' },
    { value: 'teren', text: 'Teren' },
    { value: 'spatiu_comercial', text: 'Spatii comerciale' }
  ],
  oferta: [
    { value: 'vanzare', text: 'De vanzare' },
    { value: 'inchiriat', text: 'De inchiriat' }
  ]
};

// Straturi disponibile pentru harta
const AVAILABLE_LAYERS = [
  { id: 'poluare', name: 'Poluare' },
  { id: 'aglomeratie', name: 'Aglomeratie' },
  { id: 'jafuri', name: 'Jafuri' },
  { id: 'cost_trai', name: 'Cost mediu de trai' },
  { id: 'temperatura', name: 'Temperatura medie anuala' },
  { id: 'parcari', name: 'Parcari' },
  { id: 'magazine', name: 'Magazine' }
];

// ========================================
// FUNCTII DE INITIALIZARE
// ========================================

/**
 * Initializeaza aplicatia cand DOM-ul este incarcat
 */
function initializeHome() {
  console.log('Initializare aplicatie home...');
  
  // Initializeaza componentele
  initializeFilterSelects();
  initializeLayers();
  initializeLocationFilters();
  initializeFormHandlers();
  
  // Incarca datele
  loadImobileData();
}

/**
 * Initializeaza selectoarele din filtre cu optiuni
 */
function initializeFilterSelects() {
  console.log('Initializare selectoare filtre...');
  
  Object.entries(FILTER_OPTIONS).forEach(([selectName, options]) => {
    const selectElement = document.getElementById(`${selectName}Select`);
    if (selectElement) {
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
      });
    }
  });
}

/**
 * Initializeaza straturile pentru harta
 */
function initializeLayers() {
  console.log('Initializare straturi...');
  
  const layersContainer = document.getElementById('layersContainer');
  if (!layersContainer) return;
  
  layersContainer.innerHTML = '';
  
  AVAILABLE_LAYERS.forEach(layer => {
    const layerHTML = `
      <input type="checkbox" id="${layer.id}" name="${layer.id}" class="layer-checkbox">
      <label for="${layer.id}" class="layer-chip">${layer.name}</label>
    `;
    layersContainer.insertAdjacentHTML('beforeend', layerHTML);
  });
  
  // Adauga event listeners pentru straturi
  layersContainer.addEventListener('change', handleLayerChange);
}

/**
 * Initializeaza filtrele de localizare (oras si localitate)
 */
async function initializeLocationFilters() {
  console.log('Initializare filtre localizare dinamic...');
  const orasSelect = document.getElementById('orasSelect');
  const localitateSelect = document.getElementById('localitateSelect');
  if (!orasSelect || !localitateSelect) return;

  // Populează orașele din backend
  try {
    const oraseResponse = await fetch('http://localhost:3001/api/orase');
    const orase = await oraseResponse.json();
    orasSelect.innerHTML = '<option value="">Alege orasul</option>';
    orase.forEach(oras => {
      const option = document.createElement('option');
      option.value = oras.id;
      option.textContent = oras.nume;
      orasSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Eroare la incarcarea oraselor:', err);
  }

  // La schimbarea orașului, populează localitățile aferente
  orasSelect.addEventListener('change', async function() {
    const selectedOrasId = this.value;
    localitateSelect.innerHTML = '<option value="">Alege localitatea</option>';
    localitateSelect.disabled = true;
    if (selectedOrasId) {
      try {
        const localitatiResponse = await fetch(`http://localhost:3001/api/localitati?oras_id=${selectedOrasId}`);
        const localitati = await localitatiResponse.json();
        localitati.forEach(loc => {
          const option = document.createElement('option');
          option.value = loc.id;
          option.textContent = loc.nume;
          localitateSelect.appendChild(option);
        });
        localitateSelect.disabled = false;
      } catch (err) {
        console.error('Eroare la incarcarea localitatilor:', err);
      }
    }
  });
}

/**
 * Initializeaza gestionarea formularelor
 */
function initializeFormHandlers() {
  console.log('Initializare gestionare formulare...');
  
  const filtersForm = document.getElementById('filtersForm');
  if (filtersForm) {
    filtersForm.addEventListener('submit', handleFormSubmit);
  }
}

// ========================================
// FUNCTII PENTRU GESTIONAREA DATELOR
// ========================================

/**
 * Incarca datele imobilelor de la server
 */
async function loadImobileData(filters = {}) {
  console.log('Incarcare date imobile...');
 
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/api/imobile?${queryParams}`);
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
   
    const imobileData = await response.json();
    console.log(imobileData);
    renderImobileCards(imobileData);
   
  } catch (error) {
    console.error('Eroare la incarcarea imobilelor:', error);
    displayError('Eroare la incarcarea anunturilor!');
  }
}

/**
 * Renderizeaza cardurile de imobile
 */
async function renderImobileCards(imobileData) {
  console.log('Renderizare carduri imobile...', imobileData.length);
  
  const container = document.getElementById('imobileCards');
  if (!container) return;
  
  if (!imobileData || imobileData.length === 0) {
    container.innerHTML = '<p>Nu sunt imobile disponibile.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  // Genereaza cardurile fara verificarea like-ului (se va face in addLikeEventListeners)
  imobileData.forEach((imobil, index) => {
    const cardHTML = createImobilCard(imobil, false); // Mereu false aici
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
  
  // Adauga event listeners pentru butoanele de detalii
  addCardEventListeners(imobileData);
  
  // Adauga event listeners pentru butoanele de like (si verifica statusul)
  await addLikeEventListeners();
}

/**
 * Creeaza HTML-ul pentru un card de imobil
 */
function createImobilCard(imobil, isLiked = false) {
  const imagePath = imobil.imagini && imobil.imagini.length > 0 ? imobil.imagini[0].url : `${API_BASE_URL}/images/casa1.jpg`;
  const price = imobil.pret ? `${imobil.pret} €` : 'Pret la cerere';
  const transactionType = imobil.tip_oferta === 'vanzare' ? 'Vanzare' : 'Inchiriere';
  const surface = imobil.tip_imobil === 'teren' ? 
    (imobil.detalii_specifice?.suprafata_teren || '-') : 
    (imobil.detalii_specifice?.suprafata_utila || '-');
  
  const likeButtonClass = isLiked ? 'imobil-like-btn liked' : 'imobil-like-btn';
  
  return `
    <div class="imobil-card">
      <div class="imobil-card-img" style="background-image:url('${imagePath}');">
        <button class="${likeButtonClass}" title="Favorite" data-anunt-id="${imobil.id}">&#10084;</button>
        <div class="imobil-card-labels">
          <div class="imobil-pret">${price}</div>
          <div class="imobil-tip">${transactionType}</div>
        </div>
      </div>
      <div class="imobil-card-body">
        <div class="imobil-titlu">${imobil.titlu}</div>
        <div class="imobil-locatie">
          <span class="icon-locatie">📍</span>
          ${imobil.localizare}
        </div>
        <div class="imobil-info">
          <span class="imobil-mp">${surface} mp</span>
          <span class="imobil-id">ID: ${imobil.id}</span>
        </div>
        <button class="imobil-detalii-btn" data-id="${imobil.id}">Vezi detalii</button>
      </div>
    </div>
  `;
}

// ========================================
// FUNCTII HELPER
// ========================================

/**
 * Formateaza numele unui oras pentru afisare
 */
function formatCityName(citySlug) {
  return citySlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Actualizeaza selectorul de localitati in functie de orasul selectat
 */
function updateLocalitateSelect(selectedCity, localitateSelect) {
  localitateSelect.innerHTML = '<option value="">Alege localitatea</option>';
  
  if (LOCALITIES_BY_CITY[selectedCity]) {
    LOCALITIES_BY_CITY[selectedCity].forEach(locality => {
      const option = document.createElement('option');
      option.value = locality;
      option.textContent = locality;
      localitateSelect.appendChild(option);
    });
    localitateSelect.disabled = false;
  } else {
    localitateSelect.disabled = true;
  }
}

/**
 * Returneaza textul pentru tipul de tranzactie
 */
function getTransactionTypeText(tranzactie) {
  switch(tranzactie) {
    case 'vanzare':
      return 'De vanzare';
    case 'inchiriat':
      return 'De inchiriat';
    default:
      return '';
  }
}

/**
 * Afiseaza mesaj de eroare
 */
function displayError(message) {
  const container = document.getElementById('imobileCards');
  if (container) {
    container.innerHTML = `<p style="color:red">${message}</p>`;
  }
}

// Functii pentru like
async function toggleLike(anuntId, buttonElement) {
    try {
        const response = await fetch(`http://localhost:3001/api/likes/${anuntId}`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Trebuie sa fii conectat pentru a adauga la favorite!');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Update visual al butonului
        if (result.liked) {
            buttonElement.classList.add('liked');
        } else {
            buttonElement.classList.remove('liked');
        }
        
    } catch (error) {
        console.error('Eroare la toggle like:', error);
    }
}

async function checkLikeStatus(anuntId) {
    try {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!user) {
            return false; // Daca nu e conectat, sigur nu are like
        }
        
        const response = await fetch(`http://localhost:3001/api/likes/${anuntId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.liked;
        }
    } catch (error) {
        console.error('Eroare verificare like:', error);
    }
    return false;
}

// Modifica renderImobileCards pentru a include like listeners
function renderImobileCards(imobileData) {
  console.log('Renderizare carduri imobile...', imobileData.length);
  
  const container = document.getElementById('imobileCards');
  if (!container) return;
  
  if (!imobileData || imobileData.length === 0) {
    container.innerHTML = '<p>Nu sunt imobile disponibile.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  imobileData.forEach((imobil, index) => {
    const cardHTML = createImobilCard(imobil);
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
  
  // Adauga event listeners pentru butoanele de detalii
  addCardEventListeners(imobileData);
  
  // Adauga event listeners pentru butoanele de like
  addLikeEventListeners();
}

async function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.imobil-like-btn');
    
    // Pentru fiecare buton, verifica statusul de like
    for (const btn of likeButtons) {
        const anuntId = btn.getAttribute('data-anunt-id');
        
        // IMPORTANT: Reseteaza clasa inainte de verificare
        btn.classList.remove('liked');
        
        // Verifica daca user-ul este conectat
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user) {
            const isLiked = await checkLikeStatus(anuntId);
            if (isLiked) {
                btn.classList.add('liked');
            }
        }
        
        // Adauga event listener pentru click
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const anuntId = this.getAttribute('data-anunt-id');
            await toggleLike(anuntId, this);
        });
    }
}

// ========================================
// EVENT HANDLERS
// ========================================

/**
 * Gestioneaza schimbarea straturilor
 */
function handleLayerChange(event) {
  if (event.target.classList.contains('layer-checkbox')) {
    const label = document.querySelector(`label[for="${event.target.id}"]`);
    if (label) {
      if (event.target.checked) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    }
  }
}

/**
 * Gestioneaza submisia formularului de filtre
 */
function handleFormSubmit(event) {
  event.preventDefault();
 
  const formData = new FormData(event.target);
  const filters = {
    search: formData.get('search') || '',
    minPrice: formData.get('minPrice') || '',
    maxPrice: formData.get('maxPrice') || '',
    tip: formData.get('tip') || '',
    oferta: formData.get('oferta') || '',
    oras: formData.get('oras') || '',
    localitate: formData.get('localitate') || ''
  };
 
  console.log('Filtre aplicate:', filters);
  loadImobileData(filters);
}

/**
 * Adauga event listeners pentru butoanele de detalii
 */
function addCardEventListeners(imobileData) {
  const detailButtons = document.querySelectorAll('.imobil-detalii-btn');
  detailButtons.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const cardId = this.getAttribute('data-id') || imobileData[index].id;
      loadContent(`html/detalii.html?id=${cardId}`);
      initializeDetalii(cardId);
    });
  });
}
