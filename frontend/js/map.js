function getUniqueCities(imobile) {
    const citySet = new Set();
    imobile.forEach(imobil => {
        if (imobil.localizare) {
            const oras = imobil.localizare.split(',')[0].trim();
            if (oras) citySet.add(oras);
        }
    });
    return Array.from(citySet);
}

function getCityCoords(imobile, oras) {
    const coords = imobile
        .filter(imobil => imobil.localizare && imobil.localizare.split(',')[0].trim() === oras)
        .map(imobil => ({
            lat: parseFloat(imobil.latitudine),
            lng: parseFloat(imobil.longitudine)
        }))
        .filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng));
    if (coords.length === 0) return null;

    const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
    const avgLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;

    return [avgLat, avgLng];
}

// Modifica initializeMap pentru a adauga filtrul de orase
async function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Elementul cu id="map" nu a fost gasit');
        return;
    }
    if (typeof L === 'undefined') {
        console.error('Leaflet nu este incarcat');
        return;
    }

    const map = L.map('map', {
        center: [44.4268, 26.1025],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    try {
        const imobileResponse = await fetch(`${BACKEND_URL}${API_IMOBILE}`);
        const imobile = await imobileResponse.json();

        // === ADAUGA BUTONUL DE FILTRU ORASE ===
        let filterContainer = document.getElementById('map-city-filter');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.id = 'map-city-filter';
            filterContainer.style.position = 'absolute';
            filterContainer.style.top = '50px';
            filterContainer.style.right = '110px';
            filterContainer.style.zIndex = '1001';
            filterContainer.style.background = '#fff';
            filterContainer.style.padding = '10px 18px';
            filterContainer.style.borderRadius = '10px';
            filterContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
            filterContainer.style.display = 'none';
            mapElement.parentNode.appendChild(filterContainer);
        }

        // Creeaza butonul
        let cityBtn = document.getElementById('city-filter-btn');
        if (!cityBtn) {
            cityBtn = document.createElement('button');
            cityBtn.id = 'city-filter-btn';
            cityBtn.innerHTML = 'Orase';
            cityBtn.style.position = 'absolute';
            cityBtn.style.top = '60px';
            cityBtn.style.right = '30px';
            cityBtn.style.zIndex = '1002';
            cityBtn.style.background = '#431164c9';
            cityBtn.style.color = '#fff';
            cityBtn.style.border = 'none';
            cityBtn.style.borderRadius = '8px';
            cityBtn.style.padding = '8px 18px';
            cityBtn.style.cursor = 'pointer';
            cityBtn.style.fontWeight = 'bold';
            cityBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
            mapElement.parentNode.appendChild(cityBtn);
        }

        // Logica de afisare/ascundere dropdown la click pe buton
        cityBtn.onclick = function () {
            filterContainer.style.display = filterContainer.style.display === 'none' ? 'block' : 'none';
        };

        // Populeaza dropdown-ul cu orase
        const cities = getUniqueCities(imobile);
        filterContainer.innerHTML = `
            <label for="citySelect" style="font-weight:bold;">Alege orasul: </label>
            <select id="citySelect" style="padding:4px 10px; border-radius:6px;">
                <option value="">Toate orasele</option>
                ${cities.map(oras => `<option value="${oras}">${oras}</option>`).join('')}
            </select>
        `;
        const citySelect = filterContainer.querySelector('#citySelect');
        citySelect.addEventListener('change', function () {
            const selectedCity = this.value;
            if (selectedCity) {
                const coords = getCityCoords(imobile, selectedCity);
                if (coords) {
                    map.setView(coords, 13); // Zoom pe oras
                }
            } else {
                map.setView([44.4268, 26.1025], 10); // Reset la Bucuresti
            }
            filterContainer.style.display = 'none'; // ascunde dropdown-ul dupa selectie
        });

        // === END FILTRU ORASE ===

        // Plaseaza markeri pentru fiecare imobil cu coordonate valide
        for (const imobil of imobile) {
            try {
                if (imobil.latitudine && imobil.longitudine) {
                    const imobilMarker = L.marker([parseFloat(imobil.latitudine), parseFloat(imobil.longitudine)]).addTo(map);
                    const cardHTML = createImobilCard(imobil);
                    imobilMarker.bindPopup(cardHTML);

                    imobilMarker.on('popupopen', () => {
                        const detaliiBtn = document.querySelector(`[data-id="${imobil.id}"]`);
                        if (detaliiBtn) {
                            detaliiBtn.addEventListener('click', () => {
                                loadContent(`html/detalii.html?id=${imobil.id}`);
                                initializeDetalii(imobil.id);
                            });
                        }
                    });
                } else {
                    console.warn(`Coordonate lipsa pentru anuntul cu id ${imobil.id}`);
                }
            } catch (error) {
                console.error(`Eroare la procesarea imobilului ${imobil.id}:`, error);
            }
        }

    } catch (error) {
        console.error('Eroare la incarcarea datelor:', error);
    }

    console.log('Harta Leaflet a fost initializata cu succes');
}

// Functie pentru a construi cardul de anunt pentru popup
function createImobilCard(imobil) {
    const imagePath = imobil.imagini[0].url;
    const price = imobil.pret ? `${imobil.pret} €` : 'Pret la cerere';
    const transactionType = imobil.tip_oferta === 'vanzare' ? 'Vanzare' : 'Inchiriere';
    const surface = imobil.tip_imobil === 'teren' ? 
        (imobil.detalii_specifice?.suprafata_teren || '-') : 
        (imobil.detalii_specifice?.suprafata_utila || '-');
    
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
                <div class="imobil-titlu">${imobil.titlu}</div>
                <div class="imobil-locatie">
                    <span class="icon-locatie">📍</span>
                    ${imobil.localizare}
                </div>
                <div class="imobil-info">
                    <span class="imobil-mp">${surface} mp</span>
                    <span class="imobil-id">ID: ${imobil.id}</span>
                </div>
                <button class="imobil-detalii-btn" data-id="${imobil.id}">Vezi detalii</button>
            </div>
        </div>
    `;
}

window.initializeMap = initializeMap;