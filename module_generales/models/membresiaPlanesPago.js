const mongoose = require('mongoose');

const MembresiaPlanesPagoSchema = new mongoose.Schema({
    nombre_plan:{
        type: String,
        default:""
    },
    unidad_medida_tiempo:{
        type: String,
        default:"Mes"
    },
    tiempo:{
        type: Number,
        default:0
    },
    costo:{
        type: Number,
        default:0
    },
    activo:{
        type: Boolean,
        default:false
    }
});
module.exports = mongoose.model('MembresiaPlanesPago', MembresiaPlanesPagoSchema);
