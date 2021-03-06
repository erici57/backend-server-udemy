var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ======================================
// VERIFICAR TOKEN
// ======================================

exports.VerificaToken = function(req, res, next) {

    // recibo el token por url
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });


};