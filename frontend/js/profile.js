async function initializeProfile() {
    // Verifica din nou daca user-ul este conectat
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) {
        loadContent('html/auth.html');
        setTimeout(() => initializeAuthentication(), 100);
        return;
    }
    
    // Afiseaza datele user-ului
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('email-display').textContent = user.email;
    document.getElementById('date-display').textContent = new Date(user.data_inregistrare).toLocaleDateString('ro-RO');
    
    // Event listener pentru logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Incarca anunturile user-ului
    await loadMyAnnouncements(user.id);
}

async function loadMyAnnouncements(userId) {
    try {
        // Foloseste parametrul userId pentru a filtra anunturile
        const response = await fetch(APP_CONFIG.API.BASE_URL + "/api/imobile?userId=${userId}`);
        const myAnnouncements = await response.json();
        
        const container = document.getElementById("myImobileCards');
        
        if (myAnnouncements.length === 0) {
            container.innerHTML = '<p>Nu ai anunturi inca.</p>';
            return;
        }
        
        // Genereaza cardurile folosind functia din home.js
        container.innerHTML = myAnnouncements.map(imobil => createImobilCard(imobil)).join('');
        await addLikeEventListeners();
        
        // Event listeners pentru butoanele de detalii
        document.querySelectorAll('.imobil-detalii-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const cardId = this.getAttribute('data-id');
                loadContent(`html/detalii.html?id=${cardId}`);
                setTimeout(() => initializeDetalii(cardId), 100);
            });
        });
        
    } catch (error) {
        console.error('Eroare incarcare anunturi:', error);
        document.getElementById('myImobileCards').innerHTML = '<p>Eroare la incarcarea anunturilor.</p>';
    }
}

async function handleLogout() {
    try {
        await fetch(APP_CONFIG.API.BASE_URL + APP_CONFIG.API.ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
            credentials: 'include'
        });
        
        sessionStorage.removeItem('currentUser');
        loadContent('html/home.html');
        setTimeout(() => initializeHome(), 100);
        
    } catch (error) {
        console.error('Eroare logout:', error);
        // Forteaza logout local
        sessionStorage.removeItem('currentUser');
        loadContent('html/home.html');
        setTimeout(() => initializeHome(), 100);
    }
}

// Export global
window.initializeProfile = initializeProfile;