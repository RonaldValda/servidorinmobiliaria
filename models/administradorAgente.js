const mongoose = require('mongoose');

const AdministradorAgenteSchema = new mongoose.Schema({
    //ultima solicitud
    fecha_solicitud:{
        type: Date,
        default: Date.now()
    },
    fecha_respuesta:{
        type: Date,
        default: Date.now()
    },
    mes:{
        type:Number
    },
    respuesta_entregada:{
        type:Boolean,
        default:false
    },
    tipo_solicitud:{
        type:String
    },
    medio_pago:{
        type:String
    },
    numero_plan:{
        type:Number
    },
    monto_pago:{
        type:Number
    },
    respuesta:{
        type:String
    },
    observaciones:{
        type:String
    },
    link_respaldo_solicitud:{
        type:String
    },
    link_respaldo_respuesta:{
        type:String
    },
    solicitud_terminada:{
        type:Boolean,
        default:false
    },
    agente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    administrador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
});
module.exports = mongoose.model('AdministradorAgente', AdministradorAgenteSchema);