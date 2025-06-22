// Configuratie globala pentru aplicatie
const APP_CONFIG = {
  // URL-uri API
  API: {
    BASE_URL: APP_CONFIG.API.BASE_URL,
    ENDPOINTS: {
      // Imobile
      IMOBILE: APP_CONFIG.API.ENDPOINTS.IMOBILE,
      IMAGINI: APP_CONFIG.API.ENDPOINTS.IMAGINI,
      UPLOAD_IMAGINE: APP_CONFIG.API.ENDPOINTS.UPLOAD_IMAGINE,
      
      // Coordonate
      COORDS: APP_CONFIG.API.ENDPOINTS.COORDS,
      
      // Autentificare
      AUTH: {
        REGISTER: APP_CONFIG.API.ENDPOINTS.AUTH.REGISTER,
        LOGIN: APP_CONFIG.API.ENDPOINTS.AUTH.LOGIN,
        LOGOUT: APP_CONFIG.API.ENDPOINTS.AUTH.LOGOUT,
        CURRENT_USER: APP_CONFIG.API.ENDPOINTS.AUTH.CURRENT_USER
      },
      
      // Likes & Favorites
      LIKES: APP_CONFIG.API.ENDPOINTS.LIKES,
      FAVORITES: APP_CONFIG.API.ENDPOINTS.FAVORITES
    }
  },
  
  // URL-uri pentru resurse statice
  STATIC: {
    IMAGES: '/images',
    DEFAULT_IMAGE: APP_CONFIG.STATIC.DEFAULT_IMAGE
  },
  
  // Functii helper pentru construirea URL-urilor complete
  getApiUrl: function(endpoint) {
    return this.API.BASE_URL + endpoint;
  },
  
  getImageUrl: function(imagePath) {
    // Daca e deja URL complet, returneaza-l
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }
    // Altfel, construieste URL-ul complet
    return this.API.BASE_URL + (imagePath || this.STATIC.DEFAULT_IMAGE);
  },
  
  buildUrl: function(base, ...parts) {
    return base + parts.join('');
  }
};

// Freeze config pentru a preveni modificari accidentale
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.API);
Object.freeze(APP_CONFIG.API.ENDPOINTS);
Object.freeze(APP_CONFIG.API.ENDPOINTS.AUTH);
Object.freeze(APP_CONFIG.STATIC);

// Export global
window.APP_CONFIG = APP_CONFIG;
