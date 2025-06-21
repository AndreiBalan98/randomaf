// Funcția principală pentru încărcarea detaliilor imobilului
async function initializeDetalii(id) {
  // Încarcă datele imobilului
  const card = await obtineImobil(id);
  if (!card) return;

  // Încarcă imaginile imobilului
  const imagini = await obtineImagini(id);

  // Generează și afișează conținutul
  afiseazaDetaliiImobil(card, imagini);
  configureazaGalerieModal();

  // Încarcă și afișează anunțurile relevante
  await incarcaAnunturiRelevante(id, card);
}

// Obține datele imobilului după ID
async function obtineImobil(id) {
  const res = await fetch(`https://randomaf-backend.onrender.com/api/imobile`);
  const anunturi = await res.json();
  // Acceptă atât id numeric cât și string
  return anunturi.find(c => c.id == id);
}

// Obține imaginile pentru imobil
async function obtineImagini(id) {
  let imagini = [];
  try {
    const resImg = await fetch(`https://randomaf-backend.onrender.com/api/imagini/${id}`);
    imagini = await resImg.json();
  } catch {}
  return imagini;
}

// Generează HTML-ul pentru galeria de imagini
function genereazaGalerie(imagini) {
  if (!imagini.length) return '';
  return `
    <div class="galerie">
      ${imagini.map((img, idx) => `
        <img src="https://randomaf-backend.onrender.com/${img.url}" class="galerie-img" data-idx="${idx}" style="max-width:120px;cursor:pointer;">
      `).join('')}
    </div>
    <div id="galerie-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);align-items:center;justify-content:center;z-index:9999;">
      <img id="modal-img" src="" style="max-width:90vw;max-height:90vh;">
    </div>
  `;
}

// Generează HTML-ul pentru detaliile de bază ale imobilului
function genereazaDetaliiDeBaza(card) {
  // Acceptă și localizare/tip_oferta dacă nu există locatie/tranzactie
  const locatie = card.locatie || card.localizare || '-';
  const tranzactie = card.tranzactie || card.tip_oferta || '';
  return `
    <h2 class="detalii-titlu">${card.titlu}</h2>
    <p><strong>Tip:</strong> ${card.tip || card.tip_imobil || '-'}</p>
    <p><strong>Tranzacție:</strong> ${tranzactie === 'vanzare' ? 'De vânzare' : tranzactie === 'inchiriat' ? 'De închiriat' : ''}</p>
    <p><strong>Preț:</strong> ${card.pret} €</p>
    <p><strong>Locație:</strong> ${locatie}</p>
    <p><strong>Suprafață:</strong> ${card.suprafata ? card.suprafata + ' mp' : '-'}</p>
    <p><strong>Descriere:</strong> ${card.descriere}</p>
  `;
}

// Generează HTML-ul pentru detaliile specifice după tipul imobilului
function genereazaDetaliiSpecifice(card) {
  let detaliiSpecifice = '';
  if ((card.tip || card.tip_imobil) === 'apartament') {
    detaliiSpecifice = `
      <p><strong>Nr. camere:</strong> ${card.nr_camere || card.nrCamere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || card.nrBai || '-'}</p>
      <p><strong>Compartimentare:</strong> ${card.compartimentare || '-'}</p>
      <p><strong>Confort:</strong> ${card.confort || '-'}</p>
      <p><strong>Etaj:</strong> ${card.etaj || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || card.anConstructie || '-'}</p>
    `;
  } else if ((card.tip || card.tip_imobil) === 'casa' || (card.tip || card.tip_imobil) === 'casee') {
    detaliiSpecifice = `
      <p><strong>Suprafață teren:</strong> ${card.suprafata_teren || card.suprafataTeren || '-'}</p>
      <p><strong>Nr. camere:</strong> ${card.nr_camere || card.nrCamere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || card.nrBai || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || card.anConstructie || '-'}</p>
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || card.alteDotari || '-'}</p>
    `;
  } else if ((card.tip || card.tip_imobil) === 'teren') {
    detaliiSpecifice = `
      <p><strong>Tip teren:</strong> ${card.tip_teren || card.tipTeren || '-'}</p>
      <p><strong>Clasificare:</strong> ${card.clasificare || '-'}</p>
      <p><strong>Front stradal:</strong> ${card.front_stradal || card.frontStradal || '-'}</p>
    `;
  } else if ((card.tip || card.tip_imobil) === 'spatiu-comercial' || (card.tip || card.tip_imobil) === 'spatiu_comercial') {
    detaliiSpecifice = `
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || card.alteDotari || '-'}</p>
    `;
  }
  return detaliiSpecifice;
}

