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
function genereazaGalerie(imagini, currentSlide = 0) {
  if (!imagini.length) return '';
  return `
    <div class="slider-container" style="display:flex;justify-content:center;align-items:center;position:relative;">
      <button class="slider-arrow" id="slider-prev" ${currentSlide === 0 ? 'disabled' : ''} style="position:absolute;left:0;top:50%;transform:translateY(-50%);z-index:2;">
        <svg viewBox="0 0 48 48" width="40" height="40"><path d="M31.5 39.1 17.4 24l14.1-15.1-2.8-2.8L11.6 24l17.5 19.9z"/></svg>
      </button>
      <img class="slider-img" src="https://randomaf-backend.onrender.com/${imagini[currentSlide].url}" alt="imagine imobil" style="max-width:340px;max-height:220px;width:100%;height:auto;border-radius:12px;object-fit:cover;box-shadow:0 2px 16px #4311642d;cursor:pointer;" data-idx="${currentSlide}">
      <button class="slider-arrow" id="slider-next" ${currentSlide === imagini.length-1 ? 'disabled' : ''} style="position:absolute;right:0;top:50%;transform:translateY(-50%);z-index:2;">
        <svg viewBox="0 0 48 48" width="40" height="40"><path d="M16.5 8.9 30.6 24l-14.1 15.1 2.8 2.8L36.4 24 18.9 4.1z"/></svg>
      </button>
      <div class="slider-indicator" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:#fff8;padding:2px 12px;border-radius:12px;font-size:1rem;">
        ${currentSlide+1} / ${imagini.length}
      </div>
    </div>
    <div id="galerie-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);align-items:center;justify-content:center;z-index:9999;">
      <button id="modal-prev" title="Imaginea anterioară" style="position:absolute;left:3vw;top:50%;transform:translateY(-50%);background:none;border:none;">
        <svg viewBox="0 0 48 48" width="48" height="48" fill="#fff"><path d="M31.5 39.1 17.4 24l14.1-15.1-2.8-2.8L11.6 24l17.5 19.9z"/></svg>
      </button>
      <img id="modal-img" src="" alt="imagine mare" style="max-width:90vw;max-height:80vh;border-radius:12px;box-shadow:0 4px 32px #0008;">
      <button id="modal-next" title="Imaginea următoare" style="position:absolute;right:3vw;top:50%;transform:translateY(-50%);background:none;border:none;">
        <svg viewBox="0 0 48 48" width="48" height="48" fill="#fff"><path d="M16.5 8.9 30.6 24l-14.1 15.1 2.8 2.8L36.4 24 18.9 4.1z"/></svg>
      </button>
      <button id="modal-close" title="Închide" style="position:absolute;top:3vh;right:3vw;background:#fff8;border:none;font-size:2.2rem;color:#444;border-radius:50%;width:40px;height:40px;cursor:pointer;z-index:10002;">&times;</button>
    </div>
  `;
}

// Generează HTML-ul pentru detaliile de bază ale imobilului
function genereazaDetaliiDeBaza(card) {
  const locatie = card.locatie || card.localizare || '-';
  const tranzactie = card.tranzactie || card.tip_oferta || '';
  return `
    <h2 class="detalii-titlu">${card.titlu}</h2>
    <p><strong>Tip:</strong> ${card.tip || card.tip_imobil || '-'}</p>
    <p><strong>Tranzacție:</strong> ${tranzactie === 'vanzare' ? 'De vânzare' : tranzactie === 'inchiriat' ? 'De închiriat' : ''}</p>
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
  let currentSlide = 0;
  function renderSlider() {
    document.getElementById('galerie-slider-area').innerHTML = genereazaGalerie(imagini, currentSlide);

    document.getElementById('slider-prev')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSlide > 0) {
        currentSlide--;
        renderSlider();
      }
    });
    document.getElementById('slider-next')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSlide < imagini.length - 1) {
        currentSlide++;
        renderSlider();
      }
    });

    // Modal logic
    document.querySelector('.slider-img')?.addEventListener('click', function() {
      openModal(currentSlide);
    });
  }

  function openModal(idx) {
    const modal = document.getElementById('galerie-modal');
    const modalImg = document.getElementById('modal-img');
    let current = idx;

    function showImg(i) {
      modalImg.src = `https://randomaf-backend.onrender.com/${imagini[i].url}`;
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

  const detaliiDeBaza = genereazaDetaliiDeBaza(card);
  const detaliiSpecifice = genereazaDetaliiSpecifice(card);

  const detaliiComplete = `
    <div class="detalii-card">
      <div id="galerie-slider-area"></div>
      <div class="detalii-info">
        ${detaliiDeBaza}
        ${detaliiSpecifice}
      </div>
    </div>
  `;

  document.getElementById('detalii-container').innerHTML = detaliiComplete;
  renderSlider();
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

  const locatieCurenta = cardCurent.locatie || cardCurent.localizare || '';
  const relevante = anunturi.filter(a =>
    a.id != idCurent && ((a.locatie || a.localizare) === locatieCurenta || a.titlu.toLowerCase().includes(cardCurent.titlu.toLowerCase()))
  ).slice(0, 4);

  const htmlRelevante = relevante.map(r => {
    const imagePath = r.imagine
      ? `https://randomaf-backend.onrender.com/${r.imagine}`
      : `https://randomaf-backend.onrender.com/images/casa1.jpg`;
    const price = r.pret ? `${r.pret} €` : 'Preț la cerere';
    const transactionType = r.tranzactie === 'vanzare'
      ? 'De vânzare'
      : r.tranzactie === 'inchiriat'
        ? 'De închiriat'
        : '';
    const surface = r.suprafata || '-';
    return `
      <div class="imobil-card">
        <div class="imobil-card-img" style="background-image:url('${imagePath}');">
          <button class="imobil-like-btn" title="Favorite">&#10084;</button>
          <div class="imobil-card-labels">
            <div class="imobil-pret">${price}</div>
            <div class="imobil-tip">${transactionType}</div>
          </div>
        </div>
        <div class="imobil-card-body">
          <div class="imobil-titlu">${r.titlu}</div>
          <div class="imobil-locatie">
            <span class="icon-locatie">📍</span>
            ${r.locatie || r.localizare || ''}
          </div>
          <div class="imobil-info">
            <span class="imobil-mp">${surface} mp</span>
            <span class="imobil-id">ID: ${r.id}</span>
          </div>
          <button class="imobil-detalii-btn" data-id="${r.id}">Vezi detalii</button>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('relevante-container').innerHTML = htmlRelevante;

  // Adaugă event listeners pentru butoanele de detalii (SPA)
  document.querySelectorAll('.imobil-detalii-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const cardId = this.getAttribute('data-id');
      loadContent(`html/detalii.html?id=${cardId}`);
      initializeDetalii(cardId);
    });
  });
}

// Export global pentru SPA
window.initializeDetalii = initializeDetalii;