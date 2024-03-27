const jwt = require('jsonwebtoken');

const secretKey = 'secret';

function generateToken(id, type) {
    return jwt.sign({ id, type }, secretKey, { expiresIn: '24h' });
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

function getTokenData(token) {
    if (token==undefined){
        return null;
    }
    const tokenParts = token.split(' ');
    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer') {
        const token = tokenParts[1];
        // Verify the token
        const decodedToken = verifyToken(token);

        // Check if the token is valid
        if (decodedToken) {
        const { id, type } = decodedToken;
        return { id, type };
        }
    }
    return null;
}

function checkUserType(token, expected){
    if (token==undefined){
        return false;
    }
    const { type } = getTokenData(token);
    return type == expected;
}

module.exports = { generateToken, getTokenData, checkUserType };
