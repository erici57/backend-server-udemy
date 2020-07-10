var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;


    // __dirname = ruta donde me encuentro ahora
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);


    // verificar si la imagen existe en ese path
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }


});

module.exports = app;