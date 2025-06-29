async function initializeProfile() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) {
        loadContent('html/auth.html');
        setTimeout(() => initializeAuthentication(), 100);
        return;
    }
    
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('email-display').textContent = user.email;
    document.getElementById('date-display').textContent = new Date(user.data_inregistrare).toLocaleDateString('ro-RO');
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    await loadMyAnnouncements(user.id);
}

async function loadMyAnnouncements(userId) {
    try {
        const response = await fetch(`${BACKEND_URL}${API_IMOBILE}?userId=${userId}`);
        const myAnnouncements = await response.json();
        
        const container = document.getElementById('myImobileCards');
        
        if (myAnnouncements.length === 0) {
            container.innerHTML = '<p>Nu ai anunturi inca.</p>';
            return;
        }
        
        container.innerHTML = myAnnouncements.map(imobil => createImobilCard(imobil)).join('');
        await addLikeEventListeners();
        
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
        await fetch(BACKEND_URL + API_AUTH_LOGOUT, {
            method: 'POST',
            credentials: 'include'
        });
        
        sessionStorage.removeItem('currentUser');
        loadContent('html/home.html');
        setTimeout(() => initializeHome(), 100);
        
    } catch (error) {
        console.error('Eroare logout:', error);
        sessionStorage.removeItem('currentUser');
        loadContent('html/home.html');
        setTimeout(() => initializeHome(), 100);
    }
}

window.initializeProfile = initializeProfile;