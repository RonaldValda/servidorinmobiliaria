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
        type:String
    },
    respuesta:{
        type:String
    },
    observaciones:{
        type:String
    },
    link_respaldo:{
        type:String
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
