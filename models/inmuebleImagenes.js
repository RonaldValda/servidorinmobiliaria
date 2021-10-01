const mongoose = require('mongoose');

const InmuebleImagenesSchema = new mongoose.Schema({
    principales:{
        type: Array
    },
    plantas:{
        type: Array
    },
    ambientes:{
        type: Array
    },
    dormitorios:{
        type: Array,
    },
    banios: {
        type: Array
    },
    garaje: {
        type: Array
    },
    amoblado:{
        type: Array
    },
    lavanderia: {
        type: Array
    },
    cuarto_lavado: {
        type: Array
    },
    churrasquero: {
        type: Array
    },
    azotea: {
        type: Array
    },
    condominio_privado: {
        type: Array
    },
    cancha: {
        type: Array
    },
    piscina: {
        type: Array
    },
    sauna: {
        type: Array
    },
    jacuzzi:{
        type:Array
    },
    estudio: {
        type: Array
    },
    jardin: {
        type: Array
    },
    porton_electrico:{
        type:Array
    },
    aire_acondicionado:{
        type:Array
    },
    calefaccion:{
        type:Array
    },
    ascensor: {
        type: Array
    },
    deposito: {
        type: Array
    },
    sotano: {
        type: Array
    },
    balcon: {
        type: Array
    },
    tienda: {
        type: Array
    },
    amurallado_terreno:{
        type: Array
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleImagenes', InmuebleImagenesSchema);
