window.CONFIG = {
    // Server backend
    BACKEND: {
        HOST: 'localhost',
        PORT: 3001,
        BASE_URL: 'http://localhost:3001',
        API: {
            IMOBILE: '/api/imobile',
            COORDS: '/api/coords',
            IMAGINI: '/api/imagini',
            UPLOAD_IMAGINE: '/api/upload-imagine',
            IMAGES_STATIC: '/images',
            AUTH: {
                REGISTER: '/api/auth/register',
                LOGIN: '/api/auth/login',
                CURRENT_USER: '/api/auth/current-user',
                LOGOUT: '/api/auth/logout'
            },
            LIKES: '/api/likes',
            FAVORITES: '/api/favorites'
        }
    },
    
    // Frontend
    FRONTEND: {
        HOST: 'localhost',
        PORT: 8000,
        BASE_URL: 'http://localhost:8000'
    },
    
    getBackendUrl: function(endpoint = '') {
        return this.BACKEND.BASE_URL + endpoint;
    },
    
    getFrontendUrl: function(endpoint = '') {
        return this.FRONTEND.BASE_URL + endpoint;
    },
    
    getImageUrl: function(filename) {
        return this.BACKEND.BASE_URL + this.BACKEND.API.IMAGES_STATIC + '/' + filename;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BACKEND: {
            HOST: 'localhost',
            PORT: 3001
        },
        FRONTEND: {
            HOST: 'localhost',
            PORT: 8000,
            BASE_URL: 'http://localhost:8000'
        }
    };
}
