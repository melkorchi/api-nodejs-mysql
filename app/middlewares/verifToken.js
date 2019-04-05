var jwt = require('jsonwebtoken');
var config = require('./../../config');

function verifToken(req, res, next) {
    var token = req.headers['x-access-token'];
    console.log(req.headers);
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ aut: false, message: 'Failed to authenticate token.' });
        // IF everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifToken;