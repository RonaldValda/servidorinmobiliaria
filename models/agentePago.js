const mongoose = require('mongoose');

const AgentePagoSchema = new mongoose.Schema({
    fecha_solicitud:{
        type:Date,
        defaut:Date.now()
    },
    mes:{
        type:Number
    },
    medio_pago:{
        type:String
    },
    monto_pago:{
        type:Number,
    },
    plan:{
        type: Number
    },
    numero_transaccion:{
        type:String
    },
    cuenta_banco:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CuentaBanco'
    },
    nombre_depositante:{
        type:String
    },
    link_imagen_deposito:{
        type:String
    },
    autorizacion:{
        type:String,
        default:"Pendiente"
    },
    observaciones:{
        type:String
    },
    fecha_respuesta:{
        type:Date
    },
    respuesta_entregada:{
        type:Boolean,
        default:false
    },
    fecha_inicio:{
        type:Date
    },
    activo:{
        type:Boolean,
        default:false
    },
    fecha_cancelacion:{
        type:Date
    },
    motivo_cancelacion:{
        type:String
    },
    agente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    administrador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('AgentePago', AgentePagoSchema);
