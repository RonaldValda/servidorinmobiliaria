const mongoose = require('mongoose');

const SecuenciasIndicesSchema = new mongoose.Schema({
    indice_inmuebles: {
        type: Number
    },
});
module.exports = mongoose.model('SecuenciasIndices', SecuenciasIndicesSchema);