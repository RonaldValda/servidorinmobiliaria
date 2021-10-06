const mongoose = require('mongoose');

const UsuarioInmuebleBaseSchema = new mongoose.Schema({
    dormitorios_min: {
        type: Number,
        default:0
    },
    dormitorios_max: {
        type: Number,
        default:0
    },
    banios_min: {
        type: Number,
        default:0
    },
    banios_max: {
        type: Number,
        default:0
    },
    garaje_min: {
        type: Number,
        default:0
    },
    garaje_max: {
        type: Number,
        default:0
    },
    superficie_terreno_min: {
        type: Number,
        default:0
    },
    superficie_terreno_max: {
        type: Number,
        default:0
    },
    superficie_construccion_min:{
        type: Number,
        default:0
    },
    superficie_construccion_max:{
        type: Number,
        default:0
    },
    antiguedad_construccion_min:{
        type: Number,
        default:0
    },
    antiguedad_construccion_max: {
        type: Number,
        default:0
    },
    precio_min: {
        type: Number,
        default:0
    },
    precio_max:{
        type: Number,
        default:0
    },
    cantidad_inmuebles:{
        type: Number,
        default:0
    },
    amoblado:{
        type: Number,
        default:0
    },
    lavanderia: {
        type: Number,
        default:0
    },
    cuarto_lavado: {
        type: Number,
        default:0
    },
    churrasquero: {
        type: Number,
        default:0
    },
    azotea: {
        type: Number,
        default:0
    },
    condominio_privado: {
        type: Number,
        default:0
    },
    cancha: {
        type: Number,
        default:0
    },
    piscina: {
        type: Number,
        default:0
    },
    sauna: {
        type: Number,
        default:0
    },
    jacuzzi:{
        type: Number,
        default:0
    },
    estudio: {
        type: Number,
        default:0
    },
    jardin: {
        type: Number,
        default:0
    },
    porton_electrico:{
        type: Number,
        default:0
    },
    aire_acondicionado:{
        type: Number,
        default:0
    },
    calefaccion:{
        type: Number,
        default:0
    },
    ascensor: {
        type: Number,
        default:0
    },
    deposito: {
        type: Number,
        default:0
    },
    sotano: {
        type: Number,
        default:0
    },
    balcon: {
        type: Number,
        default:0
    },
    tienda: {
        type: Number,
        default:0
    },
    amurallado_terreno:{
        type: Number,
        default:0
    },
    fecha_inicio:{
        type:Date,
    },
    fecha_ultimo_guardado:{
        type:Date,
        default: Date.now()
    },
    fecha_cache:{
        type:Date,
        default: Date.now()
    },
    tipo:{
        type:String
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('UsuarioInmuebleBase', UsuarioInmuebleBaseSchema);
