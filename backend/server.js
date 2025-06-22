const http                  = require('http');
const handleImobileGet      = require('./handlers/imobileGetHandler');
const handleImobileAdd      = require('./handlers/imobileAddHandler');
const handleCoordsGet       = require('./handlers/coordsGetHandler');
const handleImagesStatic    = require('./handlers/imagesStaticHandler');
const handleImageUpload     = require('./handlers/imageUploadHandler');
const handleImagesGet       = require('./handlers/imagesGetHandler');
const handleSignUp          = require('./handlers/signUpHandler');
const { handleSignIn }      = require('./handlers/signInHandler');
const { handleLikeToggle, handleGetFavorites }  = require('./handlers/likesHandler');
const { handleGetCurrentUser, handleLogout }    = require('./handlers/getCurrentUserHandler');

const hostname              = 'localhost';
const port                  = 3001;

const server = http.createServer((req, res) => {
    console.log('Cerere primita:', req.method, req.url);
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');

    // Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Routing
    if (req.method === 'GET' && req.url.startsWith(APP_CONFIG.API.ENDPOINTS.IMOBILE)) {
        handleImobileGet(req, res);
    } else if (req.method === 'POST' && req.url === APP_CONFIG.API.ENDPOINTS.IMOBILE) {
        handleImobileAdd(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(APP_CONFIG.API.ENDPOINTS.COORDS)) {
        handleCoordsGet(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/api/imagini/')) {
        handleImagesGet(req, res);
    } else if (req.method === 'POST' && req.url === APP_CONFIG.API.ENDPOINTS.UPLOAD_IMAGINE) {
        handleImageUpload(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(APP_CONFIG.STATIC.IMAGES + "/")) {
        handleImagesStatic(req, res);
    } else if (req.method === 'POST' && req.url === APP_CONFIG.API.ENDPOINTS.AUTH.REGISTER) {
        handleSignUp(req, res);
    } else if (req.method === 'POST' && req.url === APP_CONFIG.API.ENDPOINTS.AUTH.LOGIN) {
        handleSignIn(req, res);
    } else if (req.method === 'GET' && req.url === APP_CONFIG.API.ENDPOINTS.AUTH.CURRENT_USER) {
        handleGetCurrentUser(req, res);
    } else if (req.method === 'POST' && req.url === APP_CONFIG.API.ENDPOINTS.AUTH.LOGOUT) {
        handleLogout(req, res);
    } else if (req.method === 'POST' && req.url.startsWith('/api/likes/')) {
        handleLikeToggle(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/api/likes/')) {
        handleLikeToggle(req, res);
    } else if (req.method === 'GET' && req.url === APP_CONFIG.API.ENDPOINTS.FAVORITES) {
        handleGetFavorites(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', mesaj: 'Not found' }));
    }
});

server.listen(port, hostname, () => {
  console.log(`Serverul ruleaza pe http://${hostname}:${port}`);
});