// Afișează detaliile complete ale imobilului
function afiseazaDetaliiImobil(card, imagini) {
  const galerie = genereazaGalerie(imagini);
  const detaliiDeBaza = genereazaDetaliiDeBaza(card);
  const detaliiSpecifice = genereazaDetaliiSpecifice(card);

  const detaliiComplete = `
    <div class="detalii-card">
      ${galerie}
      <div class="detalii-info">
        ${detaliiDeBaza}
        ${detaliiSpecifice}
      </div>
    </div>
  `;

  document.getElementById('detalii-container').innerHTML = detaliiComplete;
}

// Configurează funcționalitatea modalului pentru galeria de imagini
function configureazaGalerieModal() {
  document.querySelectorAll('.galerie-img').forEach(img => {
    img.onclick = function() {
      document.getElementById('modal-img').src = this.src;
      document.getElementById('galerie-modal').style.display = 'flex';
    };
  });
  document.getElementById('galerie-modal')?.addEventListener('click', function() {
    this.style.display = 'none';
  });
}

// Încarcă și afișează anunțurile relevante
async function incarcaAnunturiRelevante(idCurent, cardCurent) {
  const res = await fetch(`https://randomaf-backend.onrender.com/api/imobile`);
  const anunturi = await res.json();

  // Acceptă și localizare dacă nu există locatie
  const locatieCurenta = cardCurent.locatie || cardCurent.localizare || '';
  const relevante = anunturi.filter(a =>
    a.id != idCurent && ((a.locatie || a.localizare) === locatieCurenta || a.titlu.toLowerCase().includes(cardCurent.titlu.toLowerCase()))
  ).slice(0, 4);

  const htmlRelevante = relevante.map(r => `
    <div class="imobil-card">
      <div class="imobil-card-img" style="background-image:url('https://randomaf-backend.onrender.com/${r.imagine ? r.imagine : 'uploads/default.jpg'}');"></div>
      <div class="imobil-card-body">
        <div class="imobil-titlu">${r.titlu}</div>
        <div class="imobil-info">
          <span class="imobil-mp">${r.suprafata || '-'} mp</span>
          <span class="imobil-id">ID: ${r.id}</span>
        </div>
        <button onclick="loadContent('html/detalii.html?id=${r.id}'); window.initializeDetalii && initializeDetalii(${r.id});">Vezi detalii</button>
      </div>
    </div>
  `).join('');

  document.getElementById('relevante-container').innerHTML = htmlRelevante;
}

// ...existing code...

