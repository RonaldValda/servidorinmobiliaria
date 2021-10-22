const mongoose = require('mongoose');

const CiudadSchema = new mongoose.Schema({
    nombre_ciudad:{
        type:String
    },
    departamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Departamento'
    },
});
module.exports = mongoose.model('Ciudad', CiudadSchema);