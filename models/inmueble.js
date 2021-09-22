const mongoose = require('mongoose');

const InmuebleSchema = new mongoose.Schema({
    indice:{
        type: Number
    },
    ciudad: {
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
    historial_precios:{
        type: Array
    },
    tipo_inmueble: {
        type: String,
    },
    tipo_contrato: {
        type: String
    },
    estado_negociacion:{
        type:String,
    },
    //Generales
    zona: {
        type: String,
        trim: true
    },
    coordenadas:{
        type: Array
    },
    mascotas_permitidas: {
        type: Boolean
    },
    sin_hipoteca:{
        type: Boolean
    },
    construccion_estrenar: {
        type: Boolean
    },
    materiales_primera:{
        type:Boolean
    },
    //-----------Generales más--------------
    superficie_terreno: {
        type: Number
    },
    superficie_construccion:{
        type: Number
    },
    tamanio_frente:{
        type: Number
    },
    antiguedad_construccion:{
        type: Number
    },
    proyecto_preventa: {
        type: Boolean
    },
    inmueble_compartido:{
        type: Boolean
    },
    numero_duenios:{
        type: Number
    },
    servicios_basicos:{
        type:Boolean
    },
    gas_domiciliario:{
        type:Boolean
    },
    wifi:{
        type:Boolean
    },
    medidor_independiente:{
        type:Boolean
    },
    termotanque:{
        type:Boolean
    },
    calle_asfaltada:{
        type:Boolean
    },
    transporte:{
        type:Boolean
    },
    preparado_discapacidad:{
        type:Boolean
    },
    papeles_orden: {
        type: Boolean
    },
    habilitado_credito: {
        type: Boolean
    },
    
    //caracteristicas internas
    plantas:{
        type: Number
    },
    ambientes:{
        type: Number
    },
    numero_dormitorios:{
        type: Number,
    },
    numero_banios: {
        type: Number
    },
    numero_garaje: {
        type: Number
    },
    amoblado:{
        type: Boolean
    },
    lavanderia: {
        type: Boolean
    },
    cuarto_lavado: {
        type: Boolean
    },
    churrasquero: {
        type: Boolean
    },
    azotea: {
        type: Boolean
    },
    condominio_privado: {
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
    jacuzzi:{
        type:Boolean
    },
    estudio: {
        type: Boolean
    },
    jardin: {
        type: Boolean
    },
    porton_electrico:{
        type:Boolean
    },
    aire_acondicionado:{
        type:Boolean
    },
    calefaccion:{
        type:Boolean
    },
    ascensor: {
        type: Boolean
    },
    deposito: {
        type: Boolean
    },
    sotano: {
        type: Boolean
    },
    balcon: {
        type: Boolean
    },
    tienda: {
        type: Boolean
    },
    amurallado_terreno:{
        type: Boolean
    },
    //comunidad
    iglesia: {
        type: Boolean
    },
    parque_infantil: {
        type: Boolean
    },
    escuela:{
        type: Boolean
    },
    universidad:{
        type: Boolean
    },
    plazuela:{
        type: Boolean
    },
    modulo_policial: {
        type: Boolean
    },
    sauna_piscina_publica:{
        type:Boolean
    },
    gym_publico:{
        type:Boolean
    },
    centro_deportivo:{
        type:Boolean
    },
    puesto_salud:{
        type:Boolean
    },
    zona_comercial: {
        type: Boolean
    },
    //otros
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
    imagenes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InmuebleImagenes'
    },
    propietario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    
    usuarios_favorito: [{ 
        type:mongoose.Schema.Types.ObjectId,ref:'InmuebleFavorito',default:{}}
    ],
    fecha_creacion: {
        type: Date,
        default: Date.now()
    },
    fecha_publicacion:{
        type: Date,
        default: Date.now()
    },
    autorizacion:{
        type: String,
        default: "Pendiente"
    },
    ultima_modificacion:{
        type: Date,
        default: Date.now()
    },
    calificacion:{
        type: Number,
        Default:0
    },
    categoria:{
        type: String,
        default: "Orgánico"
    }
});
module.exports = mongoose.model('Inmueble', InmuebleSchema);
