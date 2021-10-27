const mongoose = require('mongoose');

const UsuarioInmuebleBuscadoSchema = new mongoose.Schema({
    nombre_configuracion:{
        type:String,
        default:""
    },
    numero_telefono:{
        type:String
    },
    tipo_contrato: {
        type:String,
        default:""
    },
    tipo_inmueble:{
        type:String,
        default:""
    },
    ciudad:{
        type:String,
        default:""
    },
    zona:{
        type:String,
        default:""
    },
    plantas: {
        type: Number,
        default:0
    },
    ambientes: {
        type: Number,
        default:0
    },
    dormitorios: {
        type: Number,
        default:0
    },
    banios: {
        type: Number,
        default:0
    },
    garaje: {
        type: Number,
        default:0
    },
    superficie_terreno_min: {
        type: Number,
        default:0
    },
    superficie_terreno_max: {
        type: Number,
        default:0
    },
    superficie_construccion_min:{
        type: Number,
        default:0
    },
    superficie_construccion_max:{
        type: Number,
        default:0
    },
    antiguedad_construccion_min:{
        type: Number,
        default:0
    },
    antiguedad_construccion_max: {
        type: Number,
        default:0
    },
    tamanio_frente_min:{
        type:Number,
        default:0
    },
    tamanio_frente_max:{
        type:Number,
        default:0
    },
    precio_min: {
        type: Number,
        default:0
    },
    precio_max:{
        type: Number,
        default:0
    },
    mascotas_permitidas:{
        type: Boolean,
        default:false
    },
    sin_hipoteca:{
        type: Boolean,
        default:false
    },
    construccion_estrenar:{
        type: Boolean,
        default:false
    },
    materiales_primera:{
        type: Boolean,
        default:false
    },
    proyecto_preventa:{
        type: Boolean,
        default:false
    },
    inmueble_compartido:{
        type: Boolean,
        default:false
    },
    numero_duenios:{
        type: Number,
        default:0
    },
    servicios_basicos:{
        type: Boolean,
        default:false
    },
    gas_domiciliario:{
        type: Boolean,
        default:false
    },
    wifi:{
        type: Boolean,
        default:false
    },
    medidor_independiente:{
        type: Boolean,
        default:false
    },
    termotanques:{
        type: Boolean,
        default:false
    },
    calle_asfaltada:{
        type: Boolean,
        default:false
    },
    transporte:{
        type: Boolean,
        default:false
    },
    preparado_discapacidad:{
        type: Boolean,
        default:false
    },
    papeles_orden:{
        type: Boolean,
        default:false
    },
    habilitado_credito:{
        type: Boolean,
        default:false
    },
    amoblado:{
        type: Boolean,
        default:false
    },
    lavanderia: {
        type: Boolean,
        default:false
    },
    cuarto_lavado: {
        type: Boolean,
        default:false
    },
    churrasquero: {
        type: Boolean,
        default:false
    },
    azotea: {
        type: Boolean,
        default:false
    },
    condominio_privado: {
        type: Boolean,
        default:false
    },
    cancha: {
        type: Boolean,
        default:false
    },
    piscina: {
        type: Boolean,
        default:false
    },
    sauna: {
        type: Boolean,
        default:false
    },
    jacuzzi:{
        type: Boolean,
        default:false
    },
    estudio: {
        type: Boolean,
        default:false
    },
    jardin: {
        type: Boolean,
        default:false
    },
    porton_electrico:{
        type: Boolean,
        default:false
    },
    aire_acondicionado:{
        type: Boolean,
        default:false
    },
    calefaccion:{
        type: Boolean,
        default:false
    },
    ascensor: {
        type: Boolean,
        default:false
    },
    deposito: {
        type: Boolean,
        default:false
    },
    sotano: {
        type: Boolean,
        default:false
    },
    balcon: {
        type: Boolean,
        default:false
    },
    tienda: {
        type: Boolean,
        default:false
    },
    amurallado_terreno:{
        type: Boolean,
        default:false
    },
    iglesia: {
        type: Boolean,
        default:false
    },
    parque_infantil: {
        type: Boolean,
        default:false
    },
    escuela:{
        type: Boolean,
        default:false
    },
    universidad:{
        type: Boolean,
        default:false
    },
    plazuela:{
        type: Boolean,
        default:false
    },
    modulo_policial: {
        type: Boolean,
        default:false
    },
    sauna_piscina_publica:{
        type:Boolean,
        default:false
    },
    gym_publico:{
        type:Boolean,
        default:false
    },
    centro_deportivo:{
        type:Boolean,
        default:false
    },
    puesto_salud:{
        type:Boolean,
        default:false
    },
    zona_comercial: {
        type: Boolean,
        default:false
    },
    //otros
    remates_judiciales:{
        type: Boolean,
        default:false
    },
    imagenes_2D:{
        type: Boolean,
        default:false
    },
    video_2D:{
        type: Boolean,
        default:false
    },
    tour_virtual_360:{
        type: Boolean,
        default:false
    },
    video_tour_360:{
        type: Boolean,
        default:false
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('UsuarioInmuebleBuscado', UsuarioInmuebleBuscadoSchema);