var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Hospital = require('../models/hospital');


// ======================================
// OBTENER TODOS LOS HOSPITALES
// ======================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }


                Hospital.count({}, (err, conteo) => {

                    // mando respuesta a la solicitud q realizo
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });

                });


            });

});





// ======================================
// ACTUALIZAR HOSPITAL
// ======================================

app.put('/:id', mdAutenticacion.VerificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }


        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'no existe un hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });


        });

    });


});


// ======================================
// CREAR UN  NUEVO HOSPITAL
// ======================================

app.post('/', mdAutenticacion.VerificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado

        });

    });

});


// ======================================
// ELIMINAR UN HOSPITAL por el ID
// ======================================

app.delete('/:id', mdAutenticacion.VerificaToken, (req, res) => {

    // obtener el id 
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }


        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'no existe un hospital con ese id' }
            });
        }


        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});



module.exports = app;