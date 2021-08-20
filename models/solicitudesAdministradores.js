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
        type:String
    },
    respuesta:{
        type:String
    },
    observaciones:{
        type:String
    },
    link_respaldo:{
        type:String
    },
    solicitud_terminada:{
        type:Boolean,
        default:false
    },
    administrador_inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdministradorInmueble'
    }
});
module.exports = mongoose.model('SolicitudesAdministradores', SolicitudesAdministradoresSchema);
