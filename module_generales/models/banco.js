const mongoose = require('mongoose');

const BancoSchema = new mongoose.Schema({
    nombre_banco:{
        type:String
    },
    link_logo_banco:{
        type:String
    },
    web:{
        type:String,
        default:""
    },
    app:{
        type:String,
        default:""
    },
    pre_aprobacion:{
        type:String,
        default:""
    }
});
module.exports = mongoose.model('Banco', BancoSchema);
