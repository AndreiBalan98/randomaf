const { getActiveSession } = require('../auth/sessions');
const { parseCookies } = require('../utils/helperFunctions');

function handleGetCurrentUser(req, res) {
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionToken = cookies.session_token;
        
    if (!sessionToken) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            user: null, 
            message: 'Niciun utilizator conectat' 
        }));

        return;
    }
        
    const userSession = getActiveSession(sessionToken);
        
    if (!userSession) {
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Set-Cookie': 'session_token=; HttpOnly; Path=/; Max-Age=0'
        });

        res.end(JSON.stringify({ 
            success: true, 
            user: null, 
            message: 'Sesiune expirata' 
        }));
        
        return;
    }
        
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        success: true, 
        user: userSession,
        message: 'Utilizator conectat gasit'
    }));
}

module.exports = handleGetCurrentUser;