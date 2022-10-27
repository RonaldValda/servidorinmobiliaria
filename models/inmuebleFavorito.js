const mongoose = require('mongoose');

const InmuebleFavoritoSchema = new mongoose.Schema({
    favorito:{
        type: Boolean
    },
    visto: {
        type: Boolean
    },
    doble_visto:{
        type: Boolean
    },
    id_usuario: {
        type: String,
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('InmuebleFavorito', InmuebleFavoritoSchema);
