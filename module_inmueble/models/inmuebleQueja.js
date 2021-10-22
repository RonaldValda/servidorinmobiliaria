const mongoose = require('mongoose');

const InmuebleQuejaSchema = new mongoose.Schema({
    sin_respuesta:{
        type:Boolean,
        default:false
    },
    rechazado_sin_justificacion:{
        type:Boolean,
        default:false
    },
    otro:{
        type:Boolean,
        default:false
    },
    observaciones_solicitud:{
        type:String,
        default:""
    },
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
    respuesta:{
        type:String,
        default:""
    },
    observaciones_respuesta:{
        type:String,
        default:""
    },
    usuario_respondedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    inmueble: { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleQueja', InmuebleQuejaSchema);