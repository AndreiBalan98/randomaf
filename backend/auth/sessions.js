const activeSessions = new Map();

function getActiveSession(sessionToken) {
    return activeSessions.get(sessionToken) || null;
}

function deleteSession(sessionToken) {
    return activeSessions.delete(sessionToken);
}

module.exports = {
    activeSessions,
    getActiveSession, 
    deleteSession 
};