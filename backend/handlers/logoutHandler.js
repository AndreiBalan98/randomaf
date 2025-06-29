const { parseCookies } = require('../utils/helperFunctions');
const { deleteSession } = require('../auth/sessions');

function handleLogout(req, res) {
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionToken = cookies.session_token;
        
    if (sessionToken) deleteSession(sessionToken);
        
    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Set-Cookie': 'session_token=; HttpOnly; Path=/; Max-Age=0'
    });
        
    res.end(JSON.stringify({ 
        success: true, 
        message: 'Deconectare reusita' 
    }));
}

module.exports = handleLogout;