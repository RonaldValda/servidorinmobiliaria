const mongoose = require('mongoose');

const AdministradorInmuebleSchema = new mongoose.Schema({
    //ultima solicitud
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
    tipo_solicitud:{
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
    link_respaldo_solicitud:{
        type:String,
        default:""
    },
    link_respaldo_respuesta:{
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
module.exports = mongoose.model('AdministradorInmueble', AdministradorInmuebleSchema);
