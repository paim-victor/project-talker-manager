const crypto = require('crypto');

const genToken = () => ({ token: crypto.randomBytes(8).toString('hex') });

module.exports = genToken;