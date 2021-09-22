const Usuario = require('../models/usuario');
const Proyecto = require('../models/proyecto'); 
const Tarea = require('../models/tarea');
const Inmueble = require('../models/inmueble'); 
const InmuebleImagenes = require('../models/inmuebleImagenes'); 
const Agencia = require('../models/agencia');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InmuebleFavorito = require('../models/inmuebleFavorito'); 
const UsuarioInmuebleBase = require('../models/usuarioInmuebleBase');
const SecuenciasIndices = require('../models/secuenciasIndices');
const SolicitudesUsuarios=require('../models/solicitudesUsuarios');
const SolicitudesAdministradores=require('../models/solicitudesAdministradores');
const AdministradorImmueble=require('../models/administradorInmueble');
const BitacoraInmueble=require('../models/bitacoraInmueble');
const CuentasBanco=require('../models/cuentasBanco');
const AdministradorAgente=require('../models/administradorAgente');
const AgentePago=require('../models/agentePago');
const PlanesPagoAgente=require("../models/planesPagoAgente");
const transporter=require("../models/mailer");
const EmailClaveVerificaciones=require('../models/emailClaveVerificaciones');
const VersionesAPP=require('../models/versionesAPP');
const Zona=require('../models/zona');
require('dotenv').config({path: 'variables.env'})
//const { PubSub } = require('graphql-subscriptions')

//const pubsub = new PubSub();
//crea y firma un JWT

