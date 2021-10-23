const mongoose = require('mongoose');

const VerionesAPPSchema = new mongoose.Schema({
    numero_version:{
        type: String
    },
    fecha_publicacion: {
        type: Date
    },
    link_descarga:{
        type: String
    }
});
module.exports = mongoose.model('VersionesAPP', VerionesAPPSchema);
