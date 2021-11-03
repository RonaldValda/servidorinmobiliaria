const mongoose = require('mongoose');

const PlanesPagoPublicacionSchema = new mongoose.Schema({
    nombre_plan:{
        type: String,
        default: ""
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
module.exports = mongoose.model('PlanesPagoPublicacion', PlanesPagoPublicacionSchema);
