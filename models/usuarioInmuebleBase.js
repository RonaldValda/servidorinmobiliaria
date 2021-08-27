const mongoose = require('mongoose');

const UsuarioInmuebleBaseSchema = new mongoose.Schema({
    dormitorios_min: {
        type: Number
    },
    dormitorios_max: {
        type: Number
    },
    banios_min: {
        type: Number
    },
    banios_max: {
        type: Number
    },
    garaje_min: {
        type: Number
    },
    garaje_max: {
        type: Number
    },
    superficie_terreno_min: {
        type: Number
    },
    superficie_terreno_max: {
        type: Number
    },
    superficie_construccion_min:{
        type: Number
    },
    superficie_construccion_max:{
        type: Number
    },
    tiempo_construccion_min:{
        type: Number
    },
    tiempo_construccion_max: {
        type: Number
    },
    precio_min: {
        type: Number
    },
    precio_max:{
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
