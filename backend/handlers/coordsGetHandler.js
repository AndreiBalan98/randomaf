function handleCoordsGet(req, res) {
    const fs = require('fs');
    const path = require('path');
    const url = require('url');

    try {
        // Parse query parameters
        const parsedUrl = url.parse(req.url, true);
        const { numeOras, numeLocalitate } = parsedUrl.query;

        // Verifică dacă parametrii sunt prezenți
        if (!numeOras || !numeLocalitate) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Parametrii numeOras și numeLocalitate sunt obligatorii' }));
            return;
        }

        // Construiește calea către fișierul coordinates.json
        const coordsFilePath = path.join(__dirname, 'coords', 'coordinates.json');

        // Verifică dacă fișierul există
        if (!fs.existsSync(coordsFilePath)) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Fișierul coordinates.json nu a fost găsit' }));
            return;
        }

        // Citește fișierul coordinates.json
        const coordsData = JSON.parse(fs.readFileSync(coordsFilePath, 'utf8'));

        // Construiește cheia pentru căutare (format: "numeOras/numeLocalitate")
        const searchKey = `${numeOras}/${numeLocalitate}`;

        // Caută coordonatele în fișier
        const coordinates = coordsData[searchKey];

        if (coordinates) {
            // Returnează coordonatele găsite
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                lat: coordinates.lat,
                lon: coordinates.lon
            }));
        } else {
            // Returnează null dacă nu s-au găsit coordonate
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(null));
        }

    } catch (error) {
        console.error('Eroare în handleCoordsGet:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Eroare internă a serverului' }));
    }
}