//const INMUEBLE_ADDED ='INMUEBLE_ADDED';
const crearToken = (usuario,secreta,expiresIn)=>{
    console.log(usuario);
    const {id,email}=usuario;

    return jwt.sign({id,email},secreta,{expiresIn});
}
const enviarEmail=()=>{

}
const resolvers={
    Query:{
        obtenerProyectos: async (_,{},ctx)=>{
            const proyectos = await Proyecto.find({creador: ctx.usuario.id});
            console.log(ctx.usuario.id);
            return proyectos;
        },
        obtenerTareas: async (_,{input},ctx)=>{
            //const tareas=await Tarea.find({creador:ctx.usuario.id}).where('proyecto').equals(input.proyecto);
            //const tareas=await Tarea.find().where('proyecto').equals(input.proyecto);
            const filter={"proyecto":input.proyecto};
           //const tareas=await Tarea.find(filter);
            //const tareas=await Tarea.find((tarea)=>tarea.proyecto===input.proyecto);
            const tareas=await Tarea.find(filter);
            /*const tareas=await Tarea.find((a)=>{
                a.proyecto===input.proyecto;
            });*/
            console.log("proyecto ",input.proyecto);
            return tareas;
        },
        obtenerUsuarios: async(_,{})=>{
            const usuarios=await Usuario.find();
            //console.log()
            return usuarios;
        },
        obtenerUsuariosID: async(_,{input})=>{
            const usuarios=await Usuario.find().where('nombre').equals(input.nombre);
            //console.log("usuario", input.usuario);
            return usuarios;
        },
        obtenerUsuarioEmail: async(_,{email})=>{
            const usuario=await Usuario.findOne({email:email});
            //console.log("usuario", input.usuario);
            return usuario;
        },
        obtenerAgencias: async(_,{})=>{
            const agencias=await Agencia.find();
            //console.log()
            return agencias;
        },
        obtenerInmuebles: async (_,{input1})=>{
            var filter1={};
            if(input1.tipo_inmueble!="Todos") filter1.tipo_inmueble={$in:input1.tipo_inmueble};
            if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            if(input1.precio_min<input1.precio_max) {
                filter1.precio={$gte:input1.precio_min,$lte:input1.precio_max}
            }else{
                filter1.precio={$gte:input1.precio_min};
            };

            if(input1.sup_terreno_max>0) filter1.superficie_terreno={$gte:input1.sup_terreno_min,$lte:input1.sup_terreno_max};
        
            if(input1.sup_construccion_max>0) filter1.superficie_construccion={$gte:input1.sup_construccion_min,$lte:input1.sup_construccion_max};
            if(input1.documentos_dia) filter1.documentos_dia={$in:input1.documentos_dia};

            if(input1.construccion_estrenar) filter1.construccion_estrenar={$in:input1.construccion_estrenar};
            if(input1.incluye_credito) filter1.incluye_credito={$in:input1.incluye_credito}; 
            if(input1.sin_construir) filter1.sin_construir={$in:input1.sin_construir};
            if(!input1.sin_construir){
                if(input1.tiempo_construccion_max>0) filter1.tiempo_construccion={$gte:input1.tiempo_construccion_min,$lte:input1.tiempo_construccion_max};
            }
            if(input1.inmueble_compartido){
                filter1.inmueble_compartido={$in:input1.inmueble_compartido};
                if(input1.numero_duenios<5){
                    filter1.numero_duenios={$in:input1.numero_duenios};
                }else{
                    filter1.numero_duenios={$gte:input1.numero_duenios}
                }
            }
            if(input1.numero_pisos>0){
                if(input1.numero_pisos<5){
                    filter1.numero_pisos={$in:input1.numero_pisos};
                }else{
                    filter1.numero_pisos={$gte:input1.numero_pisos};
                }
            }
            if(input1.sin_hipoteca) filter1.sin_hipoteca={$in:input1.sin_hipoteca};
            if(input1.numero_dormitorios>0){
                if(input1.numero_dormitorios<5){
                    filter1.numero_dormitorios={$in:input1.numero_dormitorios};
                }else{
                    filter1.numero_dormitorios={$gte:input1.numero_dormitorios};
                }
            }
            if(input1.numero_banios>0){
                if(input1.numero_banios<5){
                    filter1.numero_banios={$in:input1.numero_banios};
                }else{
                    filter1.numero_banios={$gte:input1.numero_banios};
                }
            }
            if(input1.numero_garaje>0){
                if(input1.numero_garaje<5){
                    filter1.numero_garaje={$in:input1.numero_garaje};
                }else{
                    filter1.numero_garaje={$gte:input1.numero_garaje};
                }
            }
            if(input1.mascotas_permitidas) filter1.mascotas_permitidas={$in:input1.mascotas_permitidas};
            if(input1.lavanderia) filter1.lavanderia={$in:input1.lavanderia};
            if(input1.zona_lavadora) filter1.zona_lavadora={$in:input1.zona_lavadora};
            if(input1.churrasquero) filter1.churrasquero={$in:input1.churrasquero};
            if(input1.azotea) filter1.azotea={$in:input1.azotea};
            if(input1.cancha) filter1.cancha={$in:input1.cancha};
            if(input1.piscina) filter1.piscina={$in:input1.piscina};
            if(input1.sauna) filter1.sauna={$in:input1.sauna};
            if(input1.tienda) filter1.tienda={$in:input1.tienda};
            if(input1.estudio) filter1.estudio={$in:input1.estudio};
            if(input1.jardin) filter1.jardin={$in:input1.jardin};
            if(input1.balcon) filter1.balcon={$in:input1.balcon};
            if(input1.ascensor) filter1.ascensor={$in:input1.ascensor};
            if(input1.sotano) filter1.sotano={$in:input1.sotano};
            if(input1.deposito) filter1.deposito={$in:input1.deposito};
            if(input1.iglesia) filter1.iglesia={$in:input1.iglesia};
            if(input1.parque) filter1.parque={$in:input1.parque};
            if(input1.deportiva) filter1.deportiva={$in:input1.deportiva};
            if(input1.policial) filter1.policial={$in:input1.policial};
            if(input1.residencial) filter1.residencial={$in:input1.residencial};
            if(input1.estudiantil) filter1.estudiantil={$in:input1.estudiantil};
            if(input1.comercial) filter1.comercial={$in:input1.comercial};
            if(input1.verificados) filter1.verificados={$in:input1.verificados};
            if(input1.bienes_adjudicados) filter1.bienes_adjudicados={$in:input1.bienes_adjudicados};
            if(input1.remates_judiciales) filter1.remates_judiciales={$in:input1.remates_judiciales};
            if(input1.imagenes_2D) filter1.imagenes_2D_link={$nin:""};
            if(input1.video_2D) filter1.video_2D_link={$nin:""};
            if(input1.tour_virtual) filter1.tour_virtual_360_link={$nin:""};
            if(input1.video_tour) filter1.video_tour_360_link={$nin:""};
            //console.log("filtro....",filter1);

            const inmuebles=Inmueble.find(filter1).sort({precio:1});
            
            filter1=({numero_banios:12});
            //filter1.numero_banios={$in: 0};
            filter1.numero_dormitorios={$in:11};
            let filter2={};
            console.log("id_usuario",input1.id_usuario);
            filter2.usuario={$in:""};
            if(input1.id_usuario!=""){
                await inmuebles.find({}).populate("agencia",{})
                .populate({
                    path:"usuarios_favorito",match:{"usuario":input1.id_usuario},
                    populate:{path:"usuario"}});
            }else{
                await inmuebles.find({}).populate("agencia",{})
                .populate({
                    path:"usuarios_favorito",match:{filter2},
                    populate:{path:"usuario"}});
            }
            return inmuebles;
        },
        obtenerInmueblesNuevos: async (_,{input})=>{
            var filter1={};
            filter1.ultima_modificacion={$gte:input.fecha};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            //console.log("filtro....",filter1);
            filter1.numero_dormitorios={$gte:input.dormitorios_min,$lte:input.dormitorios_max};
            filter1.numero_banios={$gte:input.banios_min,$lte:input.banios_max};
            filter1.numero_garaje={$gte:input.garaje_min,$lte:input.garaje_max};
            filter1.superficie_terreno={$gte:input.superficie_terreno_min,$lte:input.superficie_terreno_max};
            filter1.superficie_construccion={$gte:input.superficie_construccion_min,$lte:input.superficie_construccion_max};
            filter1.antiguedad_construccion={$gte:input.antiguedad_construccion_min,$lte:input.antiguedad_construccion_max};
            filter1.precio={$gte:input.precio_min,$lte:input.precio_max};
            filter1.autorizacion={$in:"Activo"};
            filter1.estado_negociacion={$nin:"Vendido"};
            const inmuebles=Inmueble.find(filter1).sort({precio:1});
        
            let filter2={};
            console.log("id_usuario",input.id_usuario);
            filter2.usuario={$in:""};
            if(input.id_usuario!=""){
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{"usuario":input.id_usuario},
                    populate:{path:"usuario"}});
            }else{
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{filter2},
                    populate:{path:"usuario"}});
            }
            return inmuebles;
        },
        obtenerInmueblesSimpleFiltro: async (_,{input1})=>{
            var filter1={};
            if(input1.ciudad!="Todos") filter1.ciudad={$in:input1.ciudad};
            if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            //filter1.autorizacion={$in:"Activo"};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            //console.log("filtro....",filter1);

            //const inmuebles=Inmueble.find(filter1).sort({precio:1}).sort({tiempo_construccion:1});
            const inmuebles=Inmueble.find(filter1);
            let filter2={};
            //console.log("id_usuario",input1.id_usuario);
            filter2.usuario={$in:""};
            //await inmuebles.find({}).populate("agencia",{});
            if(input1.id_usuario!=""){
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{"usuario":input1.id_usuario},
                    populate:{path:"usuario"}});
            }else{
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{filter2},
                    populate:{path:"usuario"}});
            }
            //const cantidad=await inmuebles.find({}).countDocuments();
            //console.log(cantidad);
            return inmuebles;
        },
        obtenerInmueblesPendiente: async (_,{input1})=>{
            var filter1={};
            filter1.autorizacion="Pendiente";
            //if(input1.autorizacion!="Todos") filter1.ciudad={$in:input1.ciudad};
            //if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            //console.log("filtro....",filter1);

            const inmuebles=Inmueble.find(filter1).sort({fecha_creacion:1});
            let filter2={};
            console.log("id_usuario",input1.id_usuario);
            filter2.usuario={$in:""};
            //await inmuebles.find({}).populate("agencia",{});
            if(input1.id_usuario!=""){
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{"usuario":input1.id_usuario},
                    populate:{path:"usuario"}});
            }else{
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{filter2},
                    populate:{path:"usuario"}});
            }
            return inmuebles;
        },
        obtenerUsuarioFavorito: async(_,{id})=>{
            const inmuebleFavorito=await InmuebleFavorito.find({usuario:id})
            .populate({
                path: "usuario"
            })
            .populate({
                path: "inmueble",
                populate:{
                    path:"agencia"
                }
            })
            .populate({path:"imagenes"});
            return inmuebleFavorito;
        },
        obtenerMisInmueblesVenta: async (_,{id})=>{
            var filter1={};
            //filter1.creador={$in:id};
            //if(input1.autorizacion!="Todos") filter1.ciudad={$in:input1.ciudad};
            //if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            //console.log("filtro....",filter1);

            const inmuebles=Inmueble.find(filter1).sort({fecha_creacion:1});
            let filter2={};
            filter2.usuario={$in:id};
            let filter3={};
            filter3.verificado=false;
            //await inmuebles.find({}).populate("agencia",{});
            /*await inmuebles.find({}).populate("creador",{})
            .populate("imagenes",{})
            .populate({
                path:"usuarios_favorito",match:filter2});*/
            await inmuebles.find({}).populate("creador",{})
            .populate({path:"propietario"})
            .populate("imagenes",{})
            .populate({
                path:"usuarios_favorito",match:filter2,
                populate:{path:"usuario"}});
            
            return inmuebles;
        },
        obtenerInmueblesAgencia: async(_)=>{
            const resultado = await Inmueble.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "agencias",
                            localField: "agencia",
                            foreignField: "_id",
                            as: "agencia"
                        }
                    },
                    {$unwind: "$agencia"},
                    {$match:{tipo_contrato:"Venta",tipo_inmueble:"Casa"}}

                ]
            )
            //await resultado.Inmueble.find({"sin_hipoteca":true});
            console.log(resultado);
            return resultado;
        },
        obtenerAdministradorInmueble: async (_,{id})=>{
            var filter1={};
            filter1.solicitud_terminada={$in:false};
           // filter1.usuario_respondedor={$in:[null,id]};
            //if(input1.autorizacion!="Todos") filter1.ciudad={$in:input1.ciudad};
            //if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            //console.log("filtro....",filter1);
            let administradorImmueble= AdministradorImmueble.find(filter1).sort({fecha_solicitud:1});
            /*await administradorImmueble.find({}).populate({
                path:"inmueble",populate:({path:"imagenes"}),populate:({path:"creador"})})
                .populate({path:"usuario_solicitante"})
                .populate({path:"usuario_respondedor"});*/
                await administradorImmueble.find({}).populate({
                    path:"inmueble",populate:{path:"creador"}})
                    .populate({path:"propietario"})
                    .populate({path:"inmueble",populate:{path:"imagenes"}})
                    .populate({path:"usuario_solicitante"})
                    .populate({path:"usuario_respondedor"});
            
            return administradorImmueble;
        },
        obtenerSolicitudesAdministradores: async (_,{id})=>{
            var filter1={};
            filter1.administrador_inmueble=id;
            filter1.solicitud_terminada={$in:false};
            const solicitudesAdministradores= SolicitudesAdministradores.find(filter1).sort({fecha_solicitud:1});
            
            return solicitudesAdministradores;
        },
        obtenerSolicitudesUsuarios: async (_,{id})=>{
            var filter1={};
            filter1.usuario_respondedor=id;
            filter1.solicitud_terminada={$in:false};
            let solicitudesUsuarios= SolicitudesUsuarios.find(filter1).sort({fecha_solicitud:1});
            await solicitudesUsuarios.find({}).populate({
                path:"inmueble",populate:({path:"imagenes"})})
                .populate({path:"inmueble",populate:({path:"creador"})})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({path:"usuario_solicitante"})
                .populate({path:"usuario_respondedor"});
            return solicitudesUsuarios;
        },
        obtenerCuentasBancos: async(_,{})=>{
            let cuentasBanco=CuentasBanco.find({});
            return cuentasBanco;
        },
        obtenerAgentePagos: async(_,{id})=>{
            var filter1={};
            filter1.agente=id;
            let agentePago=AgentePago.find(filter1).sort({mes:1});
            await agentePago.find({})
                .populate({path:"cuenta_banco"})
                .populate({path:"agente"})
                .populate({path:"administrador"});
            return agentePago;
        },
        obtenerAgentePagosAdministrador: async(_,{id})=>{
            var filter1={};
            filter1.administrador={$in:[null,id]};
            filter1.autorizacion="Pendiente";
            let agentePago=AgentePago.find(filter1).sort({fecha_solicitud:1});
            await agentePago.find({})
                .populate({path:"cuenta_banco"})
                .populate({path:"agente"})
                .populate({path:"administrador"});
            return agentePago;
        },
        obtenerPlanesPagoAgente: async(_)=>{
            var filter1={};
            filter1.activo=true;
            let planesPagoAgente=PlanesPagoAgente.find(filter1).sort({plan:1});
            return planesPagoAgente;
        },
        obtenerVersionesAPP: async(_)=>{
            let versionesAPP=await VersionesAPP.findOne({}).sort({fecha_publicacion:1})
            return versionesAPP;     
        },
        autenticarUsuarioAutomatico: async (_,{email,imei}) => {
            let usuario;
            var fecha=new Date();
            if(email!=""){
                var filter1={};
                var mes=fecha.getMonth();
                filter1.mes={$gte:mes};
                //fecha.setDate(fecha.getDate()-3);
                await Usuario.findOneAndUpdate({email:email},{fecha_ultimo_ingreso:fecha})
                usuario=await Usuario.findOne({email:email})
                .populate({path:"base_visto",match:{tipo:"visto"}})
                .populate({path:"doble_visto",match:{tipo:"doble_visto"}})
                .populate({path:"favorito",match:{tipo:"favorito"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"cuenta_banco"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"agente"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"administrador"}});
                return usuario;
            }else if(imei!=""){
                const existeUsuario = await Usuario.findOne({ imei_telefono:imei });
                if(!existeUsuario){
                    const nuevoUsuario = new Usuario();
                    nuevoUsuario.fecha_ultimo_ingreso=fecha;
                    nuevoUsuario.imei_telefono=imei;
                    nuevoUsuario.tipo_usuario="Común";
                    nuevoUsuario.medio_registro="Defecto";
                    await nuevoUsuario.save();
                }
                usuario=await Usuario.findOne({imei_telefono:imei})
                    .populate("usuario_inmueble_base")
                    .populate({path:"agente_pagos",
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"agente_pagos",
                    populate:{path:"agente"}})
                    .populate({path:"agente_pagos",
                    populate:{path:"administrador"}});
                return usuario;
            }else{
                usuario=await Usuario.findOne({email:""})
                .populate({path:"base_visto",match:{tipo:"visto"}})
                .populate({path:"doble_visto",match:{tipo:"doble_visto"}})
                .populate({path:"favorito",match:{tipo:"favorito"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"cuenta_banco"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"agente"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"administrador"}});
                return usuario;
            }
        },
        obtenerZonas: async(_,{ciudad})=>{
            let zonas=await Zona.find({ciudad:ciudad});
            return zonas;     
        },

    },

    /*Subscription: {
        inmuebleAdded: {
            subscribe: () => pubsub.asyncIterator([INMUEBLE_ADDED]),
        }
    },*/
    Mutation: {
        crearModificarUsuario: async (_,{input,actividad}) => {
            const {email,password}=input;
            const existeUsuario = await Usuario.findOne({ email });
            let usuario;
            var filter1={};
            var fecha=new Date();
            var mes=fecha.getMonth();
            filter1.mes={$gte:mes};
            if(existeUsuario){
                if(actividad=="Registrar"){
                    throw new Error('El usuario ya está registrado');
                }
            }else{
                if(actividad=="Recuperar"){
                    throw new Error('El usuario no está registrado');
                }
            }
            try{
                //hashear password
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password,salt);
                if(actividad=="Registrar"){
                    const nuevoUsuario = new Usuario(input);
                    await nuevoUsuario.save();
                }else if(actividad=="Recuperar"){
                    usuario=await Usuario.findOne({email:input.email});
                    usuario.password=input.password;
                    usuario.save();
                    //await Usuario.findOneAndUpdate({email:input.email},input);
                }else{

                }
                
                usuario=await Usuario.findOne({email:input.email})
                    .populate({path:"base_visto",match:{tipo:"visto"}})
                    .populate({path:"doble_visto",match:{tipo:"doble_visto"}})
                    .populate({path:"favorito",match:{tipo:"favorito"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"agente"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"administrador"}});
                return usuario;
                
            }catch(error){
                console.log(error);
            }
            
        },
        autenticarUsuario: async (_,{input}) => {
            const { email, password} = input;
            //si el usuario existe
            
            const existeUsuario = await Usuario.findOne({ email });
            let usuario;
            //console.log(existeUsuario);
            var filter1={};
            var fecha=new Date();
            var mes=fecha.getMonth();
            filter1.mes={$gte:mes};
            if(input.medio_registro=="Creada"){
                if(!existeUsuario){
                    throw new Error('El usuario no existe');
                }
                // si el password es correcto
                
                const passwordCorrecto=await bcryptjs.compare(password,existeUsuario.password);
                
                //console.log(passwordCorrecto)
                if(!passwordCorrecto){
                    throw new Error('Password Incorrecto');
                }
                if(existeUsuario.estado_cuenta==false){
                    throw new Error('Cuenta inactiva, contáctese con el administrador');
                }
                /*usuario=await Usuario.findOne({email:input.email})
                .populate("usuario_inmueble_base")
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"cuenta_banco"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"agente"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"administrador"}});*/
                usuario=await Usuario.findOne({email:input.email})
                .populate({path:"base_visto",match:{tipo:"visto"}})
                .populate({path:"doble_visto",match:{tipo:"doble_visto"}})
                .populate({path:"favorito",match:{tipo:"favorito"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"cuenta_banco"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"agente"}})
                .populate({path:"agente_pagos",match:filter1,
                populate:{path:"administrador"}});
            }else{
                if(!existeUsuario){
                    const nuevoUsuario = new Usuario(input);
                    nuevoUsuario.registro=Date.now();
                    nuevoUsuario.fecha_ultimo_ingreso=Date.now();
                    await nuevoUsuario.save();
                    usuario=nuevoUsuario;
                }else{
                    //var fecha=new Date();
                    fecha.setDate(fecha.getDate()-3);
                    await Usuario.findOneAndUpdate({email:input.email},{fecha_ultimo_ingreso:fecha})
                    /*usuario=await Usuario.findOne({email:input.email})
                    .populate("usuario_inmueble_base")
                    .populate("agente_pagos");*/
                    /*usuario=await Usuario.findOne({email:input.email})
                    .populate("usuario_inmueble_base")
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"agente"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"administrador"}});*/
                    usuario=await Usuario.findOne({email:input.email})
                    .populate({path:"base_visto",match:{tipo:"visto"}})
                    .populate({path:"doble_visto",match:{tipo:"doble_visto"}})
                    .populate({path:"favorito",match:{tipo:"favorito"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"agente"}})
                    .populate({path:"agente_pagos",match:filter1,
                    populate:{path:"administrador"}});
                    
                    //await usuario.find({}).populate("usuario_inmueble_base",{});
                }
            }
            //await usuario.;
            //dar acceso a la app
            return usuario;
            /*return {
                token: crearToken(existeUsuario,process.env.SECRETA,'2hr')
            };*/
        },
        nuevoProyecto: async (_,{input},ctx)=>{
            //console.log('DESDE RESOLVER', ctx);
            //asociar el creador al proyecto
            
            try{
                const proyecto = Proyecto(input);
                proyecto.creador = ctx.usuario.id;
                //almacenar en BD
                const resultado=await proyecto.save();

                return resultado;
            }catch(error){
                console.log(error);
            }
        },
        actualizarProyecto: async (_,{id,input},ctx)=>{
            //revisar si el proyecto existe o no

            let proyecto = await Proyecto.findById(id)

            if(!proyecto){
                throw new Error('Proyecto no encontrado');
            }
            //revisar si la persona que trata de editarlo es el crador
            if(proyecto.creador.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales para editar')
            }
            //guardar el proyecto
            proyecto = await Proyecto.findOneAndUpdate({_id: id},input,{new: true});
            return proyecto;
        },
        eliminarProyecto: async (_,{id},ctx)=>{
            //revisar si el proyecto existe o no

            let proyecto = await Proyecto.findById(id)

            if(!proyecto){
                throw new Error('Proyecto no encontrado');
            }
            //revisar si la persona que trata de editarlo es el crador
            if(proyecto.creador.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales para editar')
            }

            //eliminar proyecto
            await Proyecto.findOneAndDelete({_id : id});
            return "Proyecto eliminado";
        },
        nuevaTarea: async (_,{input},ctx)=>{
            try{
                const tarea = new Tarea(input);
                tarea.creador = ctx.usuario.id;
                const resultado=await tarea.save();
                return resultado;
            }catch(error){  
                console.log(error);
            }
        },
        actualizarTarea: async (_,{id,input,estado},ctx)=>{
            //revisar si la tarea existe
            let tarea=await Tarea.findById(id);

            if(!tarea){
                throw new Error('Tarea no encontrada');
            }
            //revisar si la persona que lo edita es el propietario
            if(tarea.creador.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales para editar')
            }
            //asignar estado
            input.estado=estado;
            //guardar y retornar tarea
            tarea = await Tarea.findOneAndUpdate({_id: id},input,{new: true});
            return tarea;
        },
        eliminarTarea: async (_,{id},ctx)=>{
            //si la tarea existe o no 
            let tarea = await Tarea.findById(id);
            if(!tarea){
                throw new Error('Tarea no encontrada');
            }
            //si la persona que elimina no es el creador
            if(tarea.creador.toString()!==ctx.usuario.id){
                throw new Error('No tienes las credenciales para eliminar');
            }

            //eliminar
            await Tarea.findByIdAndDelete({_id: id});

            return "Tarea eliminada";
        },
        registrarAgencia: async (_,{input}) => {
            try{

                //Registrar un nuevo usuario
                const nuevaAgencia = new Agencia(input);
                console.log(nuevaAgencia);

                nuevaAgencia.save();
                return 'Agencia registrada correctamente';
            }catch(error){
                console.log(error);
            }
        },
        actualizarAgencia: async (_,{id,input})=>{
            let agencia=await Agencia.findById(id);

            if(!agencia){
                throw new Error('Agencia no encontrada');
            }
            await Agencia.findOneAndUpdate({_id: id},input);
            return "Se guardaron los cambios";
        },
        eliminarAgencia: async (_,{id})=>{
            let agencia=await Agencia.findById(id);

            if(!agencia){
                throw new Error('Agencia no encontrada');
            }

            await Agencia.findByIdAndDelete({_id: id});
            return "Agencia eliminada";
        },
        registrarInmueble: async (_,{id,input}) => {
            try{
                let secuencia=await SecuenciasIndices.findOne();
                if(!secuencia){
                    secuencia=SecuenciasIndices();
                    secuencia.indice_inmuebles=1;
                    await secuencia.save();
                }
                const nuevoInmueble = new Inmueble(input);
                nuevoInmueble.creador=id;
                nuevoInmueble.indice=secuencia.indice_inmuebles;
                nuevoInmueble.historial_precios.push(nuevoInmueble.precio);
                await nuevoInmueble.save();
                secuencia.indice_inmuebles=secuencia.indice_inmuebles+1;
                await secuencia.save();
                let resultado=await Inmueble.find().where('_id').equals(nuevoInmueble.id);
                console.log("imprimiendo resultado  ",resultado);
                return "Se registro correctamente";
            }catch(error){
                console.log(error);
            }
        },
        actualizarPrecioInmueble: async(_,{id,precio})=>{
            let modificar=true;
            let inmueble=await Inmueble.findById(id);
            let administradorInmueble=await AdministradorImmueble.findOne({"inmueble":id});
            if(!inmueble){
                throw new Error('Inmueble no encontrada');
            }
            if(inmueble.estado_negociacion=="Vendido"){
                modificar=false;
                crearSolicitud=false;
                throw new Error('No se puede modificar, el inmueble ya fue vendido');
            }
            
            if(inmueble.autorizacion=="Inactivo"){
                if(administradorInmueble.tipo_solicitud=="Dar baja"){
                    if(administradorInmueble.respuesta=="Confirmado"){
                        modificar=false;
                        throw new Error('No se puede modificar porque se dió de baja el inmueble');
                    }
                }
            }else if(inmueble.autorizacion=="Activo"){
                if(administradorInmueble.tipo_solicitud=="Venta"){
                    if(administradorInmueble.respuesta==""){
                        modificar=false;
                        throw new Error('No se puede modificar porque se reportó la venta del inmueble');
                    }
                }
            }
            var fecha=new Date();
            if(modificar==true){
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se modificó el precio del inmueble de "+inmueble.precio+" a "+precio;
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                inmueble.precio=precio;
                inmueble.historial_precios.push(precio);
                inmueble.save();
                return bitacoraInmueble.actividad;
            }

            return "Se guardaron los cambios";
        },
        actualizarInmueble: async(_,{id,input1,input2})=>{
            let modificar=true;
            let crearSolicitud=true; 
            let inmueble=await Inmueble.findById(id);
            let administradorInmueble=await AdministradorImmueble.findOne({"inmueble":id});
            if(!inmueble){
                throw new Error('Inmueble no encontrada');
            }
            if(inmueble.estado_inmueble=="Vendido"){
                modificar=false;
                crearSolicitud=false;
                throw new Error('No se puede modificar, el inmueble ya fue vendido');
            }
            
            if(inmueble.autorizacion=="Inactivo"){
                if(administradorInmueble.tipo_solicitud=="Dar baja"){
                    if(administradorInmueble.respuesta=="Confirmado"){
                        modificar=false;
                        crearSolicitud=false;
                        throw new Error('No se puede modificar porque se dió de baja el inmueble');
                    }
                }else if(administradorInmueble.tipo_solicitud=="Dar alta"){
                    if(administradorInmueble.respuesta=="Rechazado"){
                        crearSolicitud=true;
                    }
                }
            }else if(inmueble.autorizacion=="Activo"){
                if(administradorInmueble.tipo_solicitud=="Venta"){
                    if(administradorInmueble.respuesta==""){
                        modificar=false;
                        crearSolicitud=false;
                        throw new Error('No se puede modificar porque se reportó la venta del inmueble');
                    }
                }
            }else{
                if(administradorInmueble.tipo_solicitud=="Dar alta"){
                    if(administradorInmueble.respuesta==""){
                        crearSolicitud=false;
                    }
                }
            }
            if(modificar==true){
                await Inmueble.findOneAndUpdate({_id:id},input1);
                await InmuebleImagenes.findOneAndUpdate({inmueble:id},input2);
            }
            var fecha=new Date();
            if(crearSolicitud==true){
                if(administradorInmueble.tipo_solicitud=="Dar alta"&&administradorInmueble.respuesta=="Rechazado"){
                    let solicitudesAdministradores=SolicitudesAdministradores();
                    solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                    solicitudesAdministradores.tipo_solicitud="Dar alta";
                    solicitudesAdministradores.fecha_solicitud=fecha;
                    solicitudesAdministradores.respuesta="";
                    solicitudesAdministradores.observaciones="";
                    solicitudesAdministradores.link_respaldo_solicitud="";
                    solicitudesAdministradores.link_respaldo_respuesta="";
                    await solicitudesAdministradores.save();
                    administradorInmueble.respuesta="";
                    administradorInmueble.tipo_solicitud="Dar alta";
                    administradorInmueble.fecha_solicitud=fecha;
                    administradorInmueble.observaciones="";
                    administradorInmueble.link_respaldo_solicitud="";
                    administradorInmueble.link_respaldo_respuesta="";
                    administradorInmueble.solicitud_terminada=false;
                    administradorInmueble.respuesta_entregada=false;
                    await administradorInmueble.save();
                }else{
                    let solicitudesAdministradores=SolicitudesAdministradores();
                    solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                    solicitudesAdministradores.tipo_solicitud="Modificar datos";
                    solicitudesAdministradores.fecha_solicitud=fecha;
                    solicitudesAdministradores.respuesta="";
                    solicitudesAdministradores.observaciones="";
                    solicitudesAdministradores.link_respaldo_solicitud="";
                    solicitudesAdministradores.link_respaldo_respuesta="";
                    await solicitudesAdministradores.save();
                    administradorInmueble.respuesta="";
                    administradorInmueble.tipo_solicitud="Modificar datos";
                    administradorInmueble.fecha_solicitud=fecha;
                    administradorInmueble.observaciones="";
                    administradorInmueble.link_respaldo_solicitud="";
                    administradorInmueble.link_respaldo_respuesta="";
                    administradorInmueble.solicitud_terminada=false;
                    administradorInmueble.respuesta_entregada=false;
                    await administradorInmueble.save();
                }
            }
            if(modificar==true&&crearSolicitud==true){
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.fecha=fecha;
                if(administradorInmueble.tipo_solicitud=="Dar alta"){
                    bitacoraInmueble.actividad="Envío de solicitud para dar de alta el inmueble modificado";
                }else{
                    bitacoraInmueble.actividad="Envío de solicitud para modificar el inmueble";
                }
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }else if(modificar==true){
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se modificó el inmueble";
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }

            return "Se guardaron los cambios";
        },
        eliminarInmueble: async (_,{id})=>{
            let inmueble=await Inmueble.findById(id);

            if(!inmueble){
                throw new Error('Inmueble no encontrada');
            }

            await Inmueble.findByIdAndDelete({_id: id});

            return "Inmueble eliminado";
        },
        registrarInmuebleFavorito: async (_,{id_inmueble,id_usuario,input1,input_visto,input_doble_visto,input_favorito}) => {
            try{
                let inmuebleFavorito=await InmuebleFavorito.findOne({"inmueble":id_inmueble,"usuario":id_usuario});
                let usuarioInmuebleBase=await UsuarioInmuebleBase.findOne({"usuario":id_usuario});
                let base_visto=await UsuarioInmuebleBase.findOne({"usuario":id_usuario,"tipo":"visto"});
                let base_doble_visto=await UsuarioInmuebleBase.findOne({"usuario":id_usuario,"tipo":"doble_visto"});
                let base_favorito=await UsuarioInmuebleBase.findOne({"usuario":id_usuario,"tipo":"favorito"});
                if(inmuebleFavorito){
                    await InmuebleFavorito.findOneAndUpdate({_id:inmuebleFavorito.id},input1);
                }else{
                    inmuebleFavorito=new InmuebleFavorito(input1);
                    inmuebleFavorito.inmueble = id_inmueble;
                    inmuebleFavorito.usuario = id_usuario;
                    await inmuebleFavorito.save();
                    let inmueble=await Inmueble.findById(id_inmueble);
                    inmueble.usuarios_favorito.push(inmuebleFavorito);
                    await inmueble.save();
                    
                }
                let usuario=await Usuario.findById(id_usuario);

                if(base_visto){
                    await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"visto"},input_visto);
                }else{
                    usuarioInmuebleBase=new UsuarioInmuebleBase(input_visto);
                    usuarioInmuebleBase.usuario=id_usuario;
                    usuarioInmuebleBase.fecha_inicio=Date.now();
                    usuario.usuario_inmueble_base.push(usuarioInmuebleBase.id);
                    usuarioInmuebleBase.tipo="visto";
                    await usuarioInmuebleBase.save();
                }
                if(base_doble_visto){
                    await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"doble_visto"},input_doble_visto);
                }else{
                    usuarioInmuebleBase=new UsuarioInmuebleBase(input_visto);
                    usuarioInmuebleBase.usuario=id_usuario;
                    usuarioInmuebleBase.fecha_inicio=Date.now();
                    usuario.usuario_inmueble_base.push(usuarioInmuebleBase.id);
                    usuarioInmuebleBase.tipo="doble_visto";
                    await usuarioInmuebleBase.save();
                }
                if(base_favorito){
                    await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"favorito"},input_favorito);
                }else{
                    usuarioInmuebleBase=new UsuarioInmuebleBase(input_visto);
                    usuarioInmuebleBase.usuario=id_usuario;
                    usuarioInmuebleBase.fecha_inicio=Date.now();
                    usuario.usuario_inmueble_base.push(usuarioInmuebleBase.id);
                    usuarioInmuebleBase.tipo="favorito";
                    await usuarioInmuebleBase.save();
                }
                await usuario.save();
                return "Se registro correctamente";
            }catch(error){
                console.log(error);
            }
        },
        actualizarFechaInmuebleBase: async(_,{id,fecha})=>{
            //await UsuarioInmuebleBase.findOneAndUpdate({_id:id},{fecha_inicio:fecha});
           var fec=new Date();
           var ff=fec.getDate();
           console.log(ff);
            return fec.toISOString();
        },
        modificarEstadoInmuebleVendedor: async (_,{id_inmueble,tipo_accion})=>{
            let administradorInmueble=await AdministradorImmueble.findOne({inmueble:id_inmueble});
            let usuario=await Usuario.findById(administradorInmueble.usuario_solicitante);
            let inmueble=await Inmueble.findById(id_inmueble);
            var fecha=new Date();
            if(tipo_accion=="Dar alta"){
                inmueble.autorizacion="Pendiente";
                inmueble.ultima_modificacion=fecha;
                await inmueble.save();
                let solicitudesAdministradores=SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Dar alta";
                solicitudesAdministradores.fecha_solicitud=fecha;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo="";
                await solicitudesAdministradores.save();
                administradorInmueble.tipo_solicitud="Dar alta";
                administradorInmueble.fecha_solicitud=fecha;
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo="";
                administradorInmueble.solicitud_terminada=false;
                administradorInmueble.respuesta_entregada=false;
                await administradorInmueble.save();
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se envió solicitud para dar de alta el inmueble";
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }else if(tipo_accion=="Dar baja"){
                inmueble.autorizacion="Inactivo";
                inmueble.ultima_modificacion=fecha;
                inmueble.calificacion=1;
                await inmueble.save();
                usuario.sumatoria_calificacion=usuario.sumatoria_calificacion+1;
                usuario.cantidad_inmuebles_calificados=usuario.cantidad_inmuebles_calificados+1;
                await usuario.save();
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se dió de baja el inmueble";
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }else if(tipo_accion=="Dar baja y reportar"){
                inmueble.autorizacion="Pendiente";
                inmueble.ultima_modificacion=fecha;
                await inmueble.save();
                let solicitudesAdministradores=SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Dar baja";
                solicitudesAdministradores.fecha_solicitud=fecha;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo="";
                await solicitudesAdministradores.save();
                administradorInmueble.tipo_solicitud="Dar baja";
                administradorInmueble.fecha_solicitud=fecha;
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo="";
                administradorInmueble.solicitud_terminada=false;
                administradorInmueble.respuesta_entregada=false;
                await administradorInmueble.save();
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se envió solicitud para dar de baja el inmueble";
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }else if(tipo_accion=="Vendido"){
                inmueble.ultima_modificacion=fecha;
                inmueble.calificacion=3;
                await inmueble.save();
                usuario.sumatoria_calificacion=usuario.sumatoria_calificacion+3;
                usuario.cantidad_inmuebles_calificados=usuario.cantidad_inmuebles_calificados+1;
                await usuario.save();
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se declaró vendido al inmueble";
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }else if(tipo_accion=="Vendido y reportar"){
                //inmueble.autorizacion="Pendiente";
                inmueble.estado_negociacion="Vendido";
                inmueble.ultima_modificacion=fecha;
                await inmueble.save();
                let solicitudesAdministradores=SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Vendido";
                solicitudesAdministradores.fecha_solicitud=fecha;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo="";
                await solicitudesAdministradores.save();
                administradorInmueble.tipo_solicitud="Vendido";
                administradorInmueble.fecha_solicitud=fecha;
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo="";
                administradorInmueble.solicitud_terminada=false;
                administradorInmueble.respuesta_entregada=false;
                await administradorInmueble.save();
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=administradorInmueble.usuario_solicitante;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Se envió solicitud para declarar vendido el inmueble";
                bitacoraInmueble.fecha=fecha;
                await bitacoraInmueble.save();
                return bitacoraInmueble.actividad;
            }
        },
        responderSolicitudAdministrador: async (_,{id,id_respondedor,id_comprador,id_solicitud,input})=>{
            let administradorInmueble=await AdministradorImmueble.findOne({_id:id});
            
            var fecha=new Date();
            if(input.tipo_solicitud=="Dar Alta"){
                if(administradorInmueble.usuario_respondedor==null){
                    administradorInmueble.usuario_respondedor=id_respondedor;
                    
                }else{
                    throw new Error('El inmueble está a cargo de otro administrador');
                }
            }
            
           
            let solicitudesAdministradores=await SolicitudesAdministradores.findOne({_id:id_solicitud});
            
            solicitudesAdministradores.fecha_respuesta=fecha;
            solicitudesAdministradores.respuesta=input.respuesta;
            solicitudesAdministradores.observaciones=input.observaciones;
            solicitudesAdministradores.link_respaldo=input.link_respaldo;
            solicitudesAdministradores.solicitud_terminada=input.solicitud_terminada;
            await solicitudesAdministradores.save();
            let inmueble=await Inmueble.findById(administradorInmueble.inmueble);
            if(administradorInmueble.tipo_solicitud==solicitudesAdministradores.tipo_solicitud && administradorInmueble.fecha_solicitud.getDate()==solicitudesAdministradores.fecha_solicitud.getDate()){
                administradorInmueble.usuario_respondedor=id_respondedor;
                administradorInmueble.fecha_respuesta=fecha;
                administradorInmueble.respuesta=input.respuesta;
                administradorInmueble.observaciones=input.observaciones;
                administradorInmueble.link_respaldo=input.link_respaldo;
                administradorInmueble.solicitud_terminada=input.solicitud_terminada;
                await administradorInmueble.save();
                if(input.tipo_solicitud=="Dar alta"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.estado_negociacion="Sin negociar";
                        inmueble.fecha_publicacion=fecha;
                        inmueble.ultima_modificacion=fecha;
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }else{
                        inmueble.autorizacion="Inactivo";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Dar baja"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Inactivo";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }else{
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Modificar datos"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Activo";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }else{
                        inmueble.autorizacion="Inactivo";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Vendido"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.estado_negociacion="Vendido";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                        const solicitudesUsuarios=SolicitudesUsuarios();
                        solicitudesUsuarios.fecha_solicitud=fecha;
                        solicitudesUsuarios.inmueble=administradorInmueble.inmueble;
                        solicitudesUsuarios.usuario_solicitante=administradorInmueble.usuario_solicitante;
                        solicitudesUsuarios.usuario_respondedor=id_comprador;
                        solicitudesUsuarios.tipo_solicitud="Calificar";
                        await solicitudesUsuarios.save();
                    }else{
                        inmueble.estado_negociacion="Negociaciones avanzadas";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }
                }
                return "Registro concluido";
            }else{
                if(input.tipo_solicitud=="Dar alta"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.estado_negociacion="Sin negociar";
                        inmueble.fecha_publicacion=fecha;
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Dar baja"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Modificar datos"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Vendido"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.estado_negociacion="Vendido";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                        const solicitudesUsuarios=SolicitudesUsuarios();
                        solicitudesUsuarios.fecha_solicitud=fecha;
                        solicitudesUsuarios.inmueble=administradorInmueble.inmueble;
                        solicitudesUsuarios.usuario_solicitante=administradorImmueble.usuario_solicitante;
                        solicitudesUsuarios.usuario_respondedor=id_comprador;
                        solicitudesUsuarios.tipo_solicitud="Calificar";
                        console.log(solicitudesUsuarios.id);
                        await solicitudesUsuarios.save();
                    }else{
                        inmueble.estado_negociacion="Negociaciones avanzadas";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }
                }
                return "Registro inconcluso";
            }
            
        },
        responderSolicitudUsuarioCalificacion: async (_,{id_solicitud,calificacion})=>{
            var fecha=new Date();
            let solicitudesUsuarios=await SolicitudesUsuarios.findOne({_id:id_solicitud});
            solicitudesUsuarios.fecha_respuesta=fecha;
            solicitudesUsuarios.solicitud_terminada=true;
            await solicitudesUsuarios.save();
            let inmueble=await Inmueble.findById(solicitudesUsuarios.inmueble);
            inmueble.calificacion=calificacion;
            inmueble.save();
            let usuario=await Usuario.findById(solicitudesUsuarios.usuario_solicitante);
            usuario.sumatoria_calificacion=usuario.sumatoria_calificacion+calificacion;
            usuario.cantidad_inmuebles_calificados=usuario.cantidad_inmuebles_calificados+1;
            await usuario.save();
            let bitacoraInmueble=await BitacoraInmueble();
            bitacoraInmueble.usuario=solicitudesUsuarios.usuario_respondedor;
            bitacoraInmueble.inmueble=inmueble.id;
            bitacoraInmueble.actividad="Se envió la calificacion de "+calificacion;
            bitacoraInmueble.fecha=fecha;
            await bitacoraInmueble.save();
            return "Se registró la calificacion";
            
            
        },
        registrarInmuebleMasivo: async (_,{id_creador,id_propietario})=>{
            var min=30;
            var max=32;
            var longitud=-65.22562;
            var latitud=-18.98654;
            let url_imagenes=[
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2F06d827045d76150a09f4a023dd76d16b.jpg?alt=media&token=7183086f-6817-455e-b8d6-2d84b68fd78c",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2F134357408.jpg?alt=media&token=3d0397b8-c067-46de-a853-d40de1760fd4",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2F13d942af414e8a02a19de8240de44894.jpg?alt=media&token=8d9652b0-8a65-45df-9b81-e38278dc37c4",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2F1gi1P1i1e1QK19.1_11.jpg?alt=media&token=999a2a30-8da1-4a18-9ecf-8e2912270ff9",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2FPlanos%20de%20casas%20prefabricadas%20en%20chile.JPG?alt=media&token=513c127f-abee-4b82-9dac-634fbcbafb8d",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fapartmento_turistico-1030x664.jpeg?alt=media&token=abd93b38-bf4e-418e-bb97-41ce04fcd4b1",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fcasa-familiar-frente.jpg?alt=media&token=51ae275d-0a13-4e03-a54b-7a89a9c92ade",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fe36b6e58a57eb9d5548331848e99aa94.jpg?alt=media&token=7bb4655c-8719-458e-a045-5780c9e87433",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimacxzcxzcges.jpg?alt=media&token=abdf6f13-bdd6-4d57-8c09-93fe3d2079f2",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1026119066.jpg?alt=media&token=75f8976b-0d3e-4416-aaf6-38290fe544c0",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1038248323.jpg?alt=media&token=5886962b-02c8-44b5-9863-ff002d8757f2",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1117168747.jpg?alt=media&token=f9399f2a-51aa-4ddf-99b7-69a220e4c06d",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1129635290.jpg?alt=media&token=6701bc62-edd2-4746-bf88-9e2b5f043af4",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1142124496.jpg?alt=media&token=d3a2e19f-9f3e-4c8c-8198-fa243eea41f7",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1155205225.jpg?alt=media&token=e4e96a12-d0a7-4121-b191-e85f79b9dc5c",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1451765537.jpg?alt=media&token=8b6a92cc-64c2-4670-9f27-21b1741bfe2f",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1522741482.jpg?alt=media&token=5d979bd7-1fa9-40f5-a41f-36e7265eefda",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1589060810.jpg?alt=media&token=c82b0756-155e-43b1-bf38-e3ba8888e1b0",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1590711943.jpg?alt=media&token=8d4abeec-6833-41c9-be3c-936452bd0f28",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1929304661.png?alt=media&token=444efd13-63cb-4fe7-87a5-5d2172f5d114",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker254000153.jpg?alt=media&token=fe86d828-c41c-4813-a23f-7d2e06df3597",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker460416203.jpg?alt=media&token=12da627f-cfdb-4453-8277-c2efb3aac9e6",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker561686717.jpg?alt=media&token=5c173725-0e43-4841-b723-9ccbc16f535a",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker779980728.jpg?alt=media&token=f77682da-8c28-4a5f-bac1-2884846801ac",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker79563316.jpg?alt=media&token=45197dc1-029c-4679-8d68-3e999dacdd88",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker811616543.jpg?alt=media&token=251349c5-0414-4f03-9e7f-724433c534ef",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimages312312.jpg?alt=media&token=d7a30c78-9b18-4b86-a4ef-15c411b4954f",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimages312312312.jpg?alt=media&token=3ed4a27e-b784-4f3c-9e84-80f9165b8419",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimages313.jpg?alt=media&token=8dfcae52-96fa-4159-b2dc-04d84658872d",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimagescxvcxvxc.jpg?alt=media&token=33b74f17-0b2c-4a4e-a932-7084dd345426",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimagxcczxczxes.jpg?alt=media&token=edf33899-0a45-4abd-bf33-9401d98a310f",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimcxxcvcxvxcages.jpg?alt=media&token=e1da3a53-87e4-4e5f-8813-40d426ea4c3d",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimxvvccages.jpg?alt=media&token=75d31b02-c949-4517-9589-fe002b2a21f5",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fluxury-home-2412145_960_720.jpg?alt=media&token=fbf62998-2f31-4242-95c9-b4796bc60482",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fque-es-bien-inmueble-1200x900.jpg?alt=media&token=66323909-6ba6-4f5a-aac7-d76c4cd31550",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fvendo-casa-prefabricada-en-maitencillo-1680-uf-02_3d2cb4a0_3.jpg?alt=media&token=bd9a0e44-e940-453d-b0fb-2f408c4df577"
                            ];
            //----------------------creando banco de datos--------------------------
            let nombres=["Juan","Ruben","Maria","Mario","Roberto","Pedro","Luis",
                    "Victor","Carlos","Cesar","Pablo","Rodrigo","Ariel","Cristian",
                    "Roxana","Shirley","Rosalia","Juana","Carlota","Carla","Raul",
                    "Wilber","Miguel","Angel","Fernando","Fernanda","David","Paola",
                    "Evelin","Alejandra","Alejandro","Marco","Alberto","Ruth"];
            let apellidos=["Llanos","Mamani","Arando","Castro","Cruz","Perez","Gonzales",
                        "Loredo","Peredo","Abastoflor","Paco","Rodriguez","Dominguez",
                        "Fuentes","Gallardo","Guzman","Suarez","Vega","Bejarano","Palacios",
                        "Garcilazo","Bohorquez","Branco","Arancibia","Puma","Nogales"];
            let estado_negociacion=["Sin negociar"];
            //let estado_inmueble=["Sin negociar","Sin negociar","Sin negociar","Negociación inicial","Negociación avanzada","Vendido"];
            //let ciudades=["La Paz","Oruro","Potosi","Cochabamba","Tarija","Sucre","Santa Cruz","Beni","Pando"];
            let ciudades=["Sucre"];
            let zona=["Zona 1","Zona 2","Zona 3","Zona 4","Zona 5","Zona 6","Zona 7","Zona 8","Zona ","Zona 10"];
            //let tipo_inmueble=["Casa","Departamento","Terreno"];
            let tipo_inmueble=["Casa"];
            //let tipo_contrato=["Venta","Alquiler","Anticrético"];
            let tipo_contrato=["Venta",];
            let imagenes_2D=["","www.linkimagenes"];
            let video_2D=["","www.linkvideo"];
            let tour_virtual=["","www.linktourvirtual"];
            let video_tour=["","www.linkvideotour"];
            let valores_booleanos=[true,false];
            let categorias=["Orgánicos","Pro","Pro360"];
            const cantidad_inmuebles=Math.floor(Math.random() * (max - min)) + min;
            //const cantidad_inmuebles=600;
            var i=0;
            for(i=0;i<cantidad_inmuebles;i++){
                let secuencia=await SecuenciasIndices.findOne();
                if(!secuencia){
                    secuencia=SecuenciasIndices();
                    secuencia.indice_inmuebles=1;
                    await secuencia.save();
                }
                const inmueble=Inmueble();
                inmueble.indice=secuencia.indice_inmuebles;
                /*
                var numero_aleatorio=Math.floor(Math.random() * (nombres.length - 0)) + 0;
                inmueble.nombre_propietario=nombres[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (apellidos.length - 0)) + 0;
                inmueble.nombre_propietario=inmueble.nombre_propietario+" "+apellidos[numero_aleatorio];*/
                numero_aleatorio=Math.floor(Math.random() * (ciudades.length - 0)) + 0;
                inmueble.ciudad=ciudades[numero_aleatorio];
                
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 0;
                inmueble.direccion="Dirección "+numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (tipo_inmueble.length  - 0)) + 0;
                inmueble.tipo_inmueble=tipo_inmueble[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (tipo_contrato.length  - 0)) + 0;
                inmueble.tipo_contrato=tipo_contrato[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 10;
                inmueble.precio=numero_aleatorio*10000;
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 10;
                inmueble.precio=inmueble.tipo_contrato=="Alquiler"?numero_aleatorio*100:inmueble.precio;
                inmueble.historial_precios.push(inmueble.precio);
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                if(valores_booleanos[numero_aleatorio]){
                    numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                    if(valores_booleanos[numero_aleatorio]){
                        numero_aleatorio=Math.floor(Math.random() * (500  - 0)) + 10;
                        inmueble.historial_precios.push(inmueble.precio+numero_aleatorio);
                    }else{
                        numero_aleatorio=Math.floor(Math.random() * (500  - 0)) + 10;
                        inmueble.historial_precios.push(inmueble.precio-numero_aleatorio);
                    }
                }
                numero_aleatorio=Math.floor(Math.random() * (estado_negociacion.length  - 0)) + 0;
                inmueble.estado_negociacion=estado_negociacion[numero_aleatorio];
                //----------------Generales---------------------
                numero_aleatorio=Math.floor(Math.random() * (zona.length - 0)) + 0;
                inmueble.zona=zona[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (11  - 0)) + 1;
                inmueble.coordenadas.push(Math.round((latitud-1/numero_aleatorio)*10000)/10000);
                numero_aleatorio=Math.floor(Math.random() * (80  - 0)) + 1;
                inmueble.coordenadas.push(Math.round((longitud-1/numero_aleatorio)*10000)/10000);
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.mascotas_permitidas=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sin_hipoteca=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.construccion_estrenar=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.materiales_primera=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 1;
                inmueble.superficie_terreno=inmueble.tipo_inmueble=="Departamento"?numero_aleatorio*10:numero_aleatorio*10;
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 1;
                inmueble.superficie_construccion=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio*10;
                
                numero_aleatorio=Math.floor(Math.random() * (25 - 0)) + 5;
                inmueble.tamanio_frente=numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (20  - 0)) + 0;
                inmueble.antiguedad_construccion=tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.proyecto_preventa=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.inmueble_compartido=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (4  - 0)) + 2;
                inmueble.numero_duenios=inmueble.inmueble_compartido?numero_aleatorio:1;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.servicios_basicos=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.gas_domiciliario=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.wifi=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.medidor_independiente=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.termotanque=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.calle_asfaltada=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.transporte=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.preparado_discapacidad=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.papeles_orden=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.habilitado_credito=valores_booleanos[numero_aleatorio];
                //----------------características internas------------------------
                numero_aleatorio=Math.floor(Math.random() * (7  - 0)) + 1;
                inmueble.plantas=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (7  - 0)) + 1;
                inmueble.ambientes=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5 - 0)) + 1;
                inmueble.numero_dormitorios=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5  - 0)) + 1;
                inmueble.numero_banios=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5  - 0)) + 1;
                inmueble.numero_garaje=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.amoblado=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.lavanderia=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.cuarto_lavado=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.churrasquero=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.azotea=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.condominio_privado=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.cancha=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.piscina=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sauna=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.jacuzzi=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.estudio=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.jardin=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.porton_electrico=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.aire_acondicionado=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.calefaccion=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.ascensor=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.deposito=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sotano=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.balcon=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.tienda=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.amurallado_terreno=inmueble.tipo_inmueble=="Terreno"?valores_booleanos[numero_aleatorio]:false;
                //----------------Comunidad-------------------------------------------------------

                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.iglesia=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.parque_infantil=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.escuela=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.universidad=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.plazuela=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.modulo_policial=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sauna_piscina_publica=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.gym_publico=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.centro_deportivo=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.puesto_salud=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.zona_comercial=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.remates_judiciales=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (imagenes_2D.length  - 0)) + 0;
                inmueble.imagenes_2D_link=imagenes_2D[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                inmueble.imagenes_2D_link=inmueble.imagenes_2D_link==""?"":inmueble.imagenes_2D_link+numero_aleatorio+".com";
                numero_aleatorio=Math.floor(Math.random() * (video_2D.length  - 0)) + 0;
                inmueble.video_2D_link=video_2D[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                inmueble.video_2D_link=inmueble.video_2D_link==""?"":inmueble.video_2D_link+numero_aleatorio+".com";
                numero_aleatorio=Math.floor(Math.random() * (tour_virtual.length  - 0)) + 0;
                inmueble.tour_virtual_360_link=tour_virtual[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                inmueble.tour_virtual_360_link=inmueble.tour_virtual_360_link==""?"":inmueble.tour_virtual_360_link+numero_aleatorio+".com";
                numero_aleatorio=Math.floor(Math.random() * (video_tour.length  - 0)) + 0;
                inmueble.video_tour_360_link=video_tour[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                inmueble.video_tour_360_link=inmueble.video_tour_360_link==""?"":inmueble.video_tour_360_link+numero_aleatorio+".com";
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                var fecha=new Date();
                
                fecha.setDate(fecha.getDate()-20);
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                fecha.setDate(fecha.getDate()+numero_aleatorio);
                inmueble.creado=fecha;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                if(valores_booleanos[numero_aleatorio]){
                    numero_aleatorio=Math.floor(Math.random() * (30  - 0)) + 0;
                    fecha.setDate(fecha.getDate()+numero_aleatorio);
                    inmueble.ultima_modificacion=fecha;
                }else{
                    inmueble.ultima_modificacion=fecha;
                }
                inmueble.autorizacion="Activo";
                numero_aleatorio=Math.floor(Math.random() * (categorias.length  - 0)) + 0;
                inmueble.categoria=categorias[numero_aleatorio];

                const inmuebleImagenes=InmuebleImagenes();
                let imagenes=[];
                var cantidad_imagenes=3;

                var j=0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_principal=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (2  - 0)) + 1;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_exteriores=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_dormitorios=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_banios=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_garaje=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_hall=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_jardin=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.url_imagenes_dependencias=imagenes;
                inmuebleImagenes.inmueble=inmueble.id;
                inmueble.imagenes=inmuebleImagenes.id;
                inmueble.creador=id_creador;
                inmueble.propietario=id_propietario;
                //console.log(inmueble);
                //console.log(inmuebleInternas);
                //console.log(inmuebleComunidad);
                //console.log(inmuebleOtros);
                secuencia.indice_inmuebles=secuencia.indice_inmuebles+1;
                let bitacoraInmueble=await BitacoraInmueble();
                bitacoraInmueble.usuario=id_creador;
                bitacoraInmueble.inmueble=inmueble.id;
                bitacoraInmueble.actividad="Envío de solicitud para dar de alta el inmueble creado";
                await bitacoraInmueble.save();
                let administradorInmueble=await AdministradorImmueble();
                
                administradorInmueble.tipo_solicitud="Dar alta";
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo_solicitud="";
                administradorInmueble.link_respaldo_respuesta="";
                administradorInmueble.inmueble=inmueble.id;
                administradorInmueble.usuario_solicitante=id_creador;
                await administradorInmueble.save();
                let solicitudesAdministradores=await SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Dar alta";
                solicitudesAdministradores.fecha_solicitud=administradorInmueble.fecha_solicitud;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo_solicitud="";
                solicitudesAdministradores.link_respaldo_respuesta="";
                solicitudesAdministradores.inmueble=inmueble.id;
                solicitudesAdministradores.usuario_solicitante=id_creador;
                await solicitudesAdministradores.save();

               /*
                administradorInmueble.tipo_solicitud="Modificar Datos";
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo="";
                administradorInmueble.inmueble=inmueble.id;
                administradorInmueble.usuario_solicitante=id;
                await administradorInmueble.save();
                let solicitudesAdministradores1=await SolicitudesAdministradores();
                solicitudesAdministradores1.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores1.tipo_solicitud="Modificar Datos";
                solicitudesAdministradores1.fecha_solicitud=administradorInmueble.fecha_solicitud;
                solicitudesAdministradores1.respuesta="";
                solicitudesAdministradores1.observaciones="";
                solicitudesAdministradores1.link_respaldo="";
                solicitudesAdministradores1.inmueble=inmueble.id;
                solicitudesAdministradores1.usuario_solicitante=id;
                await solicitudesAdministradores1.save();
        */
                await secuencia.save();
                await inmueble.save();
                await inmuebleImagenes.save();
               // pubsub.publish(INMUEBLE_ADDED,{inmuebleAdded: inmueble});
                //await inmueble.save();
            }
            return "Se registraron los inmuebles";
        },
        
        /*registrarSolicitudAdministrador: async (_,{id_inmueble,id_usuario,input})=>{
            let solicitudesAdministradores=await SolicitudesAdministradores(input);
            solicitudesAdministradores.inmueble=id_inmueble;
            solicitudesAdministradores.usuario_solicitante=id_usuario;
            await solicitudesAdministradores.save();
        },*/
        registrarCuentaBanco: async (_,{input})=>{
            let cuentasBanco=new CuentasBanco(input);
            await cuentasBanco.save();
            return cuentasBanco;
        },
        registrarSolicitudAdministradorAgente: async(_,{input})=>{
            let administradorAgente=new AdministradorAgente(input);
            administradorAgente.save();
            return "Se registró correctamente";
        },
        registrarAgentePago: async(_,{input})=>{
            let agentePago=new AgentePago(input);
            var fecha=new Date();
            agentePago.fecha_solicitud=fecha;
            if(agentePago.medio_pago=="Tarjeta"){
                agentePago.fecha_inicio=fecha;
                agentePago.autorizacion="Aprobado";
                agentePago.fecha_respuesta=fecha;
                agentePago.respuesta_entregada=true;
                agentePago.activo=true;
            }
            await agentePago.save();
            let usuario=await Usuario.findById(agentePago.agente);
            
            usuario.agente_pagos.push(agentePago.id);
            await usuario.save();
            
            var id=agentePago.id;
            agentePago=await AgentePago.findById(id)
                .populate("cuenta_banco")
                .populate("agente")
                .populate("administrador");
            return agentePago;
        },
        responderAgentePago: async(_,{id,id_administrador,autorizacion,observaciones})=>{
            let agentePago=await AgentePago.findById(id);
            var fecha=new Date();
            console.log(fecha);
            if(agentePago.administrador==null){
                if(autorizacion=="Rechazado"){
                    agentePago.autorizacion="Rechazado";
                    agentePago.observaciones=observaciones;
                    agentePago.administrador=id_administrador;
                    agentePago.fecha_respuesta=fecha;
                }else{
                    agentePago.autorizacion=autorizacion;
                    agentePago.administrador=id_administrador;
                    agentePago.fecha_respuesta=fecha;
                    var fecha_inicio=Date.parse(agentePago.fecha_solicitud.toString());
                    var fechad=new Date(agentePago.fecha_solicitud);
                    console.log(fechad);
                    fechad.setDate(fechad.getDate()+2);
                    agentePago.fecha_inicio=fechad;
                }
            }else{
                throw new Error ('La petición ya fue respondida por otro administrador');
            }
            await agentePago.save();
            agentePago=await AgentePago.findById(id)
                .populate("cuenta_banco")
                .populate("agente")
                .populate("administrador");
            return agentePago;
        },
        registrarPlanesPagoAgente: async(_,{input})=>{
            let emailStatus="OK";
            let planesPagoAgente=new PlanesPagoAgente(input);
            planesPagoAgente.save();
            //try{
                let info = await transporter.sendMail({
                    from: '"Prueba envio email" <rhyno12091991@gmail.com>', // sender address
                    //to: "elzhar.80.iact@gmail.com", // list of receivers
                    to: "shirleyjhasminacruztrujillo@gmail.com", 
                    subject: "Probando app", // Subject line
                    text: "456878", // plain text body
                    html: "<b>45235</b>", // html body
                  });
                console.log(info);
            /*}catch(error){
                emailStatus=error;
                console.log(error);
            }*/
            return "Se registró correctamente";
        },
        registrarEmailClaveVerificaciones: async(_,{input,actividad})=>{
            let usuario=await Usuario.find({email:input.email});
            if(usuario){
                if(actividad=="Registrar"){
                    throw new Error("El email ya está registrado");
                }
            }else{
                if(actividad=="Recuperar"){
                    throw new Error("El email no está registrado");
                }
            }
            
            await EmailClaveVerificaciones.findOneAndDelete({email : input.email});
            let emailClaveVerificaciones=new EmailClaveVerificaciones(input);
            var fecha=new Date(emailClaveVerificaciones.fecha_creacion);
            fecha.setMinutes(fecha.getMinutes()+30);
            //console.log(emailClaveVerificaciones.fecha_creacion);
            //console.log(fecha);
            emailClaveVerificaciones.fecha_vencimiento=fecha;
            var clave=Math.floor(Math.random() * (999999  - 100000)) + 100000;
            emailClaveVerificaciones.clave=clave;
            await emailClaveVerificaciones.save();
            let info = await transporter.sendMail({
                from: '"Verificación de email" <rhyno12091991@gmail.com>', // sender address
                //to: "elzhar.80.iact@gmail.com", // list of receivers
                to: input.email, 
                subject: "InmobiliaAPP", // Subject line
                text: "456878", // plain text body
                html: "<b>Clave de verificación: "+clave+"</b>", // html body
            });
            console.log(info);
            return emailClaveVerificaciones;
        },
        obtenerEmailClaveVerificaciones: async(_,{email,clave})=>{
            var filter1={};
            filter1.email=email;
            filter1.clave=clave;
            let emailClaveVerificaciones=await EmailClaveVerificaciones.findOne(filter1);
            //console.log(email);
            if(emailClaveVerificaciones){
                let usuario=await Usuario.findOne({email:email});
                emailClaveVerificaciones.usuario=usuario;
            }
            return emailClaveVerificaciones;
        },
        registrarVersionesAPP: async(_,{input})=>{
            let versionesAPP=new VersionesAPP(input);
            versionesAPP.save();
            return "Se registró correctamente";     
        },
        crearZona: async(_,{input})=>{
            let zona=new Zona(input);
            zona.save();
            return zona;
        },
        modificarZona: async(_,{id,input})=>{
            let zona=await Zona.findById(id);
            zona.nombre_zona=input.nombre_zona;
            zona.ciudad=input.ciudad;
            zona.coordenadas=input.coordenadas;
            zona.save();
            console.log(zona.id);
            return zona;
        },
        eliminarZona: async(_,{id})=>{
            await Zona.findByIdAndDelete(id);
            return "Se eliminó la zona";
        },
        buscarUsuarioEmail: async(_,{email})=>{
            const usuario=await Usuario.findOne({email:email});
            if(!usuario){
                throw new Error("No se encontró al usuario");
            }
            return usuario;
        },
    }
}

module.exports=resolvers;
//module.exports = pubsub;