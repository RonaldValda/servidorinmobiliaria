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
    detalles_generales:{
        type:String,
        default:""
    },
    //caracteristicas internas
    plantas:{
        type: Number
    },
    ambientes:{
        type: Number
    },
    dormitorios:{
        type: Number,
    },
    banios: {
        type: Number
    },
    garaje: {
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
    detalles_internas:{
        type:String,
        default:""
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
    detalles_comunidad:{
        type:String,
        default:""
    },
    //otros
    remates_judiciales:{
        type: Boolean
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
    contacto_numero:{
        type: Number,
        default: 0
    },
    contacto_link:{
        type: String,
        default: ""
    },
    plataforma_citas_link:{
        type: String,
        default:""
    },
    detalles_otros:{
        type:String,
        default:""
    },
    //llaves foraneas
    imagenes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InmuebleImagenes'
    },
    comprobante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InmuebleComprobante'
    },
    propietario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    cantidad_vistos:{
        type: Number,
        default: 0
    },
    cantidad_doble_vistos:{
        type:Number,
        default:0
    },
    cantidad_favoritos:{
        type:Number,
        default:0
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
        default: "Pendiente - Publicar"
    },
    modificaciones_permitidas:{
        type: Number,
        default:0
    },
    contador_modificacion:{
        type: Number,
        default:0
    },
    ultima_modificacion:{
        type: Date,
        default: Date.now()
    },
    calificacion:{
        type: Number,
        default:0
    },
    categoria:{
        type: String,
        default: "Orgánico"
    }
});
module.exports = mongoose.model('Inmueble', InmuebleSchema);
