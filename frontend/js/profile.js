// ============================================
// SISTEM DE AUTENTIFICARE - FRONTEND
// ============================================

let currentAuthMode = 'signin'; // 'signin' sau 'signup'

// ============================================
// FUNCȚIA PRINCIPALĂ DE INIȚIALIZARE
// ============================================

function initializeAuthentication() {
    console.log('Inițializare sistem autentificare...');
    
    // Configurare event listeners
    setupEventListeners();
    
    // Setare mod implicit
    setAuthMode('signin');
    
    console.log('Sistem autentificare inițializat cu succes');
}

// ============================================
// CONFIGURARE EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Toggle între Sign In și Sign Up
    const signinToggle = document.getElementById('signin-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    
    if (signinToggle) {
        signinToggle.addEventListener('change', () => {
            if (signinToggle.checked) {
                setAuthMode('signin');
            }
        });
    }
    
    if (signupToggle) {
        signupToggle.addEventListener('change', () => {
            if (signupToggle.checked) {
                setAuthMode('signup');
            }
        });
    }
    
    // Toggle pentru vizibilitatea parolei
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Submit formular
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Validare în timp real
    setupRealTimeValidation();
    
    // Escape key pentru clear messages
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearMessages();
        }
    });
}

// ============================================
// GESTIONAREA MODURILOR DE AUTENTIFICARE
// ============================================

function setAuthMode(mode) {
    currentAuthMode = mode;
    
    // Update toggle buttons
    const signinToggle = document.getElementById('signin-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    
    if (mode === 'signin') {
        if (signinToggle) signinToggle.checked = true;
        if (signupToggle) signupToggle.checked = false;
    } else {
        if (signinToggle) signinToggle.checked = false;
        if (signupToggle) signupToggle.checked = true;
    }
    
    // Update UI elements
    updateUIForMode(mode);
    
    // Clear messages și resetează formularul
    clearMessages();
    resetForm();
    
    console.log(`Mod autentificare schimbat la: ${mode}`);
}

function updateUIForMode(mode) {
    const title = document.getElementById('auth-title');
    const emailField = document.getElementById('email-field');
    const submitText = document.getElementById('submit-text');
    const emailInput = document.getElementById('email');
    
    if (mode === 'signin') {
        // Sign In Mode
        if (title) title.textContent = 'Conectează-te';
        if (emailField) {
            emailField.style.display = 'none';
            if (emailInput) emailInput.removeAttribute('required');
        }
        if (submitText) submitText.textContent = 'Conectează-te';
    } else {
        // Sign Up Mode
        if (title) title.textContent = 'Înregistrează-te';
        if (emailField) {
            emailField.style.display = 'flex';
            if (emailInput) emailInput.setAttribute('required', 'required');
        }
        if (submitText) submitText.textContent = 'Înregistrează-te';
    }
}

// ============================================
// GESTIONAREA VIZIBILITĂȚII PAROLEI
// ============================================

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    
    if (!passwordInput || !toggleButton) return;
    
    const isCurrentlyVisible = passwordInput.type === 'text';
    
    // Toggle input type
    passwordInput.type = isCurrentlyVisible ? 'password' : 'text';
    
    // Update icon
    const eyeIcon = toggleButton.querySelector('.eye-icon');
    if (eyeIcon) {
        if (isCurrentlyVisible) {
            // Show eye icon (password hidden)
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            `;
        } else {
            // Show eye-slash icon (password visible)
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
            `;
        }
    }
}

// ============================================
// VALIDARE FORMULAR
// ============================================

function setupRealTimeValidation() {
    const inputs = ['username', 'email', 'password'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => validateField(inputId));
            input.addEventListener('blur', () => validateField(inputId));
        }
    });
}

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return true;
    
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldId) {
        case 'username':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Numele de utilizator trebuie să aibă cel puțin 3 caractere';
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Numele de utilizator poate conține doar litere, cifre și underscore';
            }
            break;
            
        case 'email':
            if (currentAuthMode === 'signup' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Adresa de email nu este validă';
                }
            }
            break;
            
        case 'password':
            if (value.length < 6) {
                isValid = false;
                errorMessage = 'Parola trebuie să aibă cel puțin 6 caractere';
            }
            break;
    }
    
    // Update input style
    if (value && !isValid) {
        input.style.borderColor = 'var(--error-color)';
        input.style.boxShadow = '0 0 0 2px rgba(192, 0, 0, 0.2)';
        showFieldError(fieldId, errorMessage);
    } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        clearFieldError(fieldId);
    }
    
    return isValid;
}

