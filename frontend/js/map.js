// Functia de initializare pentru harta
async function initializeMap() {
    const API_BASE_URL = 'http://localhost:3001';
    
    // Verifica daca div-ul pentru harta exista
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Elementul cu id="map" nu a fost gasit');
        return;
    }

    // Verifica daca Leaflet este incarcat
    if (typeof L === 'undefined') {
        console.error('Leaflet nu este incarcat');
        return;
    }

    // Initializeaza harta centrata pe Bucuresti
    const map = L.map('map', {
        center: [44.4268, 26.1025], // Coordonatele Bucurestiului
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Adauga layer-ul de tile-uri OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adauga un marker pe Bucuresti
    const marker = L.marker([44.4268, 26.1025]).addTo(map);
    
    // Adauga un popup pentru marker
    marker.bindPopup('<b>Bucuresti</b><br>Capitala Romaniei').openPopup();

    // Incarca imobilele
    try {
        const imobileResponse = await fetch(`${API_BASE_URL}/api/imobile`);
        const imobile = await imobileResponse.json();


        // Plaseaza markeri pentru fiecare imobil
        for (const imobil of imobile) {
            try {
                const { numeOras, numeLocalitate } = parseLocalizare(imobil.localizare);
                
                // Face request pentru coordonate
                const coordsResponse = await fetch(`${API_BASE_URL}/api/coords?numeOras=${encodeURIComponent(numeOras)}&numeLocalitate=${encodeURIComponent(numeLocalitate)}`);
                
                if (coordsResponse.ok) {
                    const coord = await coordsResponse.json();
                    
                    const imobilMarker = L.marker([parseFloat(coord.lat), parseFloat(coord.lon)]).addTo(map);
                    
                    // Adauga popup cu cardul imobilului
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
                    console.warn(`Coordonate nu au fost gasite pentru: ${imobil.localizare}`);
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

// Functie pentru a parsa localizarea si a extrage numele orasului si localitatii
function parseLocalizare(localizare) {
    // Separa orasul si localitatea
    const parts = localizare.split(', ');
    if (parts.length !== 2) {
        throw new Error(`Format localizare invalid: ${localizare}`);
    }
    
    const numeOras = parts[0].toLowerCase()
        .replace(/a/g, 'a')
        .replace(/a/g, 'a')
        .replace(/i/g, 'i')
        .replace(/s/g, 's')
        .replace(/t/g, 't')
        .replace(/\s+/g, '-');
    
    const numeLocalitate = parts[1];
    
    return { numeOras, numeLocalitate };
}

function createImobilCard(imobil) {
    const API_BASE_URL = 'http://localhost:3001';
    const imagePath = imobil.imagini && imobil.imagini.length > 0 ? imobil.imagini[0].url : `${API_BASE_URL}/images/casa1.jpg`;
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