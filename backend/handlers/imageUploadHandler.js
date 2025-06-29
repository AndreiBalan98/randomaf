require('../config/urls');

const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function handleImageUpload(req, res) {    
    const boundary = req.headers['content-type'].split('boundary=')[1];
    let body = Buffer.alloc(0);

    req.on('data', chunk => {
        body = Buffer.concat([body, chunk]);
    });

    req.on('end', async () => {
        const parts = body
            .toString('latin1')
            .split('--' + boundary)
            .filter(p => p.includes('Content-Disposition'));

        let anunt_id = null;
        let ordine = null;
        let fileBuffer = null;
        let originalFileName = null;

        for (const part of parts) {
            if (part.includes('name="anunt_id"')) {
                anunt_id = parseInt(part.split('\r\n\r\n')[1]?.trim());
            }

            if (part.includes('name="ordine"')) {
                ordine = parseInt(part.split('\r\n\r\n')[1]?.trim());
            }

            if (part.includes('name="imagine"')) {
                const match = part.match(/filename="(.+?)"/);

                if (match) {
                    originalFileName = match[1];
                    const fileStart = part.indexOf('\r\n\r\n') + 4;
                    const fileEnd = part.lastIndexOf('\r\n');
                    const fileContent = part.substring(fileStart, fileEnd);
                    fileBuffer = Buffer.from(fileContent, 'latin1');
                }
            }
        }

        if (anunt_id && ordine && fileBuffer && originalFileName) {
            try {
                const fileExtension = path.extname(originalFileName);
                const newFileName = `${anunt_id}x${ordine}${fileExtension}`;
                const imagesDir = path.join(__dirname, '..', 'images');
                const filePath = path.join(imagesDir, newFileName);
                const fullImageUrl = `${BACKEND_URL}${API_IMAGES}/${newFileName}`;

                fs.writeFileSync(filePath, fileBuffer);

                await pool.query(
                    'INSERT INTO imagini (anunt_id, url, ordine) VALUES ($1, $2, $3)',
                    [anunt_id, fullImageUrl, ordine]
                );
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'ok', 
                    url: fullImageUrl, 
                    fileName: newFileName 
                }));
                
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'error', 
                    mesaj: 'Eroare la salvarea imaginii: ' + error.message 
                }));
            }
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'error', 
                mesaj: 'Date incomplete pentru upload. Necesare: anunt_id, ordine, imagine.' 
            }));
        }
    });
}

module.exports = handleImageUpload;