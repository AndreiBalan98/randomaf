function initializeAdd() {
  // === ELEMENTE DOM ===
  const terenRadio = document.getElementById('teren');
  const terenExtra = document.getElementById('terenExtraOptions');
  const allTypeRadios = document.querySelectorAll('input[name="propertyType"]');
  const terenDropzone = document.getElementById('terenDropzone');
  const terenImageInput = document.getElementById('terenImageInput');
  const terenImageList = document.getElementById('terenImageList');
  const menuBtn = document.getElementById('menuBtn');
  const mainContent = document.getElementById('mainContent');

  // === VARIABILE GLOBALE ===
  let terenImages = [];
  window.terenImages = terenImages;

  // === FUNCȚII HELPER ===
  function checkTeren() {
    terenExtra.style.display = terenRadio.checked ? 'flex' : 'none';
  }

  function updatePropertyTypeSections() {
    const selected = document.querySelector('input[name="propertyType"]:checked')?.value;
    document.querySelectorAll('[data-property-type]').forEach(el => {
      const types = el.getAttribute('data-property-type').split(',').map(t => t.trim());
      el.style.display = types.includes(selected) ? '' : 'none';
    });
  }

  function handleFiles(files) {
    let arr = Array.from(files);
    if (terenImages.length + arr.length > 16) {
      arr = arr.slice(0, 16 - terenImages.length);
      alert('Poți adăuga maxim 16 imagini.');
    }
    terenImages = terenImages.concat(arr);
    updateImageList();
  }

  function updateImageList() {
    terenImageList.innerHTML = '';
    window.terenImages = terenImages;
    
    terenImages.forEach((file, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'teren-imagini-thumb';
      thumb.draggable = true;
      thumb.dataset.idx = idx;

      // Imagine
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      thumb.appendChild(img);

      // Buton delete
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '&times;';
      del.onclick = (e) => {
        e.stopPropagation();
        terenImages.splice(idx, 1);
        updateImageList();
      };
      thumb.appendChild(del);

      // Drag & drop functionality
      thumb.ondragstart = (e) => {
        e.dataTransfer.setData('text/plain', idx);
        thumb.classList.add('dragging');
      };
      thumb.ondragend = () => thumb.classList.remove('dragging');
      thumb.ondragover = (e) => e.preventDefault();
      thumb.ondrop = (e) => {
        e.preventDefault();
        const from = +e.dataTransfer.getData('text/plain');
        const to = idx;
        if (from !== to) {
          const moved = terenImages.splice(from, 1)[0];
          terenImages.splice(to, 0, moved);
          updateImageList();
        }
      };

      terenImageList.appendChild(thumb);
    });
  }

  function afiseazaCard(card, showActions = false) {
    const container = document.getElementById('imobileCardsContainer');
    container.style.display = 'flex';

    const imgUrl = card.imagini && card.imagini.length ? card.imagini[0] : 'default.jpg';
    const tranzactieText = card.tranzactie === 'vanzare' ? 'De vânzare' : card.tranzactie === 'inchiriat' ? 'De închiriat' : '';
    const cardId = card.id || Math.floor(100000 + Math.random() * 900000);

    container.innerHTML = `
      <div class="imobile-cards">
        <div class="imobil-card">
          <div class="imobil-card-img" style="background-image:url('${imgUrl}');">
            <button class="imobil-like-btn" title="Favorite">&#10084;</button>
            <div class="imobil-card-labels">
              <div class="imobil-pret">${card.pret ? card.pret + ' €' : ''}</div>
              <div class="imobil-tip">${tranzactieText}</div>
            </div>
          </div>
          <div class="imobil-card-body">
            <div class="imobil-titlu">${card.titlu}</div>
            <div class="imobil-locatie">
              <span class="icon-locatie">📍</span>
              ${card.locatie}
            </div>
            <div class="imobil-info">
              <span class="imobil-mp">${card.suprafata ? card.suprafata : '-'} mp</span>
              <span class="imobil-id">ID: ${cardId}</span>
            </div>
            <button class="imobil-detalii-btn">Vezi detalii</button>
          </div>
          ${showActions ? `
          <div style="display:flex;gap:16px;justify-content:center;margin:18px 0 10px 0;">
            <button id="confirmaCardBtn" style="padding:10px 24px;background:#431164c2;color:#fff;border:none;border-radius:6px;cursor:pointer;">Confirmă</button>
            <button id="modificaCardBtn" style="padding:10px 24px;background:#fff;color:#431164c2;border:2px solid #431164c2;border-radius:6px;cursor:pointer;">Modifică</button>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    // Event listeners pentru butoane
    if (showActions) {
      // Buton modifică
      document.getElementById('modificaCardBtn').onclick = function() {
        const draft = JSON.parse(sessionStorage.getItem('draftImobilCard'));
        if (draft) {
          document.getElementById('adauga-imobil-form').style.display = '';
          document.getElementById('terenTitlu').value = draft.titlu;
          document.getElementById('terenPret').value = draft.pret;
          document.getElementById('terenLocalizare').value = draft.locatie;
          document.getElementById('terenDescriere').value = draft.descriere;
          
          // Selectează tipul
          const radio = document.querySelector(`input[name="propertyType"][value="${draft.tip}"]`);
          if (radio) radio.checked = true;
          
          // Suprafață specifică tipului
          if (draft.tip === 'spatiu-comercial') {
            document.getElementById('suprafataUtilaSpatiu').value = draft.suprafata;
          } else if (draft.tip === 'apartament') {
            document.getElementById('suprafataUtilaApartament').value = draft.suprafata;
          } else if (draft.tip === 'casa') {
            document.getElementById('suprafataUtilaCasa').value = draft.suprafata;
          } else if (draft.tip === 'teren') {
            document.getElementById('suprafataTeren').value = draft.suprafata;
          }
          
          // Tranzacție
          const tranzRadio = document.querySelector(`input[name="terenType"][value="${draft.tranzactie}"]`);
          if (tranzRadio) tranzRadio.checked = true;
          
          document.getElementById('imobileCardsContainer').style.display = 'none';
        }
      };
      


      // Buton confirmă
      document.getElementById('confirmaCardBtn').onclick = function() {
        const draft = JSON.parse(sessionStorage.getItem('draftImobilCard'));
        const payload = {
          titlu: draft.titlu,
          pret: draft.pret,
          locatie: draft.locatie,
          descriere: draft.descriere,
          tip: draft.tip,
          tranzactie: draft.tranzactie,
          imagini: draft.imagini, // array de imagini (doar URL-uri temporare, pentru upload folosești separat)
          suprafata: draft.suprafata,
          suprafataUtila: draft.suprafataUtila,
          suprafataTeren: draft.suprafataTeren,
          nrCamere: draft.nrCamere,
          nrBai: draft.nrBai,
          compartimentare: draft.compartimentare,
          confort: draft.confort,
          etaj: draft.etaj,
          anConstructie: draft.anConstructie,
          tipTeren: draft.tipTeren,
          clasificare: draft.clasificare,
          frontStradal: draft.frontStradal,
          alteDotari: draft.alteDotari
        };
        fetch(`https://randomaf-backend.onrender.com/api/imobil`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft)
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok' && data.id) {
            // Upload imagine dacă există
            if (window.terenImages && window.terenImages.length > 0) {
              const formData = new FormData();
              formData.append('anunt_id', data.id);
              formData.append('imagine', window.terenImages[0]);
              fetch(`https://randomaf-backend.onrender.com/api/upload-imagine`, {
                method: 'POST',
                body: formData
              })
              .then(res => res.json())
              .then(imgData => {
                alert('Anunț și imagine încărcate cu succes!');
                sessionStorage.removeItem('draftImobilCard');
                if (typeof loadContent === 'function') {
                  loadContent('html/home.html');
                  } else {
                    window.location.href = 'index.html';
                }
              });
            } else {
              alert('Anunț adăugat fără imagine!');
              sessionStorage.removeItem('draftImobilCard');
             if (typeof loadContent === 'function') {
              loadContent('html/home.html');
            } else {
              window.location.href = 'index.html';
              }
            }
          } else {
            alert('Eroare la adăugare!');
          }
        });
      };
    }
  }

  // === EVENT LISTENERS ===
  // Radio buttons pentru tip proprietate
  allTypeRadios.forEach(radio => {
    radio.addEventListener('change', checkTeren);
    radio.addEventListener('change', updatePropertyTypeSections);
  });

  // Drag & drop pentru imagini
  terenDropzone.onclick = () => terenImageInput.click();
  terenDropzone.ondragover = (e) => {
    e.preventDefault();
    terenDropzone.classList.add('dragover');
  };
  terenDropzone.ondragleave = () => terenDropzone.classList.remove('dragover');
  terenDropzone.ondrop = (e) => {
    e.preventDefault();
    terenDropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  };
  terenImageInput.onchange = (e) => handleFiles(e.target.files);

  // Comision selector
  document.getElementById('comisionSelect').addEventListener('change', function() {
    const input = document.getElementById('comisionCumparator');
    if (this.value === 'nu') {
      input.value = '';
      input.disabled = true;
    } else {
      input.disabled = false;
    }
  });

  // Menu toggle
  if (menuBtn && mainContent) {
    menuBtn.addEventListener('click', function() {
      mainContent.classList.toggle('menu-active');
    });
  }

  // Form submit - colectează și validează datele
  document.getElementById('adauga-imobil-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Colectează câmpuri comune
    const titlu = document.getElementById('terenTitlu')?.value.trim();
    const pret = document.getElementById('terenPret')?.value.trim();
    const locatie = document.getElementById('terenLocalizare')?.value.trim();
    const descriere = document.getElementById('terenDescriere')?.value.trim();
    const tip = document.querySelector('input[name="propertyType"]:checked')?.value || '';
    const tranzactie = document.querySelector('input[name="terenType"]:checked')?.value || '';
    const imagini = window.terenImages?.length ? window.terenImages : [];

    // Inițializează câmpuri specifice
    let suprafataUtila = '', suprafataTeren = '', nrCamere = '', nrBai = '';
    let compartimentare = '', confort = '', etaj = '', anConstructie = '';
    let tipTeren = '', clasificare = '', frontStradal = '', alteDotari = '', suprafata = '';

    // Colectează câmpuri specifice pe tip
    if (tip === 'apartament') {
      suprafataUtila = document.getElementById('suprafataUtilaApartament')?.value.trim();
      nrCamere = document.getElementById('nrCamere')?.value.trim();
      nrBai = document.getElementById('nrBai')?.value.trim();
      compartimentare = document.getElementById('compartimentare')?.value.trim();
      confort = document.getElementById('confort')?.value.trim();
      etaj = document.getElementById('etaj')?.value.trim();
      anConstructie = document.getElementById('anConstructieApartament')?.value.trim();
    } else if (tip === 'casa') {
      suprafataUtila = document.getElementById('suprafataUtilaCasa')?.value.trim();
      suprafataTeren = document.getElementById('suprafataTerenCasa')?.value.trim();
      nrCamere = document.getElementById('nrCamere')?.value.trim();
      nrBai = document.getElementById('nrBai')?.value.trim();
      anConstructie = document.getElementById('anConstructieCasa')?.value.trim();
      alteDotari = document.getElementById('alteDotari')?.value.trim();
    } else if (tip === 'teren') {
      suprafataTeren = document.getElementById('suprafataTerenTeren')?.value.trim();
      tipTeren = document.getElementById('terenTipSelect')?.value.trim();
      clasificare = document.getElementById('terenClasificare')?.value.trim();
      frontStradal = document.getElementById('terenFrontStradal')?.value.trim();
    } else if (tip === 'spatiu-comercial') {
      suprafataUtila = document.getElementById('suprafataUtilaSpatiu')?.value.trim();
      alteDotari = document.getElementById('alteDotariSpatiu')?.value.trim();
    }

    // Determină suprafața principală
    if (tip === 'spatiu-comercial' || tip === 'apartament' || tip === 'casa') {
      suprafata = suprafataUtila;
    } else if (tip === 'teren') {
      suprafata = suprafataTeren;
    }

    console.log({
      titlu, pret, locatie, descriere, tip, tranzactie, imagini, suprafataUtila, 
      suprafataTeren, nrCamere, nrBai, compartimentare, confort, etaj, anConstructie, 
      tipTeren, clasificare, frontStradal, alteDotari
    });

    // Validare câmpuri obligatorii
    if (!titlu || !pret || !locatie || !descriere || !tip || imagini.length === 0 || !tranzactie ||
        (tip === 'apartament' && (!nrCamere || !nrBai || !compartimentare || !confort || !etaj || !anConstructie)) ||
        (tip === 'casa' && (!suprafataUtila || !suprafataTeren || !nrCamere || !nrBai || !anConstructie)) ||
        (tip === 'teren' && (!suprafataTeren || !tipTeren || !clasificare || !frontStradal)) ||
        (tip === 'spatiu-comercial' && (!suprafataUtila))
      ) {
      alert('Completează toate câmpurile obligatorii și adaugă cel puțin o imagine!');
      return;
    }

    // Creează obiectul card complet
    const card = {
      titlu, pret, locatie, descriere, tip, tranzactie,
      imagini: imagini.map(f => URL.createObjectURL(f)),
      suprafata, suprafataUtila, suprafataTeren, nrCamere, nrBai,
      compartimentare, confort, etaj, anConstructie, tipTeren,
      clasificare, frontStradal, alteDotari
    };

    // Salvează draft și afișează card
    sessionStorage.setItem('draftImobilCard', JSON.stringify(card));
    document.getElementById('adauga-imobil-form').style.display = 'none';
    afiseazaCard(card, true);
  });

  // === INIȚIALIZARE ===
  checkTeren();
  updatePropertyTypeSections();
}

// Export global
window.initializeAdd = initializeAdd;