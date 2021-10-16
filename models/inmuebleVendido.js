const mongoose = require('mongoose');

const InmuebleVendidoSchema = new mongoose.Schema({
    numero_testimonio:{
        type: String,
        default:false
    },
    usuario_comprador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    inmueble:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleVendido', InmuebleVendidoSchema);