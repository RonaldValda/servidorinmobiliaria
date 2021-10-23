const mongoose = require('mongoose');

const ZonaSchema = new mongoose.Schema({
    nombre_zona:{
        type:String
    },
    coordenadas:{
        type: Array
    },
    ciudad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ciudad'
    },
});
module.exports = mongoose.model('Zona', ZonaSchema);