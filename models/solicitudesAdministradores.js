const mongoose = require('mongoose');

const SolicitudesAdministradoresSchema = new mongoose.Schema({
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
    tipo_solicitud:{
        type:String,
        default:""
    },
    respuesta:{
        type:String,
        default:""
    },
    observaciones:{
        type:String,
        default:""
    },
    link_respaldo_respuesta:{
        type:String,
        default:""
    },
    link_respaldo_solicitud:{
        type:String,
        default:"",
    },
    solicitud_terminada:{
        type:Boolean,
        default:false
    },
    fecha_solicitud_super_usuario:{
        type: Date,
        default: Date.now()
    },
    fecha_respuesta_super_usuario:{
        type: Date,
        default: Date.now()
    },
    respuesta_entregada_super_usuario:{
        type:Boolean,
        default:false
    },
    respuesta_super_usuario:{
        type:String,
        default:""
    },
    observaciones_super_usuario:{
        type:String,
        default:""
    },
    solicitud_terminada_super_usuario:{
        type:Boolean,
        default:false
    },
    usuario_solicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    administrador_inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdministradorInmueble'
    }
});
module.exports = mongoose.model('SolicitudesAdministradores', SolicitudesAdministradoresSchema);
