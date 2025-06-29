const activeSessions = new Map();

function addSession(sessionToken, sessionData) {
    activeSessions.set(sessionToken, sessionData);
}

function getActiveSession(sessionToken) {
    return activeSessions.get(sessionToken) || null;
}

function deleteSession(sessionToken) {
    return activeSessions.delete(sessionToken);
}

module.exports = {
    addSession,
    getActiveSession, 
    deleteSession 
};