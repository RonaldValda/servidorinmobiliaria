const mongoose = require('mongoose');

const AdministradorZonaSchema = new mongoose.Schema({
    administrador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    zona: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zona'
    },
});
module.exports = mongoose.model('AdministradorZona', AdministradorZonaSchema);