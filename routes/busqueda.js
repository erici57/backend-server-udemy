var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');



// ========================================
// BUSQUEDA POR COLECCION
// ========================================

app.get('/coleccion/:tabla/:busqueda/', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var expresionRegular = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expresionRegular);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, expresionRegular);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, expresionRegular);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: hospitales, medicos y usuarios',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });

    }



    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });


});

// ========================================
// BUSQUEDA GENERAL
// ========================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var expresionRegular = new RegExp(busqueda, 'i');


    Promise.all([
            buscarHospitales(busqueda, expresionRegular),
            buscarMedicos(busqueda, expresionRegular),
            buscarUsuarios(busqueda, expresionRegular)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });





});


function buscarHospitales(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: expresionRegular })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });

    });

}


function buscarMedicos(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: expresionRegular })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });

    });

}


function buscarUsuarios(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ nombre: expresionRegular }, { email: expresionRegular }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });

}



module.exports = app;