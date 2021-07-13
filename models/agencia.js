const mongoose = require('mongoose');

const AgenciaSchema = new mongoose.Schema({
    nombre_agencia: {
        type: String,
        required: true,
        trim: true
    },
    nombre_propietario: {
        type: String,
        required: true,
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
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Agencia', AgenciaSchema);