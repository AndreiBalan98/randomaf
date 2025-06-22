const http                  = require('http');
const handleImobileGet      = require('./handlers/imobileGetHandler');
const handleImobileAdd      = require('./handlers/imobileAddHandler');
const handleCoordsGet       = require('./handlers/coordsGetHandler');
const handleImagesStatic    = require('./handlers/imagesStaticHandler');
const handleImageUpload     = require('./handlers/imageUploadHandler');
const handleImagesGet       = require('./handlers/imagesGetHandler');

const hostname              = 'localhost';
const port                  = 3001;

const server = http.createServer((req, res) => {
    console.log('Cerere primită:', req.method, req.url);
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Routing
    if (req.method === 'GET' && req.url.startsWith('/api/imobile')) {
        handleImobileGet(req, res);
    } else if (req.method === 'POST' && req.url === '/api/imobile') {
        handleImobileAdd(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/api/coords')) {
        handleCoordsGet(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/api/imagini/')) {
        handleImagesGet(req, res);
    } else if (req.method === 'POST' && req.url === '/api/upload-imagine') {
        handleImageUpload(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/images/')) {
        handleImagesStatic(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', mesaj: 'Not found' }));
    }
});

server.listen(port, hostname, () => {
  console.log(`Serverul rulează pe http://${hostname}:${port}`);
});