// Slider logic adaptat pentru SPA și backend remote/local
function genereazaSlider(imagini, backendUrl, pret) {
  if (!imagini.length) return '';
  return `
    <div class="slider-container" style="display: flex; justify-content: center; align-items: center; position: relative;">
      <span class="pret-eticheta-slider">${pret} €</span>
      <button class="slider-arrow" id="slider-prev" disabled>
        <svg viewBox="0 0 48 48" width="48" height="48"><path d="M31.5 39.1 17.4 24l14.1-15.1-2.8-2.8L11.6 24l17.5 19.9z"/></svg>
      </button>
      <img class="slider-img" src="${backendUrl}/${imagini[0].url}" alt="imagine imobil">
      <button class="slider-arrow" id="slider-next" ${imagini.length === 1 ? 'disabled' : ''}>
        <svg viewBox="0 0 48 48" width="48" height="48"><path d="M16.5 8.9 30.6 24l-14.1 15.1 2.8 2.8L36.4 24 18.9 4.1z"/></svg>
      </button>
    </div>
    <div class="slider-indicator" style="text-align:center;">1 / ${imagini.length}</div>
    <div id="galerie-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);align-items:center;justify-content:center;z-index:9999;">
      <button id="modal-prev" title="Imaginea anterioară">
        <svg viewBox="0 0 48 48" width="48" height="48"><path d="M31.5 39.1 17.4 24l14.1-15.1-2.8-2.8L11.6 24l17.5 19.9z"/></svg>
      </button>
      <img id="modal-img" src="" alt="imagine mare" style="max-width:90vw;max-height:80vh;border-radius:12px;box-shadow:0 4px 32px #0008;">
      <button id="modal-next" title="Imaginea următoare">
        <svg viewBox="0 0 48 48" width="48" height="48"><path d="M16.5 8.9 30.6 24l-14.1 15.1 2.8 2.8L36.4 24 18.9 4.1z"/></svg>
      </button>
      <button id="modal-close" title="Închide" style="position:absolute;top:3vh;right:3vw;background:#fff8;border:none;font-size:2.2rem;color:#444;border-radius:50%;width:40px;height:40px;cursor:pointer;z-index:10002;">&times;</button>
    </div>
  `;
}

function attachSliderEvents(imagini, backendUrl) {
  let currentSlide = 0;
  const sliderArea = document.getElementById('slider-area');
  if (!sliderArea) return;

  function updateSlider() {
    sliderArea.innerHTML = genereazaSlider(imagini, backendUrl);
    document.getElementById('slider-prev')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
        updateIndicator();
      }
    });
    document.getElementById('slider-next')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSlide < imagini.length - 1) {
        currentSlide++;
        updateSlider();
        updateIndicator();
      }
    });
    document.querySelector('.slider-img')?.addEventListener('click', function() {
      openModal(currentSlide);
    });
    updateIndicator();
  }

  function updateIndicator() {
    const indicator = sliderArea.querySelector('.slider-indicator');
    if (indicator) indicator.textContent = `${currentSlide + 1} / ${imagini.length}`;
    sliderArea.querySelector('#slider-prev')?.toggleAttribute('disabled', currentSlide === 0);
    sliderArea.querySelector('#slider-next')?.toggleAttribute('disabled', currentSlide === imagini.length - 1);
    sliderArea.querySelector('.slider-img').src = `${backendUrl}/${imagini[currentSlide].url}`;
  }

  function openModal(idx) {
    const modal = document.getElementById('galerie-modal');
    const modalImg = document.getElementById('modal-img');
    let current = idx;
    function showImg(i) {
      modalImg.src = `${backendUrl}/${imagini[i].url}`;
      modalImg.dataset.idx = i;
    }
    showImg(current);
    modal.style.display = 'flex';

    document.getElementById('modal-prev').onclick = (e) => {
      e.stopPropagation();
      current = (current - 1 + imagini.length) % imagini.length;
      showImg(current);
    };
    document.getElementById('modal-next').onclick = (e) => {
      e.stopPropagation();
      current = (current + 1) % imagini.length;
      showImg(current);
    };
    document.getElementById('modal-close').onclick = (e) => {
      e.stopPropagation();
      modal.style.display = 'none';
    };
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
    document.onkeydown = function(e) {
      if (modal.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft') document.getElementById('modal-prev').click();
      if (e.key === 'ArrowRight') document.getElementById('modal-next').click();
      if (e.key === 'Escape') document.getElementById('modal-close').click();
    };
  }

  updateSlider();
}

