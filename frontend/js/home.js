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

const AVAILABLE_LAYERS = [
  { id: 'poluare', name: 'Poluare' },
  { id: 'aglomeratie', name: 'Aglomeratie' },
  { id: 'jafuri', name: 'Jafuri' },
  { id: 'cost_trai', name: 'Cost mediu de trai' },
  { id: 'temperatura', name: 'Temperatura medie anuala' },
  { id: 'parcari', name: 'Parcari' },
  { id: 'magazine', name: 'Magazine' }
];

function initializeHome() {
  console.log('Initializare aplicatie home...');
  
  initializeFilterSelects();
  initializeLayers();
  initializeLocationFilters();
  initializeFormHandlers();
  loadImobileData();
}

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

async function initializeLocationFilters() {
  console.log('Initializare filtre localizare dinamic...');
  const orasSelect = document.getElementById('orasSelect');
  const localitateSelect = document.getElementById('localitateSelect');
  if (!orasSelect || !localitateSelect) return;

  // Populează orașele din backend
  try {
    const oraseResponse = await fetch(BACKEND_URL + API_ORASE);
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
        const localitatiResponse = await fetch(`${BACKEND_URL}${API_LOCALITATI}?oras_id=${selectedOrasId}`);
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

function initializeFormHandlers() {
  console.log('Initializare gestionare formulare...');
  
  const filtersForm = document.getElementById('filtersForm');
  if (filtersForm) {
    filtersForm.addEventListener('submit', handleFormSubmit);
  }
}

async function loadImobileData(filters = {}) {
  console.log('Incarcare date imobile...');
 
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${BACKEND_URL}${API_IMOBILE}?${queryParams}`);
   
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
  const container = document.getElementById('imobileCards');
  if (!container) return;
  
  if (!imobileData || imobileData.length === 0) {
    container.innerHTML = '<p>Nu sunt imobile disponibile.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  imobileData.forEach((imobil, index) => {
    console.log("imobile: " + imobil);
    const cardHTML = createImobilCard(imobil, false);
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
  
  addCardEventListeners(imobileData);
  
  await addLikeEventListeners();
}

function createImobilCard(imobil, isLiked = false) {

  console.log('Renderizare carduri imobile...', imobileData.length);
  console.log('PRIMUL IMOBIL COMPLET:', JSON.stringify(imobileData[0], null, 2));

  const imagePath = imobil.imagini[0].url;
  const localizare = imobil.strada || 'Strada nedisponibilă';
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
          ${localizare}
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

function formatCityName(citySlug) {
  return citySlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

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

function displayError(message) {
  const container = document.getElementById('imobileCards');
  if (container) {
    container.innerHTML = `<p style="color:red">${message}</p>`;
  }
}

async function toggleLike(anuntId, buttonElement) {
    try {
        const response = await fetch(`${BACKEND_URL}${API_LIKES}/${anuntId}`, {
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
            return false;
        }
        
        const response = await fetch(`${BACKEND_URL}${API_LIKES}/${anuntId}`, {
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
  
  addCardEventListeners(imobileData);
  
  addLikeEventListeners();
}

async function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.imobil-like-btn');
    
    for (const btn of likeButtons) {
        const anuntId = btn.getAttribute('data-anunt-id');
        
        btn.classList.remove('liked');
        
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user) {
            const isLiked = await checkLikeStatus(anuntId);
            if (isLiked) {
                btn.classList.add('liked');
            }
        }
        
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const anuntId = this.getAttribute('data-anunt-id');
            await toggleLike(anuntId, this);
        });
    }
}

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