const mongoose = require('mongoose');

const SolicitudesUsuariosSchema = new mongoose.Schema({
    fecha_solicitud:{
        type: Date,
        default: Date.now()
    },
    fecha_respuesta:{
        type: Date,
        default: Date.now()
    },
    solicitud_enviada:{
        type:Boolean,
        default:false
    },
    respuesta_entregada:{
        type:Boolean,
        default:false
    },
    tipo_solicitud:{
        type:String
    },
    respuesta:{
        type:String,
        default:""
    },
    observaciones:{
        type:String,
        default:""
    },
    solicitud_terminada:{
        type:Boolean,
        default:false
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
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
module.exports = mongoose.model('SolicitudesUsuarios', SolicitudesUsuariosSchema);
