const mongoose = require('mongoose');

const InmuebleSchema = new mongoose.Schema({
    nombre_propietario: {
        type: String,
        trim: true
    },
    ciudad: {
        type: String,
        trim: true
    },
    zona: {
        type: String,
        trim: true
    },
    direccion:{
        type: String,
        trim: true
    },
    precio: {
        type: Number,
    },
    tipo_inmueble: {
        type: String,
    },
    estado_inmueble:{
        type:String,
    },
    superficie_terreno: {
        type: Number
    },
    superficie_construccion:{
        type: Number
    },
    tipo_contrato: {
        type: String
    },
    documentos_dia: {
        type: Boolean
    },
    construccion_estrenar: {
        type: Boolean
    },
    incluye_credito: {
        type: Boolean
    },
    sin_construir: {
        type: Boolean
    },
    tiempo_construccion:{
        type: Number
    },
    inmueble_compartido:{
        type: Boolean
    },
    numero_duenios:{
        type: Number
    },
    numero_pisos:{
        type: Number
    },
    sin_hipoteca:{
        type: Boolean
    },
    url_imagenes:{
        type: Array
    },
    historial_precios:{
        type: Array
    },
    coordenadas:{
        type: Array
    },
    //caracteristicas internas
    numero_dormitorios:{
        type: Number,
    },
    numero_banios: {
        type: Number
    },
    numero_garaje: {
        type: Number
    },
    mascotas_permitidas: {
        type: Boolean
    },
    lavanderia: {
        type: Boolean
    },
    zona_lavadora: {
        type: Boolean
    },
    churrasquero: {
        type: Boolean
    },
    azotea: {
        type: Boolean
    },
    cancha: {
        type: Boolean
    },
    piscina: {
        type: Boolean
    },
    sauna: {
        type: Boolean
    },
    tienda: {
        type: Boolean
    },
    estudio: {
        type: Boolean
    },
    jardin: {
        type: Boolean
    },
    balcon: {
        type: Boolean
    },
    ascensor: {
        type: Boolean
    },
    sotano: {
        type: Boolean
    },
    deposito: {
        type: Boolean
    },
    //comunidad
    iglesia: {
        type: Boolean
    },
    parque: {
        type: Boolean
    },
    deportiva: {
        type: Boolean
    },
    policial: {
        type: Boolean
    },
    residencial: {
        type: Boolean
    },
    estudiantil: {
        type: Boolean
    },
    comercial: {
        type: Boolean
    },
    //otros
    verificados:{
        type: Boolean
    },
    contactados:{
        type: Boolean
    },
    bienes_adjudicados:{
        type: Boolean
    },
    remates_judiciales:{
        type: Boolean
    },
    imagenes_2D_link:{
        type: String
    },
    video_2D_link:{
        type: String
    },
    tour_virtual_360_link:{
        type: String
    },
    video_tour_360_link:{
        type: String
    },
    //llaves foraneas
    agencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agencia'
    },
    usuarios_favorito: [{ 
        type:mongoose.Schema.Types.ObjectId,ref:'InmuebleFavorito',default:{}}
    ],
    creado: {
        type: Date,
        default: Date.now()
    }
        
});
module.exports = mongoose.model('Inmueble', InmuebleSchema);
