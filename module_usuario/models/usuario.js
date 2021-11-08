const mongoose = require('mongoose');
const UsuarioSchema = mongoose.Schema({
    link_foto:{
        type:String,
        default:""
    },
    nombres: {
        type: String,
        trim: true
    },
    apellidos:{
        type: String
    },
    imei_telefono:{
        type:String,
        trim:true,
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
    },
    medio_registro:{
        type: String,
        required: true,
        trim:true
    },
    registro: {
        type: Date,
        default: Date.now()
    },
    tipo_usuario:{
        type: String,
    },
    nombre_agencia: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    web:{
        type: String,
        trim: true
    },
    verificado:{
        type: Boolean
    },
    fecha_ultimo_ingreso: {
        type: Date,
        default:Date.now()
    },
    fecha_penultimo_ingreso: {
        type: Date,
        default:Date.now()
    },
    estado_cuenta:{
        type: Boolean
    },
    sumatoria_calificacion:{
        type: Number,
        default: 0
    },
    cantidad_calificados:{
        type:Number,
        default: 0
    },
    ciudad:{
        type:String,
        default:""
    },
    membresia_pagos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MembresiaPago',default:{}
    }],
    usuario_inmueble_base: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsuarioInmuebleBase',
        default:{}
    }],
});
module.exports = mongoose.model('Usuario',UsuarioSchema);