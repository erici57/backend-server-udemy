var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Medico = require('../models/medico');


// ======================================
// OBTENER TODOS LOS MEDICOS
// ======================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre, email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }


                Medico.count({}, (err, conteo) => {

                    // mando respuesta a la solicitud q realizo
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });



            });

});



// ======================================
// OBTENER MEDICO
// ======================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }


            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + 'no existe',
                    errors: { message: 'no existe un medico con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                medico: medico
            });

        });

});



// ======================================
// ACTUALIZAR MEDICO
// ======================================

app.put('/:id', mdAutenticacion.VerificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }


        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'no existe un medico con ese id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });


        });

    });


});


// ======================================
// CREAR UN  NUEVO MEDICO
// ======================================

app.post('/', mdAutenticacion.VerificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado

        });

    });

});


// ======================================
// ELIMINAR UN MEDICO por el ID
// ======================================

app.delete('/:id', mdAutenticacion.VerificaToken, (req, res) => {

    // obtener el id 
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }


        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'no existe un medico con ese id' }
            });
        }


        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});



module.exports = app;