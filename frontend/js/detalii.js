// Funcția principală pentru încărcarea detaliilor imobilului
async function initializeDetalii() {
  // Obține ID-ul din URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

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
  const res = await fetch('http://localhost:3001/api/imobile');
  const anunturi = await res.json();
  return anunturi.find(c => c.id == id);
}

// Obține imaginile pentru imobil
async function obtineImagini(id) {
  let imagini = [];
  try {
    const resImg = await fetch(`http://localhost:3001/api/imagini/${id}`);
    imagini = await resImg.json();
  } catch {}
  return imagini;
}

// Generează HTML-ul pentru galeria de imagini
function genereazaGalerie(imagini) {
  if (imagini.length === 0) return '';
  
  return `
    <div class="galerie">
      ${imagini.map((img, idx) => `
        <img src="http://localhost:3001/${img.url}" class="galerie-img" data-idx="${idx}" style="max-width:120px;cursor:pointer;">
      `).join('')}
    </div>
    <div id="galerie-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);align-items:center;justify-content:center;z-index:9999;">
      <img id="modal-img" src="" style="max-width:90vw;max-height:90vh;">
    </div>
  `;
}

// Generează HTML-ul pentru detaliile de bază ale imobilului
function genereazaDetaliiDeBaza(card) {
  return `
    <h2>${card.titlu}</h2>
    <p><strong>Tip:</strong> ${card.tip}</p>
    <p><strong>Tranzacție:</strong> ${card.tranzactie === 'vanzare' ? 'De vânzare' : card.tranzactie === 'inchiriat' ? 'De închiriat' : ''}</p>
    <p><strong>Preț:</strong> ${card.pret} €</p>
    <p><strong>Locație:</strong> ${card.locatie}</p>
    <p><strong>Suprafață:</strong> ${card.suprafata ? card.suprafata + ' mp' : '-'}</p>
    <p><strong>Descriere:</strong> ${card.descriere}</p>
  `;
}

// Generează HTML-ul pentru detaliile specifice după tipul imobilului
function genereazaDetaliiSpecifice(card) {
  let detaliiSpecifice = '';

  if (card.tip === 'apartament') {
    detaliiSpecifice = `
      <p><strong>Nr. camere:</strong> ${card.nr_camere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || '-'}</p>
      <p><strong>Compartimentare:</strong> ${card.compartimentare || '-'}</p>
      <p><strong>Confort:</strong> ${card.confort || '-'}</p>
      <p><strong>Etaj:</strong> ${card.etaj || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || '-'}</p>
    `;
  } else if (card.tip === 'casa' || card.tip === 'casee') {
    detaliiSpecifice = `
      <p><strong>Suprafață teren:</strong> ${card.suprafata_teren || '-'}</p>
      <p><strong>Nr. camere:</strong> ${card.nr_camere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || '-'}</p>
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || '-'}</p>
    `;
  } else if (card.tip === 'teren') {
    detaliiSpecifice = `
      <p><strong>Tip teren:</strong> ${card.tip_teren || '-'}</p>
      <p><strong>Clasificare:</strong> ${card.clasificare || '-'}</p>
      <p><strong>Front stradal:</strong> ${card.front_stradal || '-'}</p>
    `;
  } else if (card.tip === 'spatiu-comercial') {
    detaliiSpecifice = `
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || '-'}</p>
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
      ${detaliiDeBaza}
      ${detaliiSpecifice}
    </div>
  `;

  document.getElementById('detalii-container').innerHTML = detaliiComplete;
}

// Configurează funcționalitatea modalului pentru galeria de imagini
function configureazaGalerieModal() {
  // Adaugă event listeners pentru imaginile din galerie
  document.querySelectorAll('.galerie-img').forEach(img => {
    img.onclick = function() {
      document.getElementById('modal-img').src = this.src;
      document.getElementById('galerie-modal').style.display = 'flex';
    };
  });

  // Adaugă event listener pentru închiderea modalului
  document.getElementById('galerie-modal')?.addEventListener('click', function() {
    this.style.display = 'none';
  });
}

// Încarcă și afișează anunțurile relevante
async function incarcaAnunturiRelevante(idCurent, cardCurent) {
  const res = await fetch('http://localhost:3001/api/imobile');
  const anunturi = await res.json();
  
  // Filtrează anunțurile relevante după locație sau titlu
  const relevante = anunturi.filter(a =>
    a.id != idCurent && (a.locatie === cardCurent.locatie || a.titlu.toLowerCase().includes(cardCurent.titlu.toLowerCase()))
  ).slice(0, 4);

  // Generează HTML-ul pentru anunțurile relevante
  const htmlRelevante = relevante.map(r => `
    <div class="imobil-card">
      <div class="imobil-card-img" style="background-image:url('http://localhost:3001/${r.imagine ? r.imagine : 'uploads/default.jpg'}');"></div>
      <div class="imobil-card-body">
        <div class="imobil-titlu">${r.titlu}</div>
        <div class="imobil-info">
          <span class="imobil-mp">${r.suprafata || '-'} mp</span>
          <span class="imobil-id">ID: ${r.id}</span>
        </div>
        <button onclick="window.location.href='detalii.html?id=${r.id}'">Vezi detalii</button>
      </div>
    </div>
  `).join('');

  document.getElementById('relevante-container').innerHTML = htmlRelevante;
}

window.initializeDetalii = initializeDetalii;