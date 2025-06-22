function initializeProfile() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) {
        loadContent('html/auth.html');
        setTimeout(() => initializeAuthentication(), 100);
        return;
    }
    
    // Afișează datele user-ului
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('email-display').textContent = user.email;
    document.getElementById('date-display').textContent = new Date(user.data_inregistrare).toLocaleDateString('ro-RO');
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Încarcă anunțurile
    loadMyAnnouncements();
}

async function loadMyAnnouncements() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Trimite user_id ca parametru
    const response = await fetch(`${API_BASE_URL}/api/imobile?userId=${user.id}`);
    const myAnnouncements = await response.json();
    
    try {
        // Încarcă toate anunțurile
        const response = await fetch(`${API_BASE_URL}/api/imobile`);
        const allAnnouncements = await response.json();
        
        // Filtrează doar anunțurile user-ului curent
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        const myAnnouncements = allAnnouncements.filter(anunt => 
            anunt.user_id === user.id || anunt.username === user.username
        );
        
        const container = document.getElementById('myImobileCards');
        
        if (myAnnouncements.length === 0) {
            container.innerHTML = '<p>Nu ai anunțuri încă.</p>';
            return;
        }
        
        // Generează cardurile (refolosim logica din home.js)
        container.innerHTML = myAnnouncements.map(imobil => createImobilCard(imobil)).join('');
        
        // Event listeners pentru detalii
        document.querySelectorAll('.imobil-detalii-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const cardId = this.getAttribute('data-id');
                loadContent(`html/detalii.html?id=${cardId}`);
                initializeDetalii(cardId);
            });
        });
        
    } catch (error) {
        console.error('Eroare încărcare anunțuri:', error);
        document.getElementById('myImobileCards').innerHTML = '<p>Eroare la încărcarea anunțurilor.</p>';
    }
}

// Funcția handleLogout
async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        sessionStorage.removeItem('currentUser');
        loadContent('html/auth.html');
        setTimeout(() => initializeAuthentication(), 100);
        
    } catch (error) {
        console.error('Eroare logout:', error);
    }
}