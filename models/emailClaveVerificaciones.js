const mongoose = require('mongoose');

const EmailClaveVerificacionesSchema = new mongoose.Schema({
    fecha_creacion:{
        type:Date,
        default:Date.now()
    },
    fecha_vencimiento:{
        type:Date,
        default:Date.now()
    },
    clave:{
        type:Number
    },
    email:{
        type: String
    }
});
module.exports = mongoose.model('EmailClaveVerificaciones', EmailClaveVerificacionesSchema);