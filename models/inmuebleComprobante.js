const mongoose = require('mongoose');

const InmuebleComprobanteSchema = new mongoose.Schema({
    medio_pago:{
        type:String
    },
    monto_pago:{
        type:Number,
    },
    nombre_plan:{
        type: String
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
    link_imagen_documento_propiedad:{
        type:String
    },
    link_imagen_documento_venta:{
        type:String
    },
    link_imagen_dni_propietario:{
        type:String
    },
    link_imagen_dni_agente:{
        type:String
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleComprobante', InmuebleComprobanteSchema);
