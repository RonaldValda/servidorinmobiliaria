const mongoose = require('mongoose');

const InmuebleNotaSchema = new mongoose.Schema({
    nota:{
        type:String,
        default:""
    },
    fecha:{
        type:Date,
        default:Date.now()
    },
    //llaves foraneas
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    inmueble: { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Inmueble'
    },
});
module.exports = mongoose.model('InmuebleNota', InmuebleNotaSchema);
