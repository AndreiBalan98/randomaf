// Funcția de inițializare pentru hartă
async function initializeMap() {
    // Verifică dacă div-ul pentru hartă există
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Elementul cu id="map" nu a fost găsit');
        return;
    }

    // Verifică dacă Leaflet este încărcat
    if (typeof L === 'undefined') {
        console.error('Leaflet nu este încărcat');
        return;
    }

    // Inițializează harta centrată pe București
    const map = L.map('map', {
        center: [44.4268, 26.1025], // Coordonatele Bucureștiului
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Adaugă layer-ul de tile-uri OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adaugă un marker pe București
    const marker = L.marker([44.4268, 26.1025]).addTo(map);
    
    // Adaugă un popup pentru marker
    marker.bindPopup('<b>București</b><br>Capitala României').openPopup();

    // Opțional: adaugă un cerc pentru a demonstra alte funcționalități
    const circle = L.circle([44.4268, 26.1025], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: 5000
    }).addTo(map);

    circle.bindPopup('Zona centrală București');

    // Încarcă imobilele
    try {
        const imobileResponse = await fetch('http://localhost:3001/api/imobile');
        const imobile = await imobileResponse.json();

        // Plasează markeri pentru fiecare imobil
        for (const imobil of imobile) {
            try {
                const { numeOras, numeLocalitate } = parseLocalizare(imobil.localizare);
                
                // Face request pentru coordonate
                const coordsResponse = await fetch(`http://localhost:3001/api/coords?numeOras=${encodeURIComponent(numeOras)}&numeLocalitate=${encodeURIComponent(numeLocalitate)}`);
                
                if (coordsResponse.ok) {
                    const coord = await coordsResponse.json();
                    
                    const imobilMarker = L.marker([parseFloat(coord.lat), parseFloat(coord.lon)]).addTo(map);
                    
                    // Adaugă popup cu cardul imobilului
                    const cardHTML = createImobilCard(imobil);
                    imobilMarker.bindPopup(cardHTML);
                } else {
                    console.warn(`Coordonate nu au fost găsite pentru: ${imobil.localizare}`);
                }
            } catch (error) {
                console.error(`Eroare la procesarea imobilului ${imobil.id}:`, error);
            }
        }

    } catch (error) {
        console.error('Eroare la încărcarea datelor:', error);
    }

    console.log('Harta Leaflet a fost inițializată cu succes');
}

// Funcție pentru a parsa localizarea și a extrage numele orașului și localității
function parseLocalizare(localizare) {
    // Separă orașul și localitatea
    const parts = localizare.split(', ');
    if (parts.length !== 2) {
        throw new Error(`Format localizare invalid: ${localizare}`);
    }
    
    const numeOras = parts[0].toLowerCase()
        .replace(/ă/g, 'a')
        .replace(/â/g, 'a')
        .replace(/î/g, 'i')
        .replace(/ș/g, 's')
        .replace(/ț/g, 't')
        .replace(/\s+/g, '-');
    
    const numeLocalitate = parts[1];
    
    return { numeOras, numeLocalitate };
}

function createImobilCard(imobil) {
    const API_BASE_URL = 'http://localhost:3001';
    const imagePath = imobil.imagini && imobil.imagini.length > 0 ? imobil.imagini[0].url : `${API_BASE_URL}/images/casa1.jpg`;
    const price = imobil.pret ? `${imobil.pret} €` : 'Preț la cerere';
    const transactionType = imobil.tip_oferta === 'vanzare' ? 'Vânzare' : 'Închiriere';
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