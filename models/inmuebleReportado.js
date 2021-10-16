const mongoose = require('mongoose');

const InmuebleReportadoSchema = new mongoose.Schema({
    vendido_multiples_lugares:{
        type:Boolean,
        default:false
    },
    contenido_falso_imagen:{
        type:Boolean,
        default:false
    },
    contenido_falso_texto:{
        type:Boolean,
        default:false
    },
    contenido_inapropiado:{
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
    //llaves foraneas
    usuario_solicitante:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
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
module.exports = mongoose.model('InmuebleReportado', InmuebleReportadoSchema);
