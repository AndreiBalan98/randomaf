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

  // Galeria de imagini
  let galerie = '';
  if (imagini.length > 0) {
    galerie = `
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

  // Detalii principale
  let detalii = `
    <div class="detalii-card">
      ${galerie}
      <h2>${card.titlu}</h2>
      <p><strong>Tip:</strong> ${card.tip}</p>
      <p><strong>Tranzacție:</strong> ${card.tranzactie === 'vanzare' ? 'De vânzare' : card.tranzactie === 'inchiriat' ? 'De închiriat' : ''}</p>
      <p><strong>Preț:</strong> ${card.pret} €</p>
      <p><strong>Locație:</strong> ${card.locatie}</p>
      <p><strong>Suprafață:</strong> ${card.suprafata ? card.suprafata + ' mp' : '-'}</p>
      <p><strong>Descriere:</strong> ${card.descriere}</p>
  `;

  // Detalii suplimentare după tip
  if (card.tip === 'apartament') {
    detalii += `
      <p><strong>Nr. camere:</strong> ${card.nr_camere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || '-'}</p>
      <p><strong>Compartimentare:</strong> ${card.compartimentare || '-'}</p>
      <p><strong>Confort:</strong> ${card.confort || '-'}</p>
      <p><strong>Etaj:</strong> ${card.etaj || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || '-'}</p>
    `;
  } else if (card.tip === 'casa' || card.tip === 'casee') {
    detalii += `
      <p><strong>Suprafață teren:</strong> ${card.suprafata_teren || '-'}</p>
      <p><strong>Nr. camere:</strong> ${card.nr_camere || '-'}</p>
      <p><strong>Nr. băi:</strong> ${card.nr_bai || '-'}</p>
      <p><strong>An construcție:</strong> ${card.an_constructie || '-'}</p>
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || '-'}</p>
    `;
  } else if (card.tip === 'teren') {
    detalii += `
      <p><strong>Tip teren:</strong> ${card.tip_teren || '-'}</p>
      <p><strong>Clasificare:</strong> ${card.clasificare || '-'}</p>
      <p><strong>Front stradal:</strong> ${card.front_stradal || '-'}</p>
    `;
  } else if (card.tip === 'spatiu-comercial') {
    detalii += `
      <p><strong>Alte dotări:</strong> ${card.alte_dotari || '-'}</p>
    `;
  }
  detalii += `</div>`;

  document.getElementById('detalii-container').innerHTML = detalii;

  // Galerie modal logic
  document.querySelectorAll('.galerie-img').forEach(img => {
    img.onclick = function() {
      document.getElementById('modal-img').src = this.src;
      document.getElementById('galerie-modal').style.display = 'flex';
    };
  });
  document.getElementById('galerie-modal')?.addEventListener('click', function() {
    this.style.display = 'none';
  });

  // Anunțuri relevante (după locație sau titlu)
  const relevante = anunturi.filter(a =>
    a.id != id && (a.locatie === card.locatie || a.titlu.toLowerCase().includes(card.titlu.toLowerCase()))
  ).slice(0, 4);

  document.getElementById('relevante-container').innerHTML = relevante.map(r => `
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
});