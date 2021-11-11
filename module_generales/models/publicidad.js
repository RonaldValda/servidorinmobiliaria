const mongoose = require('mongoose');

const PublicidadSchema = new mongoose.Schema({
    precio_min:{
        type:Number
    },
    precio_max:{
        type:Number
    },
    tipo_inmueble:{
        type:String
    },
    tipo_contrato:{
        type:String
    },
    tipo_publicidad:{
        type:String,
        default:""
    },
    descripcion_publicidad:{
        type:String
    },
    link_imagen_publicidad:{
        type:String
    },
    link_web_publicidad:{
        type:String,
        default:""
    },
    fecha_creacion:{
        type:Date,
        default:Date.now()
    },
    fecha_vencimiento:{
        type:Date,
        default:Date.now()
    }
});
module.exports = mongoose.model('Publicidad', PublicidadSchema);
