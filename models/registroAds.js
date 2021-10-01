const mongoose = require('mongoose');
const RegistroAdsSchema = mongoose.Schema({
    id_ad: {
        type: String,
        trim: true
    },
    tipo_ad:{
        type:String
    }
});
module.exports = mongoose.model('RegistroAds',RegistroAdsSchema);