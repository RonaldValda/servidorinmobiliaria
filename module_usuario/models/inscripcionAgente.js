const mongoose = require('mongoose');

const InscripcionAgenteSchema = new mongoose.Schema({
    fecha_solicitud:{
        type: Date,
        default: Date.now()
    },
    fecha_respuesta:{
        type: Date,
        default: Date.now()
    },
    respuesta_entregada:{
        type:Boolean,
        default:false
    },
    link_respaldo_solicitud:{
        type:String,
        default:""
    },
    respuesta:{
        type:String,
        default:""
    },
    observaciones:{
        type:String,
        default:""
    },
    usuario_solicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    usuario_respondedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
});
module.exports = mongoose.model('InscripcionAgente', InscripcionAgenteSchema);
