const jwt = require('jsonwebtoken');
const secret = 'mysecret';
const expiresIn = '600';

function generateToken(id) {   
    return jwt.sign({id}, secret, { expiresIn: expiresIn });
}

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido.' });
    }
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, mensagem: 'Token Expirado.'});
        }

        req.userId = decoded.id;
        next();
    }); 
}

module.exports = {
    generateToken,
    verifyToken
};