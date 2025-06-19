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
        // Folosește latin1 pentru a păstra datele binare
        const parts = body
        .toString('latin1')
        .split('--' + boundary)
        .filter(p => p.includes('Content-Disposition'));

        let imobil_id = null;
        let fileBuffer = null;
        let fileName = null;

        for (const part of parts) {
            if (part.includes('name="imobil_id"')) {
                imobil_id = part.split('\r\n\r\n')[1]?.trim();
            }
            if (part.includes('name="imagine"')) {
                const match = part.match(/filename="(.+?)"/);
                if (match) {
                    fileName = Date.now() + '-' + match[1];
                    const fileStart = part.indexOf('\r\n\r\n') + 4;
                    const fileEnd = part.lastIndexOf('\r\n');
                    const fileContent = part.substring(fileStart, fileEnd);
                    fileBuffer = Buffer.from(fileContent, 'latin1');
                }
            }
        }

            if (imobil_id && fileBuffer && fileName) {
                if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
                fs.writeFileSync(path.join('uploads', fileName), fileBuffer);
                await pool.query(
                    'INSERT INTO imagini_imobil (imobil_id, url) VALUES ($1, $2)',
                    [imobil_id, 'uploads/' + fileName]
                );
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok', url: 'uploads/' + fileName }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', mesaj: 'Upload invalid!' }));
            }
    });
}

module.exports = handleImageUpload;