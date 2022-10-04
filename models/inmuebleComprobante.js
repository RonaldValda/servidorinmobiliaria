const mongoose = require('mongoose');

const InmuebleComprobanteSchema = new mongoose.Schema({
    tipo_comprobante:{
        type: String,
        default: "Publicar"
    },
    medio_pago:{
        type:String
    },
    monto_pago:{
        type:Number,
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
    limite_contrato:{
        type:Boolean
    },
    cancelacion_contrato:{
        type:Boolean
    },
    numero_testimonio:{
        type:String
    },
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SolicitudesAdministradores'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlanesPagoPublicacion'
    },
    usuario_comprador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleComprobante', InmuebleComprobanteSchema);
