// requires
var express = require('express');
var mongoose = require('mongoose');


// inicializar variables
var app = express();


// conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true })

.then(db => console.log('base de datos conectada'))
    .catch(err => console.log('Errror!', err));


// rutas
app.get('/', (req, res, next) => {

    // mando respuesta a la solicitud q realizo
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });

});


// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});