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
        fetch('http://localhost:3001/api/imobile', {
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
              fetch('http://localhost:3001/api/upload-imagine', {
                method: 'POST',
                body: formData
              })
              .then(res => res.json())
              .then(imgData => {
                alert('Anunț și imagine încărcate cu succes!');
                sessionStorage.removeItem('draftImobilCard');
                window.location.href = '../index.html';
              });
            } else {
              alert('Anunț adăugat fără imagine!');
              sessionStorage.removeItem('draftImobilCard');
              window.location.href = '../index.html';
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
    const pret = parseFloat(document.getElementById('terenPret')?.value.trim()) || 0;
    const locatie = document.getElementById('terenLocalizare')?.value.trim();
    const descriere = document.getElementById('terenDescriere')?.value.trim();
    const tip = document.querySelector('input[name="propertyType"]:checked')?.value || '';
    const tranzactie = document.querySelector('input[name="terenType"]:checked')?.value || '';
    const imagini = window.terenImages?.length ? window.terenImages : [];
    
    // Colectează comisionul
    const comisionSelect = document.getElementById('comisionSelect')?.value;
    const comisionValue = comisionSelect === 'nu' ? 0 : parseFloat(document.getElementById('comisionCumparator')?.value.trim()) || 0;

    // Inițializează câmpuri specifice
    let suprafataUtila = '', suprafataTeren = '', nrCamere = '', nrBai = '';
    let compartimentare = '', confort = '', etaj = '', anConstructie = '';
    let tipTeren = '', clasificare = '', frontStradal = '', alteDotari = '';

    // Colectează câmpuri specifice pe tip
    if (tip === 'apartament') {
      suprafataUtila = parseFloat(document.getElementById('suprafataUtilaApartament')?.value.trim()) || 0;
      nrCamere = parseInt(document.getElementById('nrCamere')?.value.trim()) || 0;
      nrBai = parseInt(document.getElementById('nrBai')?.value.trim()) || 0;
      compartimentare = document.getElementById('compartimentare')?.value.trim();
      confort = document.getElementById('confort')?.value.trim();
      etaj = parseInt(document.getElementById('etaj')?.value.trim()) || 0;
      anConstructie = parseInt(document.getElementById('anConstructieApartament')?.value.trim()) || 0;
    } else if (tip === 'casa') {
      suprafataUtila = parseFloat(document.getElementById('suprafataUtilaCasa')?.value.trim()) || 0;
      suprafataTeren = parseFloat(document.getElementById('suprafataTerenCasa')?.value.trim()) || 0;
      nrCamere = parseInt(document.getElementById('nrCamere')?.value.trim()) || 0;
      nrBai = parseInt(document.getElementById('nrBai')?.value.trim()) || 0;
      anConstructie = parseInt(document.getElementById('anConstructieCasa')?.value.trim()) || 0;
      alteDotari = document.getElementById('alteDotari')?.value.trim();
    } else if (tip === 'teren') {
      suprafataTeren = parseFloat(document.getElementById('suprafataTerenTeren')?.value.trim()) || 0;
      tipTeren = document.getElementById('terenTipSelect')?.value.trim();
      clasificare = document.getElementById('terenClasificare')?.value.trim();
      frontStradal = parseFloat(document.getElementById('terenFrontStradal')?.value.trim()) || 0;
    } else if (tip === 'spatiu-comercial') {
      suprafataUtila = parseFloat(document.getElementById('suprafataUtilaSpatiu')?.value.trim()) || 0;
      alteDotari = document.getElementById('alteDotariSpatiu')?.value.trim();
    }

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

    // Convertește tip-ul pentru a respecta constraint-ul bazei de date
    const tipImobilDB = tip === 'spatiu-comercial' ? 'spatiu_comercial' : tip;

    // Creează obiectul în formatul cerut
    const anunt = {
      tip_imobil: tipImobilDB,
      tip_oferta: tranzactie,
      titlu: titlu,
      pret: pret,
      comision: comisionValue,
      localizare: locatie,
      descriere: descriere,
      data_publicare: new Date().toISOString(),
      imagini: imagini.map((file, index) => ({
        url: `http://localhost:3001/images/${file.name}`, // Presupunem că fișierele vor fi uploadate și vor avea URL-uri
        ordine: index + 1
      })),
      detalii_specifice: {}
    };

    // Adaugă detalii specifice în funcție de tipul imobilului
    if (tip === 'apartament') {
      anunt.detalii_specifice = {
        nr_camere: nrCamere,
        nr_bai: nrBai,
        compartimentare: compartimentare,
        confort: confort,
        etaj: etaj,
        an_constructie: anConstructie,
        suprafata_utila: suprafataUtila
      };
    } else if (tip === 'casa') {
      anunt.detalii_specifice = {
        nr_camere: nrCamere,
        nr_bai: nrBai,
        an_constructie: anConstructie,
        suprafata_utila: suprafataUtila,
        suprafata_teren: suprafataTeren,
        alte_dotari: alteDotari
      };
    } else if (tip === 'teren') {
      anunt.detalii_specifice = {
        suprafata_teren: suprafataTeren,
        tip_teren: tipTeren,
        clasificare: clasificare,
        front_stradal: frontStradal
      };
    } else if (tip === 'spatiu-comercial') {
      anunt.detalii_specifice = {
        suprafata_utila: suprafataUtila,
        alte_dotari: alteDotari
      };
    }

    console.log('Anunt creat:', anunt);

    // Trimite request către server
    fetch(`${API_BASE_URL}/api/imobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(anunt)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Anuntul a fost adăugat cu succes!');
        // Salvează pentru afișarea card-ului
        sessionStorage.setItem('draftImobilCard', JSON.stringify(anunt));
        document.getElementById('adauga-imobil-form').style.display = 'none';
        
        // Pentru afișarea card-ului, convertește înapoi la formatul vechi temporar
        const cardForDisplay = {
          titlu: anunt.titlu,
          pret: anunt.pret,
          locatie: anunt.localizare,
          descriere: anunt.descriere,
          tip: anunt.tip_imobil,
          tranzactie: anunt.tip_oferta,
          imagini: anunt.imagini.map(img => img.url),
          suprafata: anunt.tip_imobil === 'teren' ? anunt.detalii_specifice.suprafata_teren : anunt.detalii_specifice.suprafata_utila
        };
        
        afiseazaCard(cardForDisplay, true);
      } else {
        alert('Eroare la adăugarea anuntului: ' + data.mesaj);
      }
    })
    .catch(error => {
      console.error('Eroare:', error);
      alert('Eroare la comunicarea cu serverul!');
    });
  });

  // === INIȚIALIZARE ===
  checkTeren();
  updatePropertyTypeSections();
}

// Export global
window.initializeAdd = initializeAdd;