function parseCookies(cookieString) {
    const cookies = {};
    if (!cookieString) return cookies;
    
    cookieString.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
    });
    
    return cookies;
}

module.exports = { 
    parseCookies 
};