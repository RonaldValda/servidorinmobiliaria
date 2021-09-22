const mongoose = require('mongoose');

const PlanesPagoAgenteSchema = new mongoose.Schema({
    nombre_plan:{
        type: String
    },
    plan:{
        type: Number
    },
    monto_mensual:{
        type: String
    },
    activo:{
        type: Boolean
    }
});
module.exports = mongoose.model('PlanesPagoAgente', PlanesPagoAgenteSchema);
