async function initializeFavorites() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) {
        loadContent('html/auth.html');
        setTimeout(() => initializeAuthentication(), 100);
        return;
    }
    
    await loadFavorites();
}

async function loadFavorites() {
    try {
        const response = await fetch(BACKEND_URL + API_FAVORITES, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const favorites = await response.json();
        
        // Pentru fiecare favorit, incarca imaginile
        const favoritesWithImages = await Promise.all(
            favorites.map(async (favorite) => {
                try {
                    const imgResponse = await fetch(`${BACKEND_URL}${API_IMAGINI}/${favorite.id}`);
                    const imagini = await imgResponse.json();
                    return { ...favorite, imagini };
                } catch (error) {
                    console.error(`Eroare incarcare imagini pentru ${favorite.id}:`, error);
                    return { ...favorite, imagini: [] };
                }
            })
        );
        
        renderFavoriteCards(favoritesWithImages);
        
    } catch (error) {
        console.error('Eroare la incarcarea favoritelor:', error);
        displayFavoritesError('Eroare la incarcarea favoritelor!');
    }
}

function renderFavoriteCards(favorites) {
    const container = document.getElementById('favoriteCards');
    if (!container) return;
    
    if (!favorites || favorites.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2em; margin-top: 50px;">Inca nu ai dat niciun like!</p>';
        return;
    }
    
    // SCHIMBAREA IMPORTANTA: Nu mai fortam isLiked = true
    container.innerHTML = favorites.map(favorite => createImobilCard(favorite, false)).join('');
    
    // Event listeners pentru butoanele de detalii
    addCardEventListeners(favorites);
    
    // Event listeners pentru butoanele de like
    addLikeEventListeners();
}

async function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.imobil-like-btn');
    
    for (const btn of likeButtons) {
        const cardElement = btn.closest('.imobil-card');
        const anuntId = cardElement.querySelector('.imobil-detalii-btn').getAttribute('data-id');
        
        // SCHIMBAREA IMPORTANTA: Verifica statusul real in loc sa fortezi liked
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user) {
            const isLiked = await checkLikeStatus(anuntId);
            if (isLiked) {
                btn.classList.add('liked');
            } else {
                btn.classList.remove('liked');
            }
        }
        
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const cardElement = this.closest('.imobil-card');
            const anuntId = cardElement.querySelector('.imobil-detalii-btn').getAttribute('data-id');
            
            await toggleLike(anuntId, this);
            
            // Refresh favorites dupa unlike
            setTimeout(() => loadFavorites(), 500);
        });
    }
}

async function checkLikeStatus(anuntId) {
    try {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!user) {
            return false; // Daca nu e conectat, sigur nu are like
        }
        
        const response = await fetch(`${BACKEND_URL}${API_LIKES}?anuntId=${anuntId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.liked;
        }
    } catch (error) {
        console.error('Eroare verificare like:', error);
    }
    return false;
}

async function toggleLike(anuntId, buttonElement) {
    try {
        const response = await fetch(`${BACKEND_URL}${API_LIKES}?anuntId=${anuntId}`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Trebuie sa fii conectat pentru a adauga la favorite!');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Update visual al butonului
        if (result.liked) {
            buttonElement.classList.add('liked');
        } else {
            buttonElement.classList.remove('liked');
        }
        
    } catch (error) {
        console.error('Eroare la toggle like:', error);
    }
}

function displayFavoritesError(message) {
    const container = document.getElementById('favoriteCards');
    if (container) {
        container.innerHTML = `<p style="color:red; text-align: center;">${message}</p>`;
    }
}

// Export global
window.initializeFavorites = initializeFavorites;