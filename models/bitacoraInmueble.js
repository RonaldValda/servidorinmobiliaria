const mongoose = require('mongoose');

const BitacoraInmuebleSchema = new mongoose.Schema({
    //ultima solicitud
    fecha:{
        type: Date,
        default: Date.now()
    },
    actividad:{
        type:String
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
});
module.exports = mongoose.model('BitacoraInmueble', BitacoraInmuebleSchema);
