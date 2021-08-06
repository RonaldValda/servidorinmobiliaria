const mongoose = require('mongoose');

const UsuarioInmuebleBaseSchema = new mongoose.Schema({
    dormitorios: {
        type: Number
    },
    banios: {
        type: Number
    },
    garaje: {
        type: Number
    },
    superficie_terreno: {
        type: Number
    },
    superficie_construccion:{
        type: Number
    },
    tiempo_construccion:{
        type: Number
    },
    fecha_inicio:{
        type:Date
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('UsuarioInmuebleBase', UsuarioInmuebleBaseSchema);
