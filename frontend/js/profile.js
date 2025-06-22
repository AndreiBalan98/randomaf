// SISTEM AUTENTIFICARE SIMPLIFICAT

let currentMode = 'signin';

// Inițializare
function initializeAuthentication() {
    setupEventListeners();
    console.log('Sistem autentificare inițializat');
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
    document.getElementById('auth-title').textContent = isSignup ? 'Înregistrează-te' : 'Conectează-te';
    document.getElementById('submit-text').textContent = isSignup ? 'Înregistrează-te' : 'Conectează-te';
    
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
            else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Doar litere, cifre și _';
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
            showMessage('Toate câmpurile sunt obligatorii', 'error');
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
        const endpoint = currentMode === 'signin' ? '/api/auth/login' : '/api/auth/register';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (currentMode === 'signin') {
                showMessage('Conectare reușită!', 'success');
                loadContent('html/profile.html');
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
        console.error('Auth error:', error);
    } finally {
        setLoading(false);
    }
}

// Utility functions
function showMessage(text, type) {
    const container = document.getElementById('messages');
    container.innerHTML = `<div class="message ${type}">${text}</div>`;
    setTimeout(clearMessages, 5000);
}

function clearMessages() {
    document.getElementById('messages').innerHTML = '';
}

function resetForm() {
    document.getElementById('auth-form').reset();
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
}

function setLoading(loading) {
    const btn = document.getElementById('submit-btn');
    const text = document.getElementById('submit-text');
    
    btn.disabled = loading;
    text.textContent = loading ? 'Se procesează...' : 
        (currentMode === 'signin' ? 'Conectează-te' : 'Înregistrează-te');
}

// Export pentru utilizare globală
window.initializeAuthentication = initializeAuthentication;