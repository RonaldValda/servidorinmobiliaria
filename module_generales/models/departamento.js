const mongoose = require('mongoose');

const DepartamentoSchema = new mongoose.Schema({
    nombre_departamento:{
        type:String
    },
});
module.exports = mongoose.model('Departamento', DepartamentoSchema);