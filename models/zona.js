const mongoose = require('mongoose');

const ZonaSchema = new mongoose.Schema({
    ciudad:{
        type: String
    },
    nombre_zona:{
        type:String
    },
    coordenadas:{
        type: Array
    },
});
module.exports = mongoose.model('Zona', ZonaSchema);