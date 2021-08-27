const mongoose = require('mongoose');

const AgentePagosSchema = new mongoose.Schema({

    fecha_suscripcion:{
        type:Date,
        default:Date.now()
    },
    fecha_expiracion:{
        type:Date,
        default:Date.now()
    },
    tipo_pago:{
        type:String
    },
    monto_pago:{
        type:Number,
    },
    habilitado:{
        type:Boolean
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
});
module.exports = mongoose.model('AgentePagos', AgentePagosSchema);
