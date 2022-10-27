const mongoose = require('mongoose');
const ModelPadreSchema = new mongoose.Schema({
    alumno:{
        type: String
    },
    edad:{
        type: Number
    },
});
module.exports = mongoose.model('Alumno', ModelPadreSchema);