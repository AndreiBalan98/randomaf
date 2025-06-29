require('./config/urls.js');

const http                  = require('http');
const handleImobileGet      = require('./handlers/imobileGetHandler');
const handleImobileAdd      = require('./handlers/imobileAddHandler');
const handleImagesStatic    = require('./handlers/imagesStaticHandler');
const handleImageUpload     = require('./handlers/imageUploadHandler');
const handleImagesGet       = require('./handlers/imagesGetHandler');
const handleSignUp          = require('./handlers/signUpHandler');
const handleSignIn          = require('./handlers/signInHandler');
const handleLogout          = require('./handlers/logoutHandler');
const handleGetCurrentUser  = require('./handlers/getCurrentUserHandler');
const handleOraseGet        = require('./handlers/getOraseHandler');
const handleLocalitatiGet   = require('./handlers/getLocalitatiHandler');
const { handleLikeToggle, handleGetFavorites }  = require('./handlers/likesHandler');

const server = http.createServer((req, res) => {
    console.log('Cerere primita:', req.method, req.url);
    
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();

        return;
    }

    if (req.method === 'GET' && req.url.startsWith(API_IMOBILE)) {
        handleImobileGet(req, res);
    } else if (req.method === 'POST' && req.url === API_IMOBILE) {
        handleImobileAdd(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(API_IMAGINI + '/')) {
        handleImagesGet(req, res);
    } else if (req.method === 'POST' && req.url === API_UPLOAD_IMAGINE) {
        handleImageUpload(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(API_IMAGES + '/')) {
        handleImagesStatic(req, res);
    } else if (req.method === 'POST' && req.url === API_AUTH_REGISTER) {
        handleSignUp(req, res);
    } else if (req.method === 'POST' && req.url === API_AUTH_LOGIN) {
        handleSignIn(req, res);
    } else if (req.method === 'GET' && req.url === API_AUTH_CURRENT_USER) {
        handleGetCurrentUser(req, res);
    } else if (req.method === 'POST' && req.url === API_AUTH_LOGOUT) {
        handleLogout(req, res);
    } else if (req.method === 'POST' && req.url.startsWith(API_LIKES + '/')) {
        handleLikeToggle(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(API_LIKES + '/')) {
        handleLikeToggle(req, res);
    } else if (req.method === 'GET' && req.url === API_FAVORITES) {
        handleGetFavorites(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(API_ORASE)) {
        handleOraseGet(req, res);
    } else if (req.method === 'GET' && req.url.startsWith(API_LOCALITATI)) {
        handleLocalitatiGet(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', mesaj: 'Not found' }));
    }
});

server.listen(BACKEND_PORT, BACKEND_HOST, () => {
    console.log(`Serverul ruleaza pe ${BACKEND_URL}`);
});