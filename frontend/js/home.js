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

// Orase si localitati
const LOCALITIES_BY_CITY = {
  "alba-iulia": ["Centru", "Partos", "Ampoi", "Cetate", "Tolstoi", "Barabant", "Micesti", "Oarda"],
  "arad": ["Centru", "Aurel Vlaicu", "Gradiste", "Micalaca", "Gai", "Bujac", "Sannicolau Mic", "Vladimirescu"],
  "bacau": ["Centru", "Nord", "Sud", "Serbanesti", "Gheraiesti", "Izvoare", "Letea", "Mioritei"],
  "baia-mare": ["Centru", "Valea Rosie", "Vasile Alecsandri", "Sasar", "Ferneziu", "Grivitei", "Gara", "Recea"],
  "bistrita": ["Centru", "Unirea", "Subcetate", "Viisoara", "Sigmir", "Slatinita", "Ghinda"],
  "botosani": ["Centru", "Parcul Tineretului", "Catamarasti", "Pacea", "Tudora", "Curtesti"],
  "braila": ["Centru", "Viziru", "Hipodrom", "Chercea", "Obor", "Radu Negru", "Lacu Dulce"],
  "brasov": ["Centru", "Tractorul", "Racadau", "Bartolomeu", "Noua", "Astra", "Schei", "Stupini"],
  "bucuresti": [
    "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6",
    "Baneasa", "Aviatorilor", "Cotroceni", "Drumul Taberei", "Militari", "Titan", "Berceni", "Colentina"
  ],
  "buzau": ["Centru", "Micro 14", "Micro 5", "Dorobanti", "Balcescu", "Simileasca", "Brosteni"],
  "calafat": ["Centru", "Basarabi", "Ciupercenii Vechi", "Golenti"],
  "calarasi": ["Centru", "Mircea Voda", "Oborul Nou", "Magureni", "Dumbrava", "Ostroveni"],
  "campina": ["Centru", "Slobozia", "Voila", "Campinita", "Turnatorie"],
  "campulung": ["Centru", "Grui", "Visoi", "Valea Romanestilor", "Schei"],
  "cluj-napoca": ["Centru", "Manastur", "Gheorgheni", "Grigorescu", "Zorilor", "Buna Ziua", "Iris", "Someseni"],
  "constanta": ["Centru", "Tomis Nord", "Tomis III", "Faleza Nord", "Inel II", "Palas", "Coiciu", "Km 4-5"],
  "craiova": ["Centru", "Rovine", "Brazda lui Novac", "Lapus", "Valea Rosie", "Craiovita Noua", "Bariera Valcii"],
  "deva": ["Centru", "Micro 15", "Micro 16", "Micro 4", "Micro 5", "Aurel Vlaicu", "Grigorescu"],
  "drobeta-turnu-severin": ["Centru", "Crihala", "Schela", "Gura Vaii", "Dudasu", "Banovita"],
  "focsani": ["Centru", "Sud", "Nord", "Obor", "Bahne", "Gara", "Mandresti"],
  "galati": ["Centru", "Mazepa", "Micro 19", "Micro 21", "Micro 40", "Tiglina", "Dunarea"],
  "giurgiu": ["Centru", "Tineretului", "Smarda", "Oinacu", "Steaua Dunarii"],
  "iasi": ["Centru", "Copou", "Tatarasi", "Nicolina", "Pacurari", "CUG", "Galata", "Dacia"],
  "medias": ["Centru", "Gura Campului", "Vitrometan", "Dupa Zid", "Mosnei"],
  "miercurea-ciuc": ["Centru", "Szeceny", "Spicului", "Nagymezo", "Harghita"],
  "oradea": ["Centru", "Rogerius", "Nufarul", "Iosia", "Velenta", "Oncea", "Episcopia"],
  "petrosani": ["Centru", "Aeroport", "Colonie", "Dalja", "Sasa", "Livezeni"],
  "piatra-neamt": ["Centru", "Darmanesti", "Precista", "Maratei", "Valeni", "Ciritei"],
  "pitesti": ["Centru", "Trivale", "Gavana", "Prundu", "Razboieni", "Eremia Grigorescu"],
  "ploiesti": ["Centru", "Nord", "Sud", "Vest", "Malul Rosu", "Bariera Bucuresti", "Mimiu"],
  "ramnicu-valcea": ["Centru", "Nord", "Ostroveni", "Traian", "Petrisor", "Cazanesti"],
  "ramnicu-sarat": ["Centru", "Anghel Saligny", "Podgoria", "Bariera Focsani"],
  "reghin": ["Centru", "Apalina", "Iernuteni", "Dedrad", "Breaza"],
  "resita": ["Centru", "Govandari", "Lunca Barzavei", "Muncitoresc", "Dealul Crucii"],
  "roman": ["Centru", "Favorit", "Petru Rares", "Mihai Viteazu", "Nicolae Balcescu"],
  "rosiorii-de-vede": ["Centru", "Spitalului", "Nord", "Sud", "Est"],
  "satu-mare": ["Centru", "Micro 17", "Micro 16", "Carpati", "Soarelui", "Horea"],
  "sibiu": ["Centru", "Strand", "Vasile Aaron", "Hipodrom", "Turnisor", "Terezian", "Lazaret"],
  "sighetu-marmatiei": ["Centru", "Valea Cufundoasa", "Iapa", "Sugau", "Lazu Baciului"],
  "slatina": ["Centru", "Progresul", "Steaua", "Clocociov", "Cireasov"],
  "slobozia": ["Centru", "Garii Noi", "Mihai Viteazu", "Sud", "Vest"],
  "suceava": ["Centru", "Burdujeni", "Obcini", "Itcani", "George Enescu", "Areni"],
  "targoviste": ["Centru", "Micro 6", "Micro 9", "Priseaca", "Sagricom"],
  "targu-jiu": ["Centru", "9 Mai", "Debarcader", "Grivitei", "Barsesti"],
  "targu-mures": ["Centru", "Dambul Pietros", "Unirii", "Tudor", "Aleea Carpati", "Cornisa"],
  "targu-neamt": ["Centru", "Blebea", "Condreni", "Humulesti", "Ozana"],
  "targu-secuiesc": ["Centru", "Fabricii", "Kanta", "Molnar Janos", "Turia"],
  "timisoara": ["Centru", "Soarelui", "Girocului", "Circumvalatiunii", "Lipovei", "Aradului", "Mehala", "Iosefin"],
  "turda": ["Centru", "Oprisani", "Micro 3", "Poiana", "Turda Noua"],
  "turnu-magurele": ["Centru", "Odaia", "Magurele", "Combinat"],
  "urziceni": ["Centru", "Tineretului", "Sud", "Vest", "Est"],
  "vaslui": ["Centru", "Moara Grecilor", "Gara", "Rediu", "Balteni"],
  "zalau": ["Centru", "Dumbrava Nord", "Bradet", "Porolissum", "Meses"],
  "zarnesti": ["Centru", "Tohanu Vechi", "Tohanu Nou", "Prund", "Balaceanca"]
};

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
function initializeLocationFilters() {
  console.log('Initializare filtre localizare...');
  
  const orasSelect = document.getElementById('orasSelect');
  const localitateSelect = document.getElementById('localitateSelect');
  
  if (!orasSelect || !localitateSelect) return;
  
  // Populeaza selectorul de orase
  Object.keys(LOCALITIES_BY_CITY).forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = formatCityName(city);
    orasSelect.appendChild(option);
  });
  
  // Event listener pentru schimbarea orasului
  orasSelect.addEventListener('change', function() {
    const selectedCity = this.value;
    updateLocalitateSelect(selectedCity, localitateSelect);
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
        const response = await fetch(CONFIG.getBackendUrl(CONFIG.BACKEND.API.LIKES + '/' + anuntId), {
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
        
        const response = await fetch(CONFIG.getBackendUrl(CONFIG.BACKEND.API.LIKES + '/' + anuntId), {
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
