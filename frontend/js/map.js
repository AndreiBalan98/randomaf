// Variabile globale pentru hartă
let map;
let initialView = [51.505, -0.09];
let initialZoom = 13;

// Inițializarea hărții
function initMap() {
    // Verifică dacă containerul există
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Verifică dacă Leaflet este încărcat
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    try {
        // Creează harta
        map = L.map('map').setView(initialView, initialZoom);

        // Adaugă tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Adaugă marker de exemplu
        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('Bine ai venit!<br>Aceasta este harta ta.')
            .openPopup();

        // Eveniment pentru click pe hartă
        map.on('click', function(e) {
            console.log('Click position:', e.latlng);
            L.popup()
                .setLatLng(e.latlng)
                .setContent('Coordonate: ' + e.latlng.toString())
                .openOn(map);
        });

        console.log('Harta a fost inițializată cu succes');

    } catch (error) {
        console.error('Eroare la inițializarea hărții:', error);
        showMapError();
    }
}

// Funcție pentru resetarea view-ului hărții
function resetMapView() {
    if (map) {
        map.setView(initialView, initialZoom);
    }
}

// Funcție pentru fullscreen
function toggleFullscreen() {
    const mapContainer = document.querySelector('.map-container');
    const fullscreenBtn = event.target;
    
    if (mapContainer.classList.contains('fullscreen')) {
        mapContainer.classList.remove('fullscreen');
        fullscreenBtn.textContent = 'Fullscreen';
        
        // Redimensionează harta după ieșirea din fullscreen
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 300);
    } else {
        mapContainer.classList.add('fullscreen');
        fullscreenBtn.textContent = 'Exit Fullscreen';
        
        // Redimensionează harta după intrarea în fullscreen
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 300);
    }
}

// Funcție pentru afișarea erorilor
function showMapError() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; 
                        flex-direction: column; color: #666; font-family: Arial, sans-serif;">
                <div style="font-size: 48px; margin-bottom: 20px;">🗺️</div>
                <div style="font-size: 18px; margin-bottom: 10px;">Eroare la încărcarea hărții</div>
                <div style="font-size: 14px;">Vă rugăm să reîncărcați pagina</div>
            </div>
        `;
    }
}

// Funcție pentru redimensionarea hărții când se schimbă dimensiunea ferestrei
function handleResize() {
    if (map) {
        map.invalidateSize();
    }
}

// Funcție pentru curățarea hărții la schimbarea paginii
function destroyMap() {
    if (map) {
        map.remove();
        map = null;
    }
}

// Event listeners
window.addEventListener('resize', handleResize);

// Eveniment pentru ESC key în fullscreen
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer && mapContainer.classList.contains('fullscreen')) {
            const fullscreenBtn = document.querySelector('.map-control-btn');
            if (fullscreenBtn && fullscreenBtn.textContent === 'Exit Fullscreen') {
                toggleFullscreen();
            }
        }
    }
});

// Inițializare automată când DOM-ul este gata
document.addEventListener('DOMContentLoaded', function() {
    // Verifică dacă suntem pe pagina cu harta
    if (document.getElementById('map')) {
        initMap();
    }
});

// Export pentru utilizare externă
window.mapModule = {
    init: initMap,
    destroy: destroyMap,
    reset: resetMapView,
    toggleFullscreen: toggleFullscreen
};

console.log('Map script loaded successfully');