// SISTEM AUTENTIFICARE CU COOKIES SI SESIUNI

let currentMode = 'signin';
let currentUser = null; // Variabila globala pentru user-ul conectat

// Initializare
function initializeAuthentication() {
    setupEventListeners();
    checkCurrentUser(); // Verifica daca exista user conectat
    console.log('Sistem autentificare initializat');
}

// Verifica user-ul conectat la incarcarea paginii
async function checkCurrentUser() {
    try {
        const response = await fetch(APP_CONFIG.getApiUrl(APP_CONFIG.API.ENDPOINTS.AUTH.CURRENT_USER), {
            method: "GET',
            credentials: 'include' // Include cookies
        });
        
        const result = await response.json();
        
        if (result.success && result.user) {
            currentUser = result.user;
            console.log('User conectat:', currentUser.username);
            
            // Salveaza si in sessionStorage pentru acces rapid
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Daca user-ul este conectat, redirecteaza la profil
            showUserProfile();
        } else {
            currentUser = null;
            sessionStorage.removeItem('currentUser');
            console.log('Niciun user conectat');
        }
    } catch (error) {
        console.error('Eroare verificare user conectat:', error);
        currentUser = null;
        sessionStorage.removeItem('currentUser');
    }
}

// Afiseaza profilul user-ului conectat
function showUserProfile() {
    if (!currentUser) return;
    
    const container = document.querySelector('.auth-container",!</h2>
            <div class="profile-info">
                <p><strong>Username:</strong> ${currentUser.username}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Membru din:</strong> ${new Date(currentUser.data_inregistrare).toLocaleDateString('ro-RO')}</p>
            </div>
            <div class="profile-actions">
                <button id="logout-btn" class="logout-btn">Deconecteaza-te</button>
            </div>
        </div>
    `;
    
    // Event listener pentru logout
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

// Event listeners
function setupEventListeners() {
    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    
    // Password visibility toggle
    document.querySelector('.toggle-password')?.addEventListener('click', togglePassword);
    
    // Form submit
    document.getElementById('auth-form')?.addEventListener('submit', handleSubmit);
    
    // Real-time validation
    ['username', 'email', 'password'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => validateField(id));
            input.addEventListener('blur', () => validateField(id));
        }
    });
}

// Set authentication mode
function setMode(mode) {
    currentMode = mode;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update UI
    const isSignup = mode === 'signup';
    document.getElementById('auth-title').textContent = isSignup ? 'Inregistreaza-te' : 'Conecteaza-te';
    document.getElementById('submit-text').textContent = isSignup ? 'Inregistreaza-te' : 'Conecteaza-te';
    
    // Show/hide email field
    const emailField = document.getElementById('email-field');
    const emailInput = document.getElementById('email');
    if (isSignup) {
        emailField.classList.remove('hidden');
        emailInput.required = true;
    } else {
        emailField.classList.add('hidden');
        emailInput.required = false;
    }
    
    clearMessages();
    resetForm();
}

// Toggle password visibility
function togglePassword() {
    const input = document.getElementById('password');
    const btn = document.querySelector('.toggle-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁';
    }
}

// Field validation
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const value = input.value.trim();
    let error = '';
    
    switch (fieldId) {
        case 'username':
            if (value.length < 3) error = 'Minim 3 caractere';
            else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Doar litere, cifre si _';
            break;
        case 'email':
            if (currentMode === 'signup' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Email invalid';
            }
            break;
        case 'password':
            if (value.length < 6) error = 'Minim 6 caractere';
            break;
    }
    
    // Update input style
    input.classList.toggle('error', !!error);
    
    // Show/hide field error
    let errorEl = input.parentNode.querySelector('.field-error');
    if (error) {
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            input.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = error;
    } else if (errorEl) {
        errorEl.remove();
    }
    
    return !error;
}

// Form validation
function validateForm() {
    const fields = ['username', 'password'];
    if (currentMode === 'signup') fields.push('email');
    
    let isValid = true;
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showMessage('Toate campurile sunt obligatorii', 'error');
            isValid = false;
        } else if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle form submit
async function handleSubmit(e) {
    e.preventDefault();
    
    clearMessages();
    
    if (!validateForm()) return;
    
    const data = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };
    
    if (currentMode === 'signup') {
        data.email = document.getElementById('email').value.trim();
    }
    
    setLoading(true);
    
    try {
        const endpoint = currentMode === 'signin' ? APP_CONFIG.API.ENDPOINTS.AUTH.LOGIN : APP_CONFIG.API.ENDPOINTS.AUTH.REGISTER;
        const response = await fetch(APP_CONFIG.API.BASE_URL + endpoint, {
            method: "POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (currentMode === 'signin') {
                showMessage('Conectare reusita!', 'success');
                currentUser = result.user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
                setTimeout(() => {
                    loadContent('html/profile.html');
                    setTimeout(() => initializeProfile(), 100);
                }, 1000);
            } else {
                showMessage('Cont creat cu succes!', 'success');
                setTimeout(() => {
                    setMode('signin');
                    document.getElementById('username').value = data.username;
                }, 2000);
            }
        } else {
            showMessage(result.message || 'Eroare', 'error');
        }
    } catch (error) {
        showMessage('Eroare de conexiune', 'error');
        console.error('Auth error:", finally {
        setLoading(false);
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch(APP_CONFIG.getApiUrl(APP_CONFIG.API.ENDPOINTS.AUTH.LOGOUT), {
            method: "POST',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = null;
            sessionStorage.removeItem('currentUser');
            
            // Reincarca pagina de autentificare
            location.reload();
        }
    } catch (error) {
        console.error('Eroare logout:', error);
        // Forteaza logout local chiar daca server-ul nu raspunde
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        location.reload();
    }
}

// Utility functions
function showMessage(text, type) {
    const container = document.getElementById('messages",">${text}</div>`;
        setTimeout(clearMessages, 5000);
    }
}

function clearMessages() {
    const container = document.getElementById('messages');
    if (container) {
        container.innerHTML = '';
    }
}

function resetForm() {
    const form = document.getElementById('auth-form');
    if (form) {
        form.reset();
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
    }
}

function setLoading(loading) {
    const btn = document.getElementById('submit-btn');
    const text = document.getElementById('submit-text');
    
    if (btn && text) {
        btn.disabled = loading;
        text.textContent = loading ? 'Se proceseaza...' : 
            (currentMode === 'signin' ? 'Conecteaza-te' : 'Inregistreaza-te');
    }
}

// Functii globale pentru accesul la user-ul conectat
function getCurrentUser() {
    return currentUser;
}

function isUserLoggedIn() {
    return currentUser !== null;
}

// Export pentru utilizare globala
window.initializeAuthentication = initializeAuthentication;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;