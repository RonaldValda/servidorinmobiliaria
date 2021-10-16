const mongoose = require('mongoose');

const InmuebleDarBajaSchema = new mongoose.Schema({
    limite_contrato:{
        type: Boolean,
        default:false
    },
    cancelacion_contrato:{
        type: Boolean,
        default:false
    },
    imagen_documento_propiedad:{
        type: String,
        default:""
    },
    inmueble:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    }
});
module.exports = mongoose.model('InmuebleDarBaja', InmuebleDarBajaSchema);
