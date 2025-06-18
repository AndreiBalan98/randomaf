document.addEventListener('DOMContentLoaded', async function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  // Ia toate anunturile
  const res = await fetch('http://localhost:3001/api/imobile');
  const anunturi = await res.json();
  const card = anunturi.find(c => c.id == id);
  if (!card) return;

  // Ia toate imaginile pentru acest imobil
  let imagini = [];
  try {
    const resImg = await fetch(`http://localhost:3001/api/imagini/${id}`);
    imagini = await resImg.json();
  } catch {}

  
  // --- SLIDER LOGIC ---
  let currentSlide = 0;
  function renderSlider() {
    if (!imagini.length) return '';
    return `
      <div class="slider-container">
        <button class="slider-arrow" id="slider-prev" ${currentSlide === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 48 48" width="48" height="48"><path d="M31.5 39.1 17.4 24l14.1-15.1-2.8-2.8L11.6 24l17.5 19.9z"/></svg>
        </button>
        <img class="slider-img" src="http://localhost:3001/${imagini[currentSlide].url}" alt="imagine imobil">
        <button class="slider-arrow" id="slider-next" ${currentSlide === imagini.length-1 ? 'disabled' : ''}>
          <svg viewBox="0 0 48 48" width="48" height="48"><path d="M16.5 8.9 30.6 24l-14.1 15.1 2.8 2.8L36.4 24 18.9 4.1z"/></svg>
        </button>
      </div>
      <div class="slider-indicator">${currentSlide+1} / ${imagini.length}</div>
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

  function updateSlider() {
  const sliderArea = document.getElementById('slider-area');
  if (sliderArea) {
    sliderArea.innerHTML = renderSlider();
    attachSliderEvents();
  }
}

  function attachSliderEvents() {
    document.getElementById('slider-prev')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });
    document.getElementById('slider-next')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSlide < imagini.length-1) {
        currentSlide++;
        updateSlider();
      }
    });
    document.querySelector('.slider-img')?.addEventListener('click', function() {
      openModal(currentSlide);
    });
  }

  function openModal(idx) {
    const modal = document.getElementById('galerie-modal');
    const modalImg = document.getElementById('modal-img');
    let current = idx;

    function showImg(i) {
      modalImg.src = "http://localhost:3001/" + imagini[i].url;
      modalImg.dataset.idx = i;
    }

    showImg(current);
    modal.style.display = 'flex';

    // Navigare stânga/dreapta
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
    // Închide la click pe fundal
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
    // Navigare cu săgeți tastatură
    document.onkeydown = function(e) {
      if (modal.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft') document.getElementById('modal-prev').click();
      if (e.key === 'ArrowRight') document.getElementById('modal-next').click();
      if (e.key === 'Escape') document.getElementById('modal-close').click();
    };
  }

  let galerie = `<div id="slider-area">${renderSlider()}</div>`;

let detalii = `
  <div class="detalii-card">
    <h2 class="detalii-titlu">${card.titlu}</h2>
     <div class="slider-pret-wrapper">
      <span class="pret-eticheta">${card.pret} €</span>
      ${galerie}
    </div>
    <div class="detalii-info">
      <p><strong>Tip:</strong> ${card.tip}</p>
      <p><strong>Tranzacție:</strong> ${card.tranzactie === 'vanzare' ? 'De vânzare' : card.tranzactie === 'inchiriat' ? 'De închiriat' : ''}</p>
      <p><strong>Preț:</strong> ${card.pret} €</p>
      <p><strong>Locație:</strong> ${card.locatie}</p>
      <p><strong>Suprafață:</strong> ${card.suprafata ? card.suprafata + ' mp' : '-'}</p>
      <p><strong>Descriere:</strong> ${card.descriere}</p>
      ${
        card.tip === 'apartament' ? `
          <p><strong>Nr. camere:</strong> ${card.nr_camere || '-'}</p>
          <p><strong>Nr. băi:</strong> ${card.nr_bai || '-'}</p>
          <p><strong>Compartimentare:</strong> ${card.compartimentare || '-'}</p>
          <p><strong>Confort:</strong> ${card.confort || '-'}</p>
          <p><strong>Etaj:</strong> ${card.etaj || '-'}</p>
          <p><strong>An construcție:</strong> ${card.an_constructie || '-'}</p>
        ` : card.tip === 'casa' || card.tip === 'casee' ? `
          <p><strong>Suprafață teren:</strong> ${card.suprafata_teren || '-'}</p>
          <p><strong>Nr. camere:</strong> ${card.nr_camere || '-'}</p>
          <p><strong>Nr. băi:</strong> ${card.nr_bai || '-'}</p>
          <p><strong>An construcție:</strong> ${card.an_constructie || '-'}</p>
          <p><strong>Alte dotări:</strong> ${card.alte_dotari || '-'}</p>
        ` : card.tip === 'teren' ? `
          <p><strong>Tip teren:</strong> ${card.tip_teren || '-'}</p>
          <p><strong>Clasificare:</strong> ${card.clasificare || '-'}</p>
          <p><strong>Front stradal:</strong> ${card.front_stradal || '-'}</p>
        ` : card.tip === 'spatiu-comercial' ? `
          <p><strong>Alte dotări:</strong> ${card.alte_dotari || '-'}</p>
        ` : ''
      }
    </div>
  </div>
`;
document.getElementById('detalii-container').innerHTML = detalii;
attachSliderEvents();

  // --- ANUNȚURI RELEVANTE ---
  const relevante = anunturi.filter(a =>
    a.id != id && (a.locatie === card.locatie || a.titlu.toLowerCase().includes(card.titlu.toLowerCase()))
  ).slice(0, 4);

  document.getElementById('relevante-container').innerHTML = relevante.map(r => `
  <div class="imobil-card">
    <div class="imobil-card-img" style="background-image:url('http://localhost:3001/${r.imagine ? r.imagine : 'uploads/default.jpg'}');">
      <button class="imobil-like-btn" title="Favorite">&#10084;</button>
      <div class="imobil-card-labels">
        <div class="imobil-pret">${r.pret ? r.pret + ' €' : ''}</div>
        <div class="imobil-tip">${r.tranzactie === 'vanzare' ? 'De vânzare' : r.tranzactie === 'inchiriat' ? 'De închiriat' : ''}</div>
      </div>
    </div>
    <div class="imobil-card-body">
      <div class="imobil-titlu">${r.titlu}</div>
      <div class="imobil-locatie">
        <span class="icon-locatie">📍</span>
        ${r.locatie}
      </div>
      <div class="imobil-info">
        <span class="imobil-mp">${r.suprafata || '-'} mp</span>
        <span class="imobil-id">ID: ${r.id}</span>
      </div>
      <button class="imobil-detalii-btn" onclick="window.location.href='detalii.html?id=${r.id}'">Vezi detalii</button>
    </div>
  </div>
`).join('');
});