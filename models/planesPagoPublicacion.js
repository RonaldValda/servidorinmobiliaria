const mongoose = require('mongoose');

const PlanesPagoPublicacionSchema = new mongoose.Schema({
    nombre_plan:{
        type: String
    },
    plan:{
        type: Number
    },
    monto:{
        type: String
    },
    activo:{
        type: Boolean
    }
});
module.exports = mongoose.model('PlanesPagoPublicacion', PlanesPagoPublicacionSchema);