function validateForm() {
    const requiredFields = ['username', 'password'];
    
    if (currentAuthMode === 'signup') {
        requiredFields.push('email');
    }
    
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        const value = input.value.trim();
        
        if (!value) {
            isValid = false;
            errors.push(`Câmpul ${getFieldLabel(fieldId)} este obligatoriu`);
            return;
        }
        
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    if (!isValid && errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
    }
    
    return isValid;
}

function getFieldLabel(fieldId) {
    const labels = {
        'username': 'Nume utilizator',
        'email': 'Email',
        'password': 'Parolă'
    };
    return labels[fieldId] || fieldId;
}

// ============================================
// GESTIONAREA FORMULARULUI
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();
    
    clearMessages();
    
    if (!validateForm()) {
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Show loading state
    setLoadingState(true);
    
    // Send request to server
    if (currentAuthMode === 'signin') {
        handleSignIn(formData);
    } else {
        handleSignUp(formData);
    }
}

function collectFormData() {
    const data = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };
    
    if (currentAuthMode === 'signup') {
        data.email = document.getElementById('email').value.trim();
    }
    
    return data;
}

async function handleSignIn(data) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Conectare reușită! Redirecționare...', 'success');
            
            // Salvează datele utilizatorului în localStorage
            localStorage.setItem('currentUser', JSON.stringify(result.data));
            
            // TODO: Apelează funcția globală pentru deschiderea paginii de profil
            // openProfilePage();
            
            setTimeout(() => {
                // Comentariu: Aici va fi apelată funcția globală pentru navigarea la profil
                console.log('Redirecționare către profil...');
            }, 1500);
            
        } else {
            showMessage(result.message || 'Eroare la conectare', 'error');
        }
    } catch (error) {
        console.error('Eroare la conectare:', error);
        showMessage('Eroare de conexiune. Încercați din nou.', 'error');
    } finally {
        setLoadingState(false);
    }
}

async function handleSignUp(data) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Cont creat cu succes! Conectează-te acum.', 'success');
            
            // Switch to sign in mode after delay
            setTimeout(() => {
                setAuthMode('signin');
                document.getElementById('username').value = data.username;
            }, 2000);
            
        } else {
            showMessage(result.message || 'Eroare la înregistrare', 'error');
        }
    } catch (error) {
        console.error('Eroare la înregistrare:', error);
        showMessage('Eroare de conexiune. Încercați din nou.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// ============================================
// UTILS ȘI HELPERS
// ============================================

function showMessage(message, type = 'info') {
    const messagesContainer = document.getElementById('auth-messages');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `auth-message auth-message--${type}`;
    messageElement.innerHTML = message;
    
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(messageElement);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        clearMessages();
    }, 5000);
}

function clearMessages() {
    const messagesContainer = document.getElementById('auth-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const fieldContainer = field.closest('.auth-field');
    if (!fieldContainer) return;
    
    // Remove existing error
    const existingError = fieldContainer.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    fieldContainer.appendChild(errorElement);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const fieldContainer = field.closest('.auth-field');
    if (!fieldContainer) return;
    
    const errorElement = fieldContainer.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function resetForm() {
    const form = document.getElementById('auth-form');
    if (form) {
        form.reset();
    }
    
    // Clear all field errors
    const fieldErrors = document.querySelectorAll('.field-error');
    fieldErrors.forEach(error => error.remove());
    
    // Reset input styles
    const inputs = document.querySelectorAll('.auth-field input');
    inputs.forEach(input => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
}

function setLoadingState(loading) {
    const submitButton = document.getElementById('auth-submit');
    const submitText = document.getElementById('submit-text');
    const submitIcon = submitButton?.querySelector('.submit-icon');
    
    if (loading) {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
        }
        if (submitText) {
            submitText.textContent = 'Se procesează...';
        }
        if (submitIcon) {
            submitIcon.style.animation = 'spin 1s linear infinite';
        }
    } else {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }
        if (submitText) {
            const defaultText = currentAuthMode === 'signin' ? 'Conectează-te' : 'Înregistrează-te';
            submitText.textContent = defaultText;
        }
        if (submitIcon) {
            submitIcon.style.animation = '';
        }
    }
}

// Export pentru testare (dacă e nevoie)
window.initializeAuthentication = initializeAuthentication;