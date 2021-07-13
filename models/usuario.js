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
    }
});
module.exports = mongoose.model('Usuario',UsuarioSchema);