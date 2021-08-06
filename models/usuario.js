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
    fecha_ultimo_ingreso: {
        type: Date,
    },
    usuario_inmueble_base: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsuarioInmuebleBase'
    },
});
module.exports = mongoose.model('Usuario',UsuarioSchema);