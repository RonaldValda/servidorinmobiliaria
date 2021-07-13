const mongoose = require('mongoose');
const ModelHijoSchema = new mongoose.Schema({
    asignatura:{
        type:String
    },
    nota:{
        type: Number
    },
    alumno:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno'
    }
});
module.exports = mongoose.model('Asignatura', ModelHijoSchema);