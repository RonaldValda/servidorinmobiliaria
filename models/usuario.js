const mongoose = require('mongoose');
const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    nombre_usuario:{
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
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
    },
    estado_cuenta:{
        type: Boolean
    },
    sumatoria_calificacion:{
        type: Number,
        default: 0
    },
    cantidad_inmuebles_calificados:{
        type:Number,
        default: 0
    },
    usuario_inmueble_base: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsuarioInmuebleBase'
    },
});
module.exports = mongoose.model('Usuario',UsuarioSchema);