async function initializeProfile() {
    // Verifică din nou dacă user-ul este conectat
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
    
    // Event listener pentru logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Încarcă anunțurile user-ului
    await loadMyAnnouncements(user.id);
}

async function loadMyAnnouncements(userId) {
    try {
        // Folosește parametrul userId pentru a filtra anunțurile
        const response = await fetch(`http://localhost:3001/api/imobile?userId=${userId}`);
        const myAnnouncements = await response.json();
        
        const container = document.getElementById('myImobileCards');
        
        if (myAnnouncements.length === 0) {
            container.innerHTML = '<p>Nu ai anunțuri încă.</p>';
            return;
        }
        
        // Generează cardurile folosind funcția din home.js
        container.innerHTML = myAnnouncements.map(imobil => createImobilCard(imobil)).join('');
        
        // Event listeners pentru butoanele de detalii
        document.querySelectorAll('.imobil-detalii-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const cardId = this.getAttribute('data-id');
                loadContent(`html/detalii.html?id=${cardId}`);
                setTimeout(() => initializeDetalii(cardId), 100);
            });
        });
        
    } catch (error) {
        console.error('Eroare încărcare anunțuri:', error);
        document.getElementById('myImobileCards').innerHTML = '<p>Eroare la încărcarea anunțurilor.</p>';
    }
}

async function handleLogout() {
    try {
        await fetch('http://localhost:3001/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        sessionStorage.removeItem('currentUser');
        loadContent('html/home.html');
        setTimeout(() => initializeHome(), 100);
        
    } catch (error) {
        console.error('Eroare logout:', error);
        // Forțează logout local
        sessionStorage.removeItem('currentUser');
        loadContent('html/home.html');
        setTimeout(() => initializeHome(), 100);
    }
}

// Export global
window.initializeProfile = initializeProfile;