// Suprascrie funcția principală pentru detalii cu slider
async function initializeDetalii(id) {
  const backendUrl = 'https://randomaf-backend.onrender.com';
  // Încarcă datele imobilului
  const card = await obtineImobil(id);
  if (!card) return;

  // Încarcă imaginile imobilului
  const imagini = await obtineImagini(id);

  // Slider + detalii
  let galerie = `<div id="slider-area">${genereazaSlider(imagini, backendUrl, card.pret)}</div>`;

  // Detalii de bază + specifice
  let detaliiSpecifice = '';
  if ((card.tip || card.tip_imobil) === 'apartament') {
    detaliiSpecifice = `
      <p><strong>Nr. camere:</strong> ${card.nr_camere || card.nrCamere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || card.nrBai || '-'}</p>
      <p><strong>Compartimentare:</strong> ${card.compartimentare || '-'}</p>
      <p><strong>Confort:</strong> ${card.confort || '-'}</p>
      <p><strong>Etaj:</strong> ${card.etaj || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || card.anConstructie || '-'}</p>
    `;
  } else if ((card.tip || card.tip_imobil) === 'casa' || (card.tip || card.tip_imobil) === 'casee') {
    detaliiSpecifice = `
      <p><strong>Suprafață teren:</strong> ${card.suprafata_teren || card.suprafataTeren || '-'}</p>
      <p><strong>Nr. camere:</strong> ${card.nr_camere || card.nrCamere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || card.nrBai || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || card.anConstructie || '-'}</p>
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || card.alteDotari || '-'}</p>
    `;
  } else if ((card.tip || card.tip_imobil) === 'teren') {
    detaliiSpecifice = `
      <p><strong>Tip teren:</strong> ${card.tip_teren || card.tipTeren || '-'}</p>
      <p><strong>Clasificare:</strong> ${card.clasificare || '-'}</p>
      <p><strong>Front stradal:</strong> ${card.front_stradal || card.frontStradal || '-'}</p>
    `;
  } else if ((card.tip || card.tip_imobil) === 'spatiu-comercial' || (card.tip || card.tip_imobil) === 'spatiu_comercial') {
    detaliiSpecifice = `
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || card.alteDotari || '-'}</p>
    `;
  }

  let detalii = `
    <div class="detalii-card">
      <h2 class="detalii-titlu">${card.titlu}</h2>
      <div class="slider-pret-wrapper">
        <span class="pret-eticheta-slider">${card.pret} €</span>
        ${galerie}
      </div>
      <div class="detalii-info">
        <p><strong>Tip:</strong> ${card.tip || card.tip_imobil || '-'}</p>
        <p><strong>Tranzacție:</strong> ${card.tranzactie === 'vanzare' ? 'De vânzare' : card.tranzactie === 'inchiriat' ? 'De închiriat' : ''}</p>
        <p><strong>Locație:</strong> ${card.locatie || card.localizare || '-'}</p>
        <p><strong>Suprafață:</strong> ${card.suprafata ? card.suprafata + ' mp' : '-'}</p>
        <p><strong>Descriere:</strong> ${card.descriere}</p>
        ${detaliiSpecifice}
      </div>
    </div>
  `;
  document.getElementById('detalii-container').innerHTML = detalii;
  attachSliderEvents(imagini, backendUrl);

  // Încarcă și afișează anunțurile relevante (folosește loadContent pentru SPA)
  const res = await fetch(`${backendUrl}/api/imobile`);
  const anunturi = await res.json();
  const locatieCurenta = card.locatie || card.localizare || '';
  const relevante = anunturi.filter(a =>
    a.id != id && ((a.locatie || a.localizare) === locatieCurenta || a.titlu.toLowerCase().includes(card.titlu.toLowerCase()))
  ).slice(0, 4);

  document.getElementById('relevante-container').innerHTML = relevante.map(r => `
    <div class="imobil-card">
      <div class="imobil-card-img" style="background-image:url('${backendUrl}/${r.imagine ? r.imagine : 'uploads/default.jpg'}');"></div>
      <div class="imobil-card-body">
        <div class="imobil-titlu">${r.titlu}</div>
        <div class="imobil-info">
          <span class="imobil-mp">${r.suprafata || '-'} mp</span>
          <span class="imobil-id">ID: ${r.id}</span>
        </div>
        <button onclick="loadContent('html/detalii.html?id=${r.id}'); window.initializeDetalii && initializeDetalii(${r.id});">Vezi detalii</button>
      </div>
    </div>
  `).join('');
}

// Export global pentru SPA
window.initializeDetalii = initializeDetalii;