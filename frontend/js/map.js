// Funcția de inițializare pentru hartă
function initializeMap() {
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

    console.log('Harta Leaflet a fost inițializată cu succes');
}

window.initializeMap = initializeMap;