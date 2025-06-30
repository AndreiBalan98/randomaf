function initializeAdd() {
  const terenRadio = document.getElementById('teren');
  const terenExtra = document.getElementById('terenExtraOptions');
  const allTypeRadios = document.querySelectorAll('input[name="propertyType"]');
  const terenDropzone = document.getElementById('terenDropzone');
  const terenImageInput = document.getElementById('terenImageInput');
  const terenImageList = document.getElementById('terenImageList');
  const menuBtn = document.getElementById('menuBtn');
  const mainContent = document.getElementById('mainContent');

  let terenImages = [];
  let addPropertyMap;
  let selectedMarker;
  let selectedCoords = null;

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

  function formatName(name) {
    if (!name) return '';
    return name.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  async function getOrCreateOras(numeOras) {
    if (!numeOras) return null;
    
    const formattedName = formatName(numeOras.trim());
    
    try {
      let response = await fetch(BACKEND_URL + API_ORASE, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Eroare la obtinerea oraselor');
      
      let orase = await response.json();
      
      let orasExistent = orase.find(oras => 
        oras.nume.toLowerCase() === formattedName.toLowerCase()
      );
      
      if (orasExistent) {
        return orasExistent.id;
      }
      
      response = await fetch(BACKEND_URL + API_ORASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nume: formattedName })
      });
      
      if (!response.ok) throw new Error('Eroare la crearea orasului');
      
      const nouOras = await response.json();
      return nouOras.id;
      
    } catch (error) {
        console.error('Eroare la procesarea orasului:', error);
      return null;
    }
  }

  async function getOrCreateLocalitate(numeLocalitate, orasId) {
    if (!numeLocalitate || !orasId) return null;
    
    const formattedName = formatName(numeLocalitate.trim());
    
    try {
      let response = await fetch(`${BACKEND_URL}${API_LOCALITATI}?oras_id=${orasId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Eroare la obtinerea localitatilor');
      
      let localitati = await response.json();
      
      let localitateExistenta = localitati.find(localitate => 
        localitate.nume.toLowerCase() === formattedName.toLowerCase()
      );
      
      if (localitateExistenta) {
        return localitateExistenta.id;
      }
      
      response = await fetch(BACKEND_URL + API_LOCALITATI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          nume: formattedName,
          oras_id: orasId 
        })
      });
      
      if (!response.ok) throw new Error('Eroare la crearea localitatii');
      
      const nouaLocalitate = await response.json();
      return nouaLocalitate.id;
      
    } catch (error) {
      console.error('Eroare la procesarea localitatii:', error);
      return null;
    }
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
      
      return fetch(BACKEND_URL + API_UPLOAD_IMAGINE, {
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
        addPropertyMap.remove();
        addPropertyMap = null;
        selectedMarker = null;
        selectedCoords = null;
    }

    addPropertyMap = L.map('add-property-map', {
        center: [47.1585, 27.6014], // Coordonatele Iașului
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(addPropertyMap);

    addPropertyMap.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        if (selectedMarker) {
            addPropertyMap.removeLayer(selectedMarker);
        }
        
        selectedMarker = L.marker([lat, lng]).addTo(addPropertyMap);
        selectedCoords = { lat: lat, lng: lng };
        
        console.log('Coordonate selectate:', selectedCoords);
    });
  }

  allTypeRadios.forEach(radio => {
    radio.addEventListener('change', checkTeren);
    radio.addEventListener('change', updatePropertyTypeSections);
  });

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

  document.getElementById('comisionSelect').addEventListener('change', function() {
    const input = document.getElementById('comisionCumparator');
    if (this.value === 'nu') {
      input.value = '';
      input.disabled = true;
    } else {
      input.disabled = false;
    }
  });

  if (menuBtn && mainContent) {
    menuBtn.addEventListener('click', function() {
      mainContent.classList.toggle('menu-active');
    });
  }

  document.getElementById('adauga-imobil-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const titlu = document.getElementById('terenTitlu')?.value.trim();
    const pret = parseFloat(document.getElementById('terenPret')?.value.trim()) || 0;
    const orasInput = document.getElementById('terenOras')?.value.trim();
    const localitateInput = document.getElementById('terenLocalitate')?.value.trim();
    const strada = document.getElementById('terenStrada')?.value.trim();
    const descriere = document.getElementById('terenDescriere')?.value.trim();
    const tip = document.querySelector('input[name="propertyType"]:checked')?.value || '';
    const tranzactie = document.querySelector('input[name="terenType"]:checked')?.value || '';
    
    const comisionSelect = document.getElementById('comisionSelect')?.value;
    const comisionValue = comisionSelect === 'nu' ? null : parseFloat(document.getElementById('comisionCumparator')?.value.trim()) || null;

    let detaliiSpecifice = {};
    
    if (tip === 'apartament') {
      detaliiSpecifice = {
        nr_camere: parseInt(document.getElementById('nrCamere')?.value) || null,
        nr_bai: parseInt(document.getElementById('nrBai')?.value) || null,
        compartimentare: document.getElementById('compartimentare')?.value || null,
        confort: document.getElementById('confort')?.value || null,
        etaj: document.getElementById('etaj')?.value || null,
        an_constructie: parseInt(document.getElementById('anConstructieApartament')?.value) || null,
        suprafata_utila: parseFloat(document.getElementById('suprafataUtilaApartament')?.value) || null
      };
    } else if (tip === 'casa') {
      detaliiSpecifice = {
        nr_camere: parseInt(document.getElementById('nrCamere')?.value) || null,
        nr_bai: parseInt(document.getElementById('nrBai')?.value) || null,
        an_constructie: parseInt(document.getElementById('anConstructieCasa')?.value) || null,
        suprafata_utila: parseFloat(document.getElementById('suprafataUtilaCasa')?.value) || null,
        suprafata_teren: parseFloat(document.getElementById('suprafataTerenCasa')?.value) || null
      };
    } else if (tip === 'teren') {
      detaliiSpecifice = {
        suprafata_teren: parseFloat(document.getElementById('suprafataTerenTeren')?.value) || null,
        tip_teren: document.getElementById('terenTipSelect')?.value || null,
        clasificare: document.getElementById('terenClasificare')?.value || null,
        front_stradal: parseFloat(document.getElementById('terenFrontStradal')?.value) || null
      };
    } else if (tip === 'spatiu-comercial') {
      detaliiSpecifice = {
        suprafata_utila: parseFloat(document.getElementById('suprafataUtilaSpatiu')?.value) || null,
        nr_camere: null,
        nr_bai: null,
        an_constructie: null
      };
    }

    if (!titlu || !pret || !orasInput || !descriere || !tip || !tranzactie || terenImages.length === 0 || !selectedCoords) {
      alert('Completeaza toate campurile obligatorii, adauga cel putin o imagine si selecteaza locatia pe harta!');
      return;
    } 

    try {
      const orasId = await getOrCreateOras(orasInput);
      if (!orasId) {
        alert('Eroare la procesarea orasului!');
        return;
      }

      let localitateId = null;
      if (localitateInput) {
        localitateId = await getOrCreateLocalitate(localitateInput, orasId);
        if (!localitateId) {
          alert('Eroare la procesarea localitatii!');
          return;
        }
      }

      const anunt = {
        tip_imobil: tip === 'spatiu-comercial' ? 'spatiu_comercial' : tip,
        tip_oferta: tranzactie,
        titlu: titlu,
        pret: pret,
        comision: comisionValue,
        oras_id: orasId,
        localitate_id: localitateId,
        strada: strada || null,
        latitudine: selectedCoords.lat,
        longitudine: selectedCoords.lng,
        descriere: descriere,
        detalii_specifice: detaliiSpecifice
      };

      const response = await fetch(BACKEND_URL + API_IMOBILE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(anunt)
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.id) {
        const uploadSuccess = await uploadImages(data.id);
        
        if (uploadSuccess) {
          alert('Anuntul si imaginile au fost adaugate cu succes!');
          document.getElementById('adauga-imobil-form').reset();
          terenImages = [];
          updateImageList();
          
          if (selectedMarker) {
            addPropertyMap.removeLayer(selectedMarker);
            selectedMarker = null;
            selectedCoords = null;
          }
          
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

  checkTeren();
  updatePropertyTypeSections();
  setTimeout(() => {
    initializeAddPropertyMap();
  }, 100);
}

window.initializeAdd = initializeAdd;