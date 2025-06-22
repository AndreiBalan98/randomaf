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
    
    terenImages.forEach((file, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'teren-imagini-thumb';
      thumb.draggable = true;
      thumb.dataset.idx = idx;

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      thumb.appendChild(img);

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '&times;';
      del.onclick = (e) => {
        e.stopPropagation();
        terenImages.splice(idx, 1);
        updateImageList();
      };
      thumb.appendChild(del);

      // Reordonare prin drag & drop
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

  async function uploadImages(anuntId) {
    const uploadPromises = terenImages.map((file, index) => {
      const formData = new FormData();
      formData.append('anunt_id', anuntId);
      formData.append('ordine', index + 1);
      formData.append('imagine', file);
      
      return fetch('http://localhost:3001/api/upload-imagine', {
        method: 'POST',
        body: formData
      }).then(res => res.json());
    });

    try {
      const results = await Promise.all(uploadPromises);
      const failedUploads = results.filter(result => result.status !== 'ok');
      
      if (failedUploads.length > 0) {
        console.error('Unele imagini nu au fost încărcate:', failedUploads);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Eroare la încărcarea imaginilor:', error);
      return false;
    }
  }

  // === EVENT LISTENERS ===
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

  // Form submit
  document.getElementById('adauga-imobil-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Colectează câmpurile
    const titlu = document.getElementById('terenTitlu')?.value.trim();
    const pret = parseFloat(document.getElementById('terenPret')?.value.trim()) || 0;
    const locatie = document.getElementById('terenLocalizare')?.value.trim();
    const descriere = document.getElementById('terenDescriere')?.value.trim();
    const tip = document.querySelector('input[name="propertyType"]:checked')?.value || '';
    const tranzactie = document.querySelector('input[name="terenType"]:checked')?.value || '';
    
    const comisionSelect = document.getElementById('comisionSelect')?.value;
    const comisionValue = comisionSelect === 'nu' ? 0 : parseFloat(document.getElementById('comisionCumparator')?.value.trim()) || 0;

    // Colectează câmpuri specifice pe tip
    let detaliiSpecifice = {};
    
    if (tip === 'apartament') {
      detaliiSpecifice = {
        nr_camere: parseInt(document.getElementById('nrCamere')?.value.trim()) || 0,
        nr_bai: parseInt(document.getElementById('nrBai')?.value.trim()) || 0,
        compartimentare: document.getElementById('compartimentare')?.value.trim(),
        confort: document.getElementById('confort')?.value.trim(),
        etaj: parseInt(document.getElementById('etaj')?.value.trim()) || 0,
        an_constructie: parseInt(document.getElementById('anConstructieApartament')?.value.trim()) || 0,
        suprafata_utila: parseFloat(document.getElementById('suprafataUtilaApartament')?.value.trim()) || 0
      };
    } else if (tip === 'casa') {
      detaliiSpecifice = {
        nr_camere: parseInt(document.getElementById('nrCamere')?.value.trim()) || 0,
        nr_bai: parseInt(document.getElementById('nrBai')?.value.trim()) || 0,
        an_constructie: parseInt(document.getElementById('anConstructieCasa')?.value.trim()) || 0,
        suprafata_utila: parseFloat(document.getElementById('suprafataUtilaCasa')?.value.trim()) || 0,
        suprafata_teren: parseFloat(document.getElementById('suprafataTerenCasa')?.value.trim()) || 0,
        alte_dotari: document.getElementById('alteDotari')?.value.trim()
      };
    } else if (tip === 'teren') {
      detaliiSpecifice = {
        suprafata_teren: parseFloat(document.getElementById('suprafataTerenTeren')?.value.trim()) || 0,
        tip_teren: document.getElementById('terenTipSelect')?.value.trim(),
        clasificare: document.getElementById('terenClasificare')?.value.trim(),
        front_stradal: parseFloat(document.getElementById('terenFrontStradal')?.value.trim()) || 0
      };
    } else if (tip === 'spatiu-comercial') {
      detaliiSpecifice = {
        suprafata_utila: parseFloat(document.getElementById('suprafataUtilaSpatiu')?.value.trim()) || 0,
        alte_dotari: document.getElementById('alteDotariSpatiu')?.value.trim()
      };
    }

    // Validare de bază
    if (!titlu || !pret || !locatie || !descriere || !tip || !tranzactie || terenImages.length === 0) {
      alert('Completează toate câmpurile obligatorii și adaugă cel puțin o imagine!');
      return;
    }

    // Creează obiectul anunț
    const anunt = {
      tip_imobil: tip === 'spatiu-comercial' ? 'spatiu_comercial' : tip,
      tip_oferta: tranzactie,
      titlu: titlu,
      pret: pret,
      comision: comisionValue,
      localizare: locatie,
      descriere: descriere,
      data_publicare: new Date().toISOString(),
      detalii_specifice: detaliiSpecifice
    };

    try {
      // Adaugă anunțul în baza de date
      const response = await fetch('http://localhost:3001/api/imobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // IMPORTANT: Include cookies
        body: JSON.stringify(anunt)
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.id) {
        // Upload imaginile cu noul ID
        const uploadSuccess = await uploadImages(data.id);
        
        if (uploadSuccess) {
          alert('Anunțul și imaginile au fost adăugate cu succes!');
          // Reset form
          document.getElementById('adauga-imobil-form').reset();
          terenImages = [];
          updateImageList();
          // Navighează la pagina de detalii a anunțului nou creat
          loadContent(`html/detalii.html?id=${data.id}`);
          initializeDetalii(data.id);
        } else {
          alert('Anunțul a fost adăugat, dar au apărut probleme la încărcarea imaginilor.');
        }
      } else {
        alert('Eroare la adăugarea anunțului: ' + (data.mesaj || 'Eroare necunoscută'));
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la comunicarea cu serverul!');
    }
  });

  // === INIȚIALIZARE ===
  checkTeren();
  updatePropertyTypeSections();
}

// Export global
window.initializeAdd = initializeAdd;