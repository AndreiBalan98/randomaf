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
        const response = await fetch('http://localhost:3001/api/favorites', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const favorites = await response.json();
        
        // Pentru fiecare favorit, încarcă imaginile
        const favoritesWithImages = await Promise.all(
            favorites.map(async (favorite) => {
                try {
                    const imgResponse = await fetch(`http://localhost:3001/api/imagini/${favorite.id}`);
                    const imagini = await imgResponse.json();
                    return { ...favorite, imagini };
                } catch (error) {
                    console.error(`Eroare încărcare imagini pentru ${favorite.id}:`, error);
                    return { ...favorite, imagini: [] };
                }
            })
        );
        
        renderFavoriteCards(favoritesWithImages);
        
    } catch (error) {
        console.error('Eroare la încărcarea favoritelor:', error);
        displayFavoritesError('Eroare la încărcarea favoritelor!');
    }
}

function renderFavoriteCards(favorites) {
    const container = document.getElementById('favoriteCards');
    if (!container) return;
    
    if (!favorites || favorites.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2em; margin-top: 50px;">Încă nu ai dat niciun like!</p>';
        return;
    }
    
    container.innerHTML = favorites.map(favorite => createImobilCard(favorite, true)).join('');
    
    // Event listeners pentru butoanele de detalii
    addCardEventListeners(favorites);
    
    // Event listeners pentru butoanele de like (unlike în acest caz)
    addLikeEventListeners();
}

async function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.imobil-like-btn');
    
    for (const btn of likeButtons) {
        // În favorites, toate sunt deja liked
        btn.classList.add('liked');
        
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const cardElement = this.closest('.imobil-card');
            const anuntId = cardElement.querySelector('.imobil-detalii-btn').getAttribute('data-id');
            
            await toggleLike(anuntId, this);
            
            // Refresh favorites după unlike
            setTimeout(() => loadFavorites(), 500);
        });
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