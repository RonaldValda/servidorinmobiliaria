const mongoose = require('mongoose');

const InmuebleImagenesSchema = new mongoose.Schema({
    url_imagenes_principal:{
        type: Array
    },
    url_imagenes_exteriores:{
        type: Array
    },
    url_imagenes_dormitorios:{
        type: Array
    },
    url_imagenes_banios:{
        type: Array
    },
    url_imagenes_garaje:{
        type: Array
    },
    url_imagenes_hall:{
        type: Array
    },
    url_imagenes_jardin:{
        type: Array
    },
    url_imagenes_dependencias:{
        type: Array
    },
    inmueble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleImagenes', InmuebleImagenesSchema);
