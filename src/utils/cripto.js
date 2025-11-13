const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'DdKOyikRszabgDPVkYOMHPF9q4097YF6';

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + '_' + encrypted.toString('hex');
}

function decrypt(hash) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrypted.toString();
}

function getPassDecrypt(pass) {
    const decryptedPass = pass.split('_');
    return decrypt({iv: decryptedPass[0], content: decryptedPass[1]});
}

module.exports = {
    encrypt,
    decrypt,
    getPassDecrypt
};