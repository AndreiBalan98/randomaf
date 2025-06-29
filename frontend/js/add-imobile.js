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
  let addPropertyMap;
  let selectedMarker;
  let selectedCoords = null;

  // === FUNCTII HELPER ===
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
      alert('Poti adauga maxim 16 imagini.');
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
        console.error('Unele imagini nu au fost incarcate:', failedUploads);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Eroare la incarcarea imaginilor:', error);
      return false;
    }
  }

  function initializeAddPropertyMap() {
    const mapElement = document.getElementById('add-property-map');
    if (!mapElement || typeof L === 'undefined') return;

    if (addPropertyMap) {
        addPropertyMap.remove(); // Sterge harta daca exista
        addPropertyMap = null;
        selectedMarker = null;
        selectedCoords = null;
    }

    // Creează harta centrată pe Iași
    addPropertyMap = L.map('add-property-map', {
        center: [47.1585, 27.6014], // Coordonatele Iașului
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Adaugă layer-ul de hartă
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(addPropertyMap);

    // Event listener pentru click pe hartă
    addPropertyMap.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Șterge markerul anterior dacă există
        if (selectedMarker) {
            addPropertyMap.removeLayer(selectedMarker);
        }
        
        // Adaugă noul marker
        selectedMarker = L.marker([lat, lng]).addTo(addPropertyMap);
        
        // Salvează coordonatele
        selectedCoords = { lat: lat, lng: lng };
        
        console.log('Coordonate selectate:', selectedCoords);
    });
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

    // Colecteaza campurile
    const titlu = document.getElementById('terenTitlu')?.value.trim();
    const pret = parseFloat(document.getElementById('terenPret')?.value.trim()) || 0;
    const locatie = document.getElementById('terenLocalizare')?.value.trim();
    const descriere = document.getElementById('terenDescriere')?.value.trim();
    const tip = document.querySelector('input[name="propertyType"]:checked')?.value || '';
    const tranzactie = document.querySelector('input[name="terenType"]:checked')?.value || '';
    
    const comisionSelect = document.getElementById('comisionSelect')?.value;
    const comisionValue = comisionSelect === 'nu' ? 0 : parseFloat(document.getElementById('comisionCumparator')?.value.trim()) || 0;

    // Colecteaza campuri specifice pe tip
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

    // Validare de baza
    if (!titlu || !pret || !locatie || !descriere || !tip || !tranzactie || terenImages.length === 0 || !selectedCoords) {
      alert('Completeaza toate campurile obligatorii, adauga cel putin o imagine si selecteaza locatia pe harta!');
      return;
    } 

    // Creeaza obiectul anunt
    const anunt = {
      tip_imobil: tip === 'spatiu-comercial' ? 'spatiu_comercial' : tip,
      tip_oferta: tranzactie,
      titlu: titlu,
      pret: pret,
      comision: comisionValue,
      localizare: locatie,
      descriere: descriere,
      data_publicare: new Date().toISOString(),
      detalii_specifice: detaliiSpecifice,
      // ADAUGĂ ACESTE LINII:
      latitudine: selectedCoords ? selectedCoords.lat : null,
      longitudine: selectedCoords ? selectedCoords.lng : null
    };

    try {
      // Adauga anuntul in baza de date
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
          alert('Anuntul si imaginile au fost adaugate cu succes!');
          // Reset form
          document.getElementById('adauga-imobil-form').reset();
          terenImages = [];
          updateImageList();
          // Navigheaza la pagina de detalii a anuntului nou creat
          loadContent(`html/detalii.html?id=${data.id}`);
          initializeDetalii(data.id);
        } else {
          alert('Anuntul a fost adaugat, dar au aparut probleme la incarcarea imaginilor.');
        }
      } else {
        alert('Eroare la adaugarea anuntului: ' + (data.mesaj || 'Eroare necunoscuta'));
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la comunicarea cu serverul!');
    }
  });

  // === INITIALIZARE ===
  checkTeren();
  updatePropertyTypeSections();
  setTimeout(() => {
    initializeAddPropertyMap();
  }, 100);
}

// Export global
window.initializeAdd = initializeAdd;