const mongoose = require('mongoose');

const CuentaBancoSchema = new mongoose.Schema({
    fecha_habilitacion:{
        type:Date,
        default:Date.now()
    },
    fecha_cierre:{
        type:Date,
        default:Date.now()
    },
    activo:{
        type:Boolean
    },
    numero_cuenta:{
        type:Number
    },
    titular:{
        type:String
    },
    nombre_banco:{
        type:String
    },
    link_logo_banco:{
        type:String
    }
});
module.exports = mongoose.model('CuentaBanco', CuentaBancoSchema);
