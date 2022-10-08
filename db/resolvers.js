
const Usuario = require('../module_usuario/models/usuario');
const Inmueble = require('../models/inmueble'); 
const InmuebleImagenes = require('../models/inmuebleImagenes'); 
const Agencia = require('../models/agencia');

const jwt = require('jsonwebtoken');
const InmuebleFavorito = require('../models/inmuebleFavorito'); 
const UsuarioInmuebleBase = require('../module_usuario/models/usuarioInmuebleBase');
const SecuenciasIndices = require('../models/secuenciasIndices');
const SolicitudesUsuarios=require('../models/solicitudesUsuarios');
const SolicitudesAdministradores=require('../models/solicitudesAdministradores');
const AdministradorImmueble=require('../models/administradorInmueble');
const CuentasBanco=require('../models/cuentasBanco');
const AdministradorAgente=require('../models/administradorAgente');
const Zona=require('../module_generales/models/zona');
const InmuebleComprobante = require('../models/inmuebleComprobante'); 
const InmuebleReportado = require('../models/inmuebleReportado'); 
const PlanesPagoPublicacion = require('../module_generales/models/planesPagoPublicacion'); 
const InmuebleDarBaja = require('../models/inmuebleDarBaja');
const InmuebleVendido = require('../models/inmuebleVendido');
const InmuebleQueja=require('../module_inmueble/models/inmuebleQueja');
const Publicidad=require('../module_generales/models/publicidad');
const InmuebleNota=require('../models/inmuebleNota');
const administradorInmueble = require('../models/administradorInmueble');
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
        obtenerUsuarios: async(_,{})=>{
            const usuarios=await Usuario.find();
            //console.log()
            return usuarios;
        },
        obtenerUsuarioEmail: async(_,{email})=>{
            const usuario=await Usuario.findOne({email:email});
            usuario.abc="dadasd";
            //console.log("usuario", input.usuario);
            return usuario;
        },
        obtenerAgencias: async(_,{})=>{
            const agencias=await Agencia.find();
            //console.log()
            return agencias;
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
            var resultado={};
            if(input1.ciudad!="Todos") filter1.ciudad={$in:input1.ciudad};
            
            //if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            filter1.autorizacion={$in:"Activo"};
            const inmuebles=Inmueble.find(filter1);
            /*filter1={
                $or:[
                    {
                        categoria:{$in:"Gratuito"},ultima_modificacion:{ $gt: new Date('2022-10-05') }
                    },
                    {
                        categoria:{$nin:"Gratuito"}
                    }
                ]
            };
            await inmuebles.find(filter1);*/
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
            resultado.inmuebles=inmuebles;
            filter1={};
            filter1.ciudad=input1.ciudad;
            resultado.publicidades=await Publicidad.find(filter1);
            //const cantidad=await inmuebles.find({}).countDocuments();
            //console.log(cantidad);
            return resultado;
        },
        obtenerInmueblesEntreFechas: async (_,{id_usuario,ciudad,fecha_inicial,fecha_final})=>{
            var filter1={};
            var resultado={};
            filter1.ciudad={$in:ciudad};
            filter1.fecha_publicacion={$gte:fecha_inicial,$lte:fecha_final};
            const inmuebles=Inmueble.find(filter1);
            let filter2={};
            filter2.usuario={$in:""};
            if(id_usuario!=""){
                await inmuebles.find({}).populate("creador",{})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{"usuario":id_usuario},
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
            filter1.creador={$in:id};
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
            .populate({path:"comprobante",
                populate:{path:"cuenta_banco"}
            })
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
            filter1.usuario_respondedor={$in:[null,id]};
            let administradorImmueble= AdministradorImmueble.find(filter1).sort({fecha_solicitud:1});
                await administradorImmueble.find({}).populate({
                    path:"inmueble",populate:{path:"creador"}}).
                    populate({
                        path: "inmueble",populate:{path:"imagenes"}
                    })
                    .populate({
                        path: "inmueble",populate:{path:"cuenta_banco"}    
                    })
                    .populate({
                        path:"inmueble",populate:{path:"propietario"}
                    })
                    .populate({path:"usuario_solicitante"})
                    .populate({path:"usuario_respondedor"})
                    .populate({path:"super_usuario"});
            
            return administradorImmueble;
        },
        obtenerAdministradorInmuebleSuperUsuario: async (_,{id})=>{
            var filter1={};
            filter1.solicitud_terminada={$in:true};
            filter1.super_usuario={$in:[null,id]};
            filter1.respuesta="Confirmado";
            filter1.solicitud_terminada_super_usuario={$in:false};
            let administradorImmueble= AdministradorImmueble.find(filter1).sort({fecha_solicitud:1});
                await administradorImmueble.find({}).populate({
                    path:"inmueble",populate:{path:"creador"}}).
                    populate({
                        path: "inmueble",populate:{path:"imagenes"}
                    })
                    .populate({
                        path: "inmueble",populate:{path:"cuenta_banco"}    
                    })
                    .populate({
                        path:"inmueble",populate:{path:"propietario"}
                    })
                    .populate({path:"usuario_solicitante"})
                    .populate({path:"usuario_respondedor"})
                    .populate({path:"super_usuario"});
            
            return administradorImmueble;
        },
        obtenerInmueblesSuperUsuario: async (_,{ciudad,tipo_contrato})=>{
            var filter1={};
            //filter1.ciudad=ciudad;
            //filter1.tipo_contrato=tipo_contrato;
            //filter1.solicitud_terminada={$in:false};
            //filter1.usuario_respondedor={$in:[null,id]};
            //var fecha=new Date();
            //fecha.setDate(fecha.getDate()-3);
            var fecha="10-10-2021";
            filter1.fecha_solicitud={$gte:fecha};
            let administradorImmueble=AdministradorImmueble.find(filter1).sort({fecha_solicitud:1});
                await administradorImmueble.find({}).populate({
                    path:"inmueble",populate:{path:"creador"}}).
                    populate({
                        path: "inmueble",populate:{path:"imagenes"}
                    })
                    .populate({
                        path: "inmueble",populate:{path:"cuenta_banco"}    
                    })
                    .populate({
                        path:"inmueble",populate:{path:"propietario"}
                    })
                    .populate({path:"usuario_solicitante"})
                    .populate({path:"usuario_respondedor"});
            
            return administradorImmueble;
        },
        obtenerSolicitudesAdministradores: async (_,{id})=>{
            var filter1={};
            filter1.administrador_inmueble=id;
            //filter1.solicitud_terminada={$in:false};
            const solicitudesAdministradores= SolicitudesAdministradores.find(filter1).sort({fecha_solicitud:1})
            .populate({
                path:"comprobante",
                populate:{path:"usuario_comprador"}
            })
            .populate({
                path:"comprobante",
                populate:{path:"cuenta_banco"}
            })
            .populate({
                path:"comprobante",
                populate:{path:"plan"}
            });
            
            return solicitudesAdministradores;
        },
        obtenerSolicitudesAdministradoresSuperUsuario: async (_,{id})=>{
            var filter1={};
            filter1.administrador_inmueble=id;
            filter1.respuesta="Confirmado";
            filter1.solicitud_terminada={$in:true};
            const solicitudesAdministradores= await SolicitudesAdministradores.find(filter1).sort({fecha_solicitud:1})
            .populate({
                path:"comprobante",
                populate:({path:"usuario_comprador"})
            })
            .populate({
                path:"comprobante",
                populate:({path:"cuenta_banco"})
            })
            .populate({
                path:"comprobante",
                populate:{path:"plan"}
            });
            
            return solicitudesAdministradores;
        },
        obtenerSolicitudesAdministradoresUsuario: async (_,{id})=>{
            var filter1={};
            filter1.inmueble=id;
            const administradorInmueble=administradorInmueble.findOne(filter1);
            filter1.inmue={$in:false};
            let administradorImmueble= AdministradorImmueble.find(filter1).sort({fecha_solicitud:1});
                await administradorImmueble.find({}).populate({
                    path:"inmueble",populate:{path:"creador"}}).
                    populate({
                        path: "inmueble",populate:{path:"imagenes"}
                    })
                    .populate({
                        path: "inmueble",populate:{path:"cuenta_banco"}    
                    })
                    .populate({
                        path:"inmueble",populate:{path:"propietario"}
                    })
                    .populate({path:"usuario_solicitante"})
                    .populate({path:"usuario_respondedor"})
                    .populate({path:"super_usuario"});
            
            return administradorImmueble;
        },
        obtenerSolicitudesUsuarios: async (_,{id})=>{
            var filter1={};
            filter1.usuario_respondedor=id;
            filter1.solicitud_terminada={$in:false};
            filter1.solicitud_enviada={$in:true};
            let solicitudesUsuarios= SolicitudesUsuarios.find(filter1).sort({fecha_solicitud:1});
            await solicitudesUsuarios.find({}).populate({
                path:"inmueble",populate:({path:"imagenes"})})
                .populate({path:"inmueble",populate:({path:"creador"})})
                .populate({path:"inmueble",populate:({path:"propietario"})})
                .populate({path:"usuario_solicitante"})
                .populate({path:"usuario_respondedor"});
            return solicitudesUsuarios;
        },
        obtenerCuentasBancos: async(_,{})=>{
            let cuentasBanco=CuentasBanco.find({});
            return cuentasBanco;
        },
        
        obtenerPlanesPagoAgente: async(_)=>{
            var filter1={};
            filter1.activo=true;
            let planesPagoAgente=PlanesPagoAgente.find(filter1).sort({plan:1});
            return planesPagoAgente;
        },
        
        autenticarUsuarioAutomatico: async (_,{email,imei}) => {
            let usuario;
            var fecha=new Date();
            if(email!=""){
                var filter1={};
                var mes=fecha.getMonth();
                filter1.mes={$gte:mes};
                //fecha.setDate(fecha.getDate()-3);
                usuario=await Usuario.findOne({email:email});
                usuario.fecha_penultimo_ingreso=usuario.fecha_ultimo_ingreso;
                usuario.fecha_ultimo_ingreso=fecha;
                await usuario.save();
                await Usuario.findOneAndUpdate({email:email},{fecha_ultimo_ingreso:fecha})
                usuario=await Usuario.findOne({email:email})
                .populate("usuario_inmueble_base")
                .populate({path:"membresia_pagos",
                populate:{path:"cuenta_banco"}})
                .populate({path:"membresia_pagos",
                populate:{path:"usuario"}})
                .populate({path:"membresia_pagos",
                populate:{path:"membresia_planes_pago"}})
                .populate({path:"membresia_pagos",
                populate:{path:"administrador"}});
                return usuario;
            }else if(imei!=""){
                const existeUsuario = await Usuario.findOne({ imei_telefono:imei });
                if(!existeUsuario){
                    const nuevoUsuario = new Usuario();
                    nuevoUsuario.fecha_penultimo_ingreso=nuevoUsuario.fecha_ultimo_ingreso;
                    nuevoUsuario.fecha_ultimo_ingreso=fecha;
                    nuevoUsuario.imei_telefono=imei;
                    nuevoUsuario.tipo_usuario="Común";
                    nuevoUsuario.medio_registro="Defecto";
                    await nuevoUsuario.save();
                }
                existeUsuario.fecha_penultimo_ingreso=existeUsuario.fecha_ultimo_ingreso;
                existeUsuario.fecha_ultimo_ingreso=fecha;
                await existeUsuario.save();
                usuario=await Usuario.findOne({imei_telefono:imei})
                    .populate("usuario_inmueble_base")
                    .populate({path:"membresia_pagos",
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"membresia_pagos",
                    populate:{path:"agente"}})
                    .populate({path:"membresia_pagos",
                    populate:{path:"administrador"}});
                return usuario;
            }else{
                usuario=await Usuario.findOne({email:""})
                .populate("usuario_inmueble_base")
                .populate({path:"membresia_pagos",
                populate:{path:"cuenta_banco"}})
                .populate({path:"membresia_pagos",
                populate:{path:"agente"}})
                .populate({path:"membresia_pagos",
                populate:{path:"administrador"}});
                return usuario;
            }
        },
        
        obtener: async(_)=>{
            let registroAds=await RegistroAds.find({});
            return registroAds;     
        },
        obtenerReportesInmueble: async(_,{id_usuario,id_inmueble,estado_1,estado_2})=> {
            var filter1={};
            let administradorInmueble=await AdministradorImmueble.findOne({inmueble:id_inmueble});
            filter1.usuario_solicitante=id_usuario;
            if(estado_1==estado_2){
                filter1.solicitud_terminada=estado_1;
            }
            filter1.administrador_inmueble=administradorInmueble.id;
            let solicitudes=await SolicitudesAdministradores.find(filter1);
            return solicitudes;
        },
        buscarInmuebleNota: async(_,{id_inmueble,id_usuario})=>{
            var filtro={};
            filtro.inmueble=id_inmueble;
            filtro.usuario=id_usuario;
            return await InmuebleNota.findOne(filtro);
        }
    },

    /*Subscription: {
        inmuebleAdded: {
            subscribe: () => pubsub.asyncIterator([INMUEBLE_ADDED]),
        }
    },*/
    Mutation: {
       eliminarInmueblesTodos: async(_,{},ctx)=>{
        await Inmueble.remove();
        await InmuebleImagenes.remove();
        await AdministradorImmueble.remove();
        await SolicitudesAdministradores.remove();
        await InmuebleComprobante.remove();
        return "Eliminado";
       },
        RegistrarAd: async (_,{id_ad,tipo_ad})=>{
            try{
                const registroAds = RegistroAds();
                registroAds.id_ad=id_ad;
                registroAds.tipo_ad=tipo_ad;
                await registroAds.save();
                return registroAds;
            }catch(error){
                console.log(error);
            }
        },
        EliminarAd: async (_,{id})=>{
            try{
                await RegistroAds.findOneAndDelete({id_ad:id});
                return "Se eliminó el AD";
            }catch(error){
                console.log(error);
            }
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
        guardarInmuebleNota: async(_,{id_inmueble,id_usuario,nota})=>{
            var filtro={};
            filtro.inmueble=id_inmueble;
            filtro.usuario=id_usuario;
            var fecha=new Date();
            let inmuebleNota=await InmuebleNota.findOne(filtro);
            if(!inmuebleNota){
                const nuevoInmuebleNota=InmuebleNota();
                nuevoInmuebleNota.inmueble=id_inmueble;
                nuevoInmuebleNota.usuario=id_usuario;
                nuevoInmuebleNota.nota=nota;
                nuevoInmuebleNota.fecha=fecha;
                await nuevoInmuebleNota.save();
                return nuevoInmuebleNota;
            }else{
                inmuebleNota.nota=nota;
                inmuebleNota.fecha=fecha;
                await inmuebleNota.save();
            }
            return inmuebleNota;
        },
        registrarInmueble: async (_,{id_creador,id_propietario,input1,input2,input3}) => {
            try{
                let secuencia=await SecuenciasIndices.findOne();
                if(!secuencia){
                    secuencia=SecuenciasIndices();
                    secuencia.indice_inmuebles=1;
                    await secuencia.save();
                }
                const nuevoInmueble = new Inmueble(input1);
                nuevoInmueble.creador=id_creador;
                nuevoInmueble.propietario=id_propietario;
                nuevoInmueble.indice=secuencia.indice_inmuebles;
                nuevoInmueble.historial_precios.push(nuevoInmueble.precio);
                const inmuebleImagenes=new InmuebleImagenes(input2);
                inmuebleImagenes.inmueble=nuevoInmueble.id;
                nuevoInmueble.imagenes=inmuebleImagenes.id;
                //Si registra el comprobante si es que tiene
                //if(input3.link_imagen_deposito!=""){
                const inmuebleComprobante=InmuebleComprobante();
                inmuebleComprobante.tipo_comprobante="Publicar";
                inmuebleComprobante.link_imagen_deposito=input3.link_imagen_deposito;
                inmuebleComprobante.nombre_depositante=input3.nombre_depositante;
                inmuebleComprobante.medio_pago=input3.medio_pago;
                inmuebleComprobante.monto_pago=input3.monto_pago;
                inmuebleComprobante.nombre_plan=input3.nombre_plan;
                if(input3.cuenta_banco!=""){
                    inmuebleComprobante.cuenta_banco=input3.cuenta_banco;
                }
                inmuebleComprobante.numero_transaccion=input3.numero_transaccion;
                inmuebleComprobante.link_imagen_documento_propiedad=input3.link_imagen_documento_propiedad;
                inmuebleComprobante.link_imagen_documento_venta=input3.link_imagen_documento_venta;
                inmuebleComprobante.link_imagen_dni_propietario=input3.link_imagen_dni_propietario;
                inmuebleComprobante.link_imagen_dni_agente=input3.link_imagen_dni_agente;
                inmuebleComprobante.inmueble=nuevoInmueble.id;
                await inmuebleComprobante.save();
                //Se crea un registro para el que administrá el inmueble
                let administradorInmueble=await AdministradorImmueble();
                administradorInmueble.tipo_solicitud="Publicar";
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo_solicitud="";
                administradorInmueble.link_respaldo_respuesta="";
                administradorInmueble.inmueble=nuevoInmueble.id;
                administradorInmueble.usuario_solicitante=id_creador;
                await administradorInmueble.save();
                //Se crea la solicitud al administrador para dar de alta el inmueble creado
                let solicitudesAdministradores=await SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Publicar";
                solicitudesAdministradores.fecha_solicitud=administradorInmueble.fecha_solicitud;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo_solicitud="";
                solicitudesAdministradores.link_respaldo_respuesta="";
                solicitudesAdministradores.usuario_solicitante=id_creador;
                solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                await solicitudesAdministradores.save();
                await nuevoInmueble.save();
                await inmuebleImagenes.save();
                secuencia.indice_inmuebles=secuencia.indice_inmuebles+1;
                await secuencia.save();
                let resultado=await Inmueble.findById(nuevoInmueble.id)
                .populate("creador",{})
                .populate({path:"propietario"})
                .populate({path:"imagenes"})
                .populate({
                    path:"usuarios_favorito",match:{"usuario":nuevoInmueble.creador},
                    populate:{path:"usuario"}});
                return resultado;
            }catch(error){
                console.log(error);
            }
        },
        actualizarPrecioInmueble: async(_,{id,precio,input3})=>{
            let inmueble=await Inmueble.findById(id);
            if(!inmueble){
                throw new Error('Inmueble no encontrada');
            }
            let crearSolicitud=false;
            if(input3.tipo_comprobante!=""){
                crearSolicitud=true;
            }
            if(inmueble.historial_precios.length>1){
                crearSolicitud=true;
            }else if(inmueble.precio*0.1<(inmueble.precio-precio)){
                crearSolicitud=true;
            }
            var fecha=new Date();
            if(crearSolicitud){
                let administradorInmueble=await AdministradorImmueble.findOne({"inmueble":id});
                let solicitudesAdministradores=SolicitudesAdministradores();
                if(input3.tipo_comprobante=="Actualizar"){
                    const inmuebleComprobante=InmuebleComprobante();
                    inmuebleComprobante.tipo_comprobante=input3.tipo_comprobante;
                    inmuebleComprobante.link_imagen_deposito=input3.link_imagen_deposito;
                    inmuebleComprobante.nombre_depositante=input3.nombre_depositante;
                    inmuebleComprobante.medio_pago=input3.medio_pago;
                    inmuebleComprobante.monto_pago=input3.monto_pago;
                    if(input3.cuenta_banco!=""){
                        inmuebleComprobante.cuenta_banco=input3.cuenta_banco;
                    }
                    inmuebleComprobante.numero_transaccion=input3.numero_transaccion;
                    inmuebleComprobante.link_imagen_documento_propiedad=input3.link_imagen_documento_propiedad;
                    inmuebleComprobante.link_imagen_documento_venta=input3.link_imagen_documento_venta;
                    inmuebleComprobante.link_imagen_dni_propietario=input3.link_imagen_dni_propietario;
                    inmuebleComprobante.link_imagen_dni_agente=input3.link_imagen_dni_agente;
                    inmuebleComprobante.plan=input3.plan;
                    inmuebleComprobante.inmueble=inmueble.id;
                    inmuebleComprobante.solicitud=solicitudesAdministradores.id;
                    solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                    
                    await inmuebleComprobante.save();
                }
                administradorInmueble.tipo_solicitud="Bajar precio";
                administradorInmueble.fecha_solicitud=fecha;
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.solicitud_terminada=false;
                administradorInmueble.respuesta_super_usuario="";
                administradorInmueble.observaciones_super_usuario="";
                administradorInmueble.solicitud_terminada_super_usuario=false;
                
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud=administradorInmueble.tipo_solicitud;
                solicitudesAdministradores.fecha_solicitud=fecha;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo_solicitud="";
                solicitudesAdministradores.link_respaldo_respuesta="";
                inmueble.autorizacion="Pendiente - Bajar precio";
                await solicitudesAdministradores.save();
                await administradorInmueble.save();
                
            }else{
                inmueble.contador_modificacion=inmueble.contador_modificacion+1;
            }
            inmueble.precio=precio;
            inmueble.historial_precios.push(precio);
            await inmueble.save();
            return "Se guardaron los cambios";
        },

        actualizarInmueble: async(_,{id,input1,input2,input3})=>{
            let inmueble=await Inmueble.findById(id);
            let administradorInmueble=await AdministradorImmueble.findOne({"inmueble":id});
            if(!inmueble){
                throw new Error('Inmueble no encontrada');
            }
            
            var fecha=new Date();
            if(!inmueble.fecha_publicacion){
                administradorInmueble.tipo_solicitud="Publicar";
            }else{
                administradorInmueble.tipo_solicitud="Actualizar"; 
            }
            let solicitudesAdministradores=SolicitudesAdministradores();
            if(input3.tipo_comprobante=="Publicar"||input3.tipo_comprobante=="Actualizar"){
                const inmuebleComprobante=InmuebleComprobante();
                inmuebleComprobante.tipo_comprobante=input3.tipo_comprobante;
                inmuebleComprobante.link_imagen_deposito=input3.link_imagen_deposito;
                inmuebleComprobante.nombre_depositante=input3.nombre_depositante;
                inmuebleComprobante.medio_pago=input3.medio_pago;
                inmuebleComprobante.monto_pago=input3.monto_pago;
                inmuebleComprobante.plan=input3.plan;
                if(input3.cuenta_banco!=""){
                    inmuebleComprobante.cuenta_banco=input3.cuenta_banco;
                }
                inmuebleComprobante.numero_transaccion=input3.numero_transaccion;
                inmuebleComprobante.link_imagen_documento_propiedad=input3.link_imagen_documento_propiedad;
                inmuebleComprobante.link_imagen_documento_venta=input3.link_imagen_documento_venta;
                inmuebleComprobante.link_imagen_dni_propietario=input3.link_imagen_dni_propietario;
                inmuebleComprobante.link_imagen_dni_agente=input3.link_imagen_dni_agente;
                inmuebleComprobante.inmueble=inmueble.id;
                solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                inmuebleComprobante.solicitud=solicitudesAdministradores.id;
                await inmuebleComprobante.save();
            }
            administradorInmueble.fecha_solicitud=fecha;
            administradorInmueble.respuesta="";
            administradorInmueble.observaciones="";
            administradorInmueble.solicitud_terminada=false;
            administradorInmueble.respuesta_super_usuario="";
            administradorInmueble.observaciones_super_usuario="";
            administradorInmueble.solicitud_terminada_super_usuario=false;
            
            solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
            solicitudesAdministradores.tipo_solicitud=administradorInmueble.tipo_solicitud;
            solicitudesAdministradores.fecha_solicitud=fecha;
            solicitudesAdministradores.respuesta="";
            solicitudesAdministradores.observaciones="";
            solicitudesAdministradores.link_respaldo_solicitud="";
            solicitudesAdministradores.link_respaldo_respuesta="";
            await Inmueble.findOneAndUpdate({_id:id},input1);
            await InmuebleImagenes.findOneAndUpdate({inmueble:id},input2);
            await solicitudesAdministradores.save();
            await administradorInmueble.save();
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
        registrarInmuebleFavorito: async (_,{id_inmueble,id_usuario,input1}) => {
            console.log(id_usuario);
            try{
                let inmuebleFavorito=await InmuebleFavorito.findOne({"inmueble":id_inmueble,"usuario":id_usuario});
                let usuarioInmuebleBase=await UsuarioInmuebleBase.findOne({"usuario":id_usuario});
                let base_visto=await UsuarioInmuebleBase.findOne({"usuario":id_usuario,"tipo":"visto"});
                let base_doble_visto=await UsuarioInmuebleBase.findOne({"usuario":id_usuario,"tipo":"doble_visto"});
                let base_favorito=await UsuarioInmuebleBase.findOne({"usuario":id_usuario,"tipo":"favorito"});
                var fecha=new Date();
                let inmueble=await Inmueble.findById(id_inmueble);
                
                if(inmuebleFavorito){
                    if(inmuebleFavorito.favorito&&(!input1.favorito)){
                        //console.log("de favorito a no favorito");
                        if(inmueble.cantidad_favoritos>0){
                            inmueble.cantidad_favoritos=inmueble.cantidad_favoritos-1;
                            if(inmueble.cantidad_favoritos<0){
                                inmueble.cantidad_favoritos=0;
                            }
                        }
                        
                    }else if((!inmuebleFavorito.favorito)&&input1.favorito){
                        //console.log("de no favorito a favorito");
                        inmueble.cantidad_favoritos=inmueble.cantidad_favoritos+1;
                    }
                    if((!inmuebleFavorito.doble_visto)&&input1.doble_visto){
                        inmueble.cantidad_doble_vistos=inmueble.cantidad_doble_vistos+1;
                    }
                    await InmuebleFavorito.findOneAndUpdate({_id:inmuebleFavorito.id},input1);
                    await inmueble.save();
                }else{
                    inmuebleFavorito=new InmuebleFavorito(input1);
                    inmuebleFavorito.inmueble = id_inmueble;
                    inmuebleFavorito.usuario = id_usuario;
                    await inmuebleFavorito.save();
                    if(inmuebleFavorito.visto){
                        inmueble.cantidad_vistos=inmueble.cantidad_vistos+1;
                    }
                    if(inmuebleFavorito.doble_visto){
                        inmueble.cantidad_doble_vistos=inmueble.cantidad_doble_vistos+1;
                    }
                    if(inmuebleFavorito.favorito){
                        inmueble.cantidad_favoritos=inmueble.cantidad_favoritos+1;
                    }
                    inmueble.usuarios_favorito.push(inmuebleFavorito);
                    await inmueble.save();
                    
                }
                let usuario=await Usuario.findById(id_usuario);
                if(base_visto){
                    await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"visto"},{fecha_cache:fecha});
                }else{
                    usuarioInmuebleBase=new UsuarioInmuebleBase();
                    usuarioInmuebleBase.usuario=id_usuario;
                    usuarioInmuebleBase.fecha_inicio=Date.now();
                    usuario.usuario_inmueble_base.push(usuarioInmuebleBase.id);
                    usuarioInmuebleBase.tipo="visto";
                    await usuarioInmuebleBase.save();
                }
                if(base_doble_visto){
                    await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"doble_visto"},{fecha_cache:fecha});
                }else{
                    usuarioInmuebleBase=new UsuarioInmuebleBase();
                    usuarioInmuebleBase.usuario=id_usuario;
                    usuarioInmuebleBase.fecha_inicio=Date.now();
                    usuario.usuario_inmueble_base.push(usuarioInmuebleBase.id);
                    usuarioInmuebleBase.tipo="doble_visto";
                    await usuarioInmuebleBase.save();
                }
                if(base_favorito){
                    await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"favorito"},{fecha_cache:fecha});
                }else{
                    usuarioInmuebleBase=new UsuarioInmuebleBase();
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
        actualizarInmuebleBase: async(_,{id_usuario,input_visto,input_doble_visto,input_favorito})=>{
            var fecha=new Date();

            await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"visto"},input_visto,{fecha_cache:fecha,fecha_ultimo_guardado:fecha});
            await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"doble_visto"},input_doble_visto,{fecha_cache:fecha,fecha_ultimo_guardado:fecha});
            await UsuarioInmuebleBase.findOneAndUpdate({usuario:id_usuario,tipo:"favorito"},input_favorito,{fecha_cache:fecha,fecha_ultimo_guardado:fecha})
            return "Se actualizó el inmueble base";
        },
        actualizarFechaInmuebleBase: async(_,{id,fecha})=>{
            //await UsuarioInmuebleBase.findOneAndUpdate({_id:id},{fecha_inicio:fecha});
           var fec=new Date();
           var ff=fec.getDate();
           console.log(ff);
            return fec.toISOString();
        },
        modificarEstadoInmuebleVendedor: async (_,{id_inmueble,tipo_accion,input})=>{
            console.log(id_inmueble);
            let administradorInmueble=await AdministradorImmueble.findOne({inmueble:id_inmueble});
            let usuario=await Usuario.findById(administradorInmueble.usuario_solicitante);
            
            let inmueble=await Inmueble.findById(id_inmueble);
            var fecha=new Date();
            if(tipo_accion=="Dar alta"){
                inmueble.autorizacion="Pendiente - Dar alta";
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
            }else if(tipo_accion=="Dar baja"){
                inmueble.autorizacion="Inactivo";
                inmueble.ultima_modificacion=fecha;
                inmueble.calificacion=1;
                await inmueble.save();
                usuario.sumatoria_calificacion=usuario.sumatoria_calificacion+1;
                usuario.cantidad_calificados=usuario.cantidad_calificados+1;
                await usuario.save();
            }else if(tipo_accion=="Dar baja y reportar"){
                inmueble.autorizacion="Pendiente - Dar baja";
                await inmueble.save();
                let inmuebleComprobante=InmuebleComprobante();
                inmuebleComprobante.tipo_comprobante="Dar baja";
                inmuebleComprobante.limite_contrato=input.limite_contrato;
                inmuebleComprobante.cancelacion_contrato=input.cancelacion_contrato;
                inmuebleComprobante.link_imagen_documento_propiedad=input.link_imagen_documento_propiedad;
                inmuebleComprobante.inmueble=inmueble.id;
                let solicitudesAdministradores=SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Dar baja";
                solicitudesAdministradores.fecha_solicitud=fecha;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo="";
                solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                inmuebleComprobante.solicitud=solicitudesAdministradores.id;
                await inmuebleComprobante.save();
                await solicitudesAdministradores.save();
                administradorInmueble.tipo_solicitud="Dar baja";
                administradorInmueble.fecha_solicitud=fecha;
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo="";
                administradorInmueble.solicitud_terminada=false;
                administradorInmueble.respuesta_entregada=false;
                await administradorInmueble.save();
            }else if(tipo_accion=="Vendido"){
                inmueble.estado_negociacion="Vendido";
                inmueble.ultima_modificacion=fecha;
                inmueble.calificacion=1;
                await inmueble.save();
                usuario.sumatoria_calificacion=usuario.sumatoria_calificacion+1;
                usuario.cantidad_calificados=usuario.cantidad_calificados+1;
                await usuario.save();
            }else if(tipo_accion=="Vendido y reportar"){
                inmueble.estado_negociacion="Pendiente - Vendido";
                inmueble.ultima_modificacion=fecha;
                await inmueble.save();
                let inmuebleComprobante=InmuebleComprobante();
                inmuebleComprobante.tipo_comprobante="Vendido";
                inmuebleComprobante.usuario_comprador=input.usuario_comprador;
                inmuebleComprobante.numero_testimonio=input.numero_testimonio;
                inmuebleComprobante.inmueble=inmueble.id;
                let solicitudesAdministradores=SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Vendido";
                solicitudesAdministradores.fecha_solicitud=fecha;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo="";
                solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                inmuebleComprobante.solicitud=solicitudesAdministradores.id;
                await inmuebleComprobante.save();
                await solicitudesAdministradores.save();
                administradorInmueble.tipo_solicitud="Vendido";
                administradorInmueble.fecha_solicitud=fecha;
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo="";
                administradorInmueble.solicitud_terminada=false;
                administradorInmueble.respuesta_entregada=false;
                await administradorInmueble.save();
            }
            return "Correcto";
        },
        reportarInmueble: async(_,{id_inmueble,id_solicitante,input})=>{      
            let administradorInmueble=await AdministradorImmueble.findOne({inmueble:id_inmueble});
            var fecha=new Date();
            let inmuebleReportado=new InmuebleReportado(input);
            inmuebleReportado.inmueble=id_inmueble;
            inmuebleReportado.usuario_solicitante=id_solicitante;
            inmuebleReportado.usuario_respondedor=administradorInmueble.super_usuario;
            inmuebleReportado.fecha_solicitud=fecha;
            await inmuebleReportado.save();
            return inmuebleReportado;
        },
        
        registrarInmuebleQueja: async(_,{id_inmueble,input})=>{
            let administradorInmueble=await AdministradorImmueble.findOne({inmueble:id_inmueble});
            var fecha=new Date();
            let inmuebleQueja=new InmuebleQueja(input);
            inmuebleQueja.inmueble=id_inmueble;
            console.log(administradorInmueble.super_usuario);
            inmuebleQueja.usuario_respondedor=administradorInmueble.super_usuario;
            inmuebleQueja.fecha_solicitud=fecha;
            await inmuebleQueja.save();
            return inmuebleQueja;
        },
        responderSolicitudAdministrador: async (_,{id,id_respondedor,id_solicitud,input})=>{
            let administradorInmueble=await AdministradorImmueble.findOne({_id:id});
            
            var fecha=new Date();
            if(input.tipo_solicitud=="Publicar"){
                console.log(id);
                console.log(administradorInmueble);
                console.log(id_respondedor);
                if(administradorInmueble.usuario_respondedor==null||administradorInmueble.usuario_respondedor==id_respondedor){
                    console.log(id_respondedor);
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
            if(input.respuesta=="Confirmado"){
                solicitudesAdministradores.fecha_solicitud_super_usuario=fecha;
            }   
            await solicitudesAdministradores.save();
            let inmueble=await Inmueble.findById(administradorInmueble.inmueble);
           // para verificar si la solicitud es la ultima solicitud
            if(administradorInmueble.tipo_solicitud==solicitudesAdministradores.tipo_solicitud && 
                administradorInmueble.fecha_solicitud.getDate()==solicitudesAdministradores.fecha_solicitud.getDate()){
                administradorInmueble.usuario_respondedor=id_respondedor;
                administradorInmueble.fecha_respuesta=fecha;
                administradorInmueble.respuesta=input.respuesta;
                administradorInmueble.observaciones=input.observaciones;
                administradorInmueble.link_respaldo=input.link_respaldo;
                administradorInmueble.solicitud_terminada=input.solicitud_terminada;
                
                if(input.respuesta=="Confirmado"){
                    administradorInmueble.fecha_solicitud_super_usuario=fecha;
                    administradorInmueble.solicitud_terminada_super_usuario=false;
                    administradorInmueble.respuesta_super_usuario="";
                    administradorInmueble.observaciones_super_usuario="";
                }
                await administradorInmueble.save();
                if(input.tipo_solicitud=="Publicar"){
                    if(input.respuesta=="Rechazado"){
                        inmueble.autorizacion="Pendiente - Corregir datos";
                        await inmueble.save();
                    }else if(input.respuesta=="Bloqueado"){
                        inmueble.autorizacion="Bloqueado";
                        await inmueble.save();
                    }else if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Pendiente - Publicar";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Dar alta"){
                    if(input.respuesta=="Rechazado"){
                        inmueble.autorizacion="Inactivo";
                        await inmueble.save();
                    }else if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Pendiente - Dar alta";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Dar baja"){
                    if(input.respuesta=="Rechazado"){
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }else if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Pendiente - Dar baja";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Actualizar"){
                    if(input.respuesta=="Rechazado"){
                        inmueble.autorizacion="Pendiente - Corregir datos";
                        await inmueble.save();
                    }else if(input.respuesta=="Bloqueado"){
                        inmueble.autorizacion="Bloqueado";
                        await inmueble.save();
                    }else if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Pendiente - Actualizar";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Bajar precio"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }else if(input.respuesta=="Rechazado"){
                        inmueble.historial_precios.pop();
                        inmueble.precio=inmueble.historial_precios[inmueble.historial_precios.length-1];
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Vendido"){
                    if(input.respuesta=="Rechazado"){
                        inmueble.estado_negociacion="Negociaciones avanzadas";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }else if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Pendiente - Declarar vendido";
                        await inmueble.save();
                    }
                }
            }else{
                throw new Error('Sólo puede responder la última solicitud');
            }
            return "Correcto";
            
        },

        solicitudComprobante: async (_,{id})=>{
            let comprobante=await InmuebleComprobante.findOne({solicitud:id});
            let plan=null;
            //console.log(comprobante);
            if(comprobante){
                console.log("hola");
                plan=await PlanesPagoPublicacion.findOne({_id:comprobante.plan});
                console.log(plan.nombre_plan);
                /*if(input.respuesta="Confirmado"){
                   // inmueble.modificaciones_permitidas=inmueble.modificaciones_permitidas+plan.modificaciones_permitidas;
                }*/
            }
            return "ok";
        },

        responderSolicitudAdministradorSuperUsuario: async (_,{id,id_super_usuario,id_solicitud,input})=>{
            let administradorInmueble=await AdministradorImmueble.findOne({_id:id});
            
            var fecha=new Date();
            console.log(input.tipo_solicitud);
            if(input.tipo_solicitud=="Publicar"){
                if(administradorInmueble.super_usuario==null||administradorInmueble.super_usuario==id_super_usuario){
                    administradorInmueble.super_usuario=id_super_usuario;
                    
                }else{
                    throw new Error('El inmueble está a cargo de otro super usuario');
                }
            }

            let solicitudesAdministradores=await SolicitudesAdministradores.findOne({_id:id_solicitud});
            solicitudesAdministradores.fecha_respuesta_super_usuario=fecha;
            solicitudesAdministradores.respuesta_super_usuario=input.respuesta;
            solicitudesAdministradores.observaciones_super_usuario=input.observaciones;
            solicitudesAdministradores.solicitud_terminada_super_usuario=input.solicitud_terminada;
            await solicitudesAdministradores.save();
            let inmueble=await Inmueble.findById(administradorInmueble.inmueble);
            if(administradorInmueble.tipo_solicitud==solicitudesAdministradores.tipo_solicitud && administradorInmueble.fecha_solicitud_super_usuario.getDate()==solicitudesAdministradores.fecha_solicitud_super_usuario.getDate()){
                administradorInmueble.fecha_respuesta_super_usuario=fecha;
                administradorInmueble.respuesta_super_usuario=input.respuesta;
                administradorInmueble.observaciones_super_usuario=input.observaciones;
                administradorInmueble.solicitud_terminada_super_usuario=input.solicitud_terminada;
                let comprobante=await InmuebleComprobante.findOne({solicitud:solicitudesAdministradores.id});
                let plan=null;
                if(comprobante){
                    plan=await PlanesPagoPublicacion.findOne({_id:comprobante.plan});
                    if(input.respuesta="Confirmado"){
                        inmueble.modificaciones_permitidas=inmueble.modificaciones_permitidas+plan.modificaciones_permitidas;
                    }
                }
                await administradorInmueble.save();
                if(input.tipo_solicitud=="Publicar"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.estado_negociacion="Sin negociar";
                        inmueble.fecha_publicacion=fecha;
                        inmueble.ultima_modificacion=fecha;
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }else if(input.respuesta=="Rechazado"){
                        inmueble.autorizacion="Pendiente - Corregir datos";
                        await inmueble.save();
                    }else{
                        inmueble.autorizacion="Bloqueado";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Dar alta"){
                    if(input.respuesta=="Confirmado"){
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
                }else if(input.tipo_solicitud=="Actualizar"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Activo";
                        inmueble.contador_modificacion=inmueble.contador_modificacion+1;
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }else if(input.respuesta=="Rechazado"){
                        inmueble.autorizacion="Pendiente - Corregir datos";
                        await inmueble.save();
                    }else{
                        inmueble.autorizacion="Bloqueado";
                        await inmueble.save();
                    }
                }else if(input.tipo_solicitud=="Bajar precio"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Activo";
                        inmueble.contador_modificacion=inmueble.contador_modificacion+1;
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }else if(input.respuesta=="Rechazado"){
                        inmueble.historial_precios.pop();
                        inmueble.precio=inmueble.historial_precios[inmueble.historial_precios.length-1];
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }
                } else if(input.tipo_solicitud=="Vendido"){
                    if(input.respuesta=="Confirmado"){
                        inmueble.autorizacion="Activo";
                        inmueble.estado_negociacion="Vendido";
                        inmueble.ultima_modificacion=fecha;
                        await inmueble.save();
                    }else{
                        inmueble.estado_negociacion="Negociaciones avanzadas";
                        inmueble.ultima_modificacion=fecha;
                        inmueble.autorizacion="Activo";
                        await inmueble.save();
                    }
                }else{
                    throw new Error('Sólo puede responder la última solicitud');
                }
            }
            return "Correcto";
            
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
            usuario.cantidad_calificados=usuario.cantidad_calificados+1;
            await usuario.save();
            return "Se registró la calificacion";
        },
        registrarInmuebleMasivo: async (_,{id_creador,id_propietario})=>{
            var min=55;
            var max=55;
            var longitud=-65.22562;
            var latitud=-18.98654;
            let link_comprobante="https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.appinmobiliaria.inmobiliariaapp%2Fcache%2Fimage_picker1423340141.jpg?alt=media&token=7d0e0f6c-1b28-4ee6-951a-fa5ece767d64";
                
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
            let ciudades=["Sucre"];
            //let ciudades=["La Paz","Oruro","Potosí","Cochabamba","Tarija","Sucre","Santa Cruz","Trinidad"];
            //let ciudades=["Sucre"];
            let zona=["Zona 3"];
            let tipo_inmueble=["Casa","Departamento","Terreno"];
            //let tipo_inmueble=["Casa"];
            let tipo_contrato=["Venta","Alquiler","Anticrético"];
            //let tipo_contrato=["Venta",];
            let imagenes_2D=["","www.linkimagenes"];
            let video_2D=["","www.linkvideo"];
            let tour_virtual=["","www.linktourvirtual"];
            let video_tour=["","www.linkvideotour"];
            let valores_booleanos=[true,false];
            let categorias=["Gratuito","Pro","Pro360"];
            let modificacionesPermitidas=[0,1,3];
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
                /*if(valores_booleanos[numero_aleatorio]){
                    numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                    if(valores_booleanos[numero_aleatorio]){
                        numero_aleatorio=Math.floor(Math.random() * (500  - 0)) + 10;
                        inmueble.historial_precios.push(inmueble.precio+numero_aleatorio);
                        inmueble.precio=inmueble.precio+numero_aleatorio;
                    }else{
                        numero_aleatorio=Math.floor(Math.random() * (500  - 0)) + 10;
                        inmueble.historial_precios.push(inmueble.precio-numero_aleatorio);
                        inmueble.precio=inmueble.precio+numero_aleatorio;
                    }
                }*/
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
                inmueble.dormitorios=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5  - 0)) + 1;
                inmueble.banios=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5  - 0)) + 1;
                inmueble.garaje=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
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
                //inmueble.autorizacion="Pendiente - Publicar";
                numero_aleatorio=Math.floor(Math.random() * (categorias.length  - 0)) + 0;
                inmueble.categoria=categorias[numero_aleatorio];
                inmueble.modificaciones_permitidas=0;
                
                const inmuebleImagenes=InmuebleImagenes();
                let imagenes=[];
                var cantidad_imagenes=3;
                var j=0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.principales=imagenes;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.plantas=inmueble.plantas>0?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.ambientes=inmueble.abientes>0?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.dormitorios=inmueble.dormitorios>0?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.banios=inmueble.banios>0?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.garaje=inmueble.garaje>0?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.amoblado=inmueble.amoblado?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.lavanderia=inmueble.lavanderia?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.cuarto_lavado=inmueble.cuarto_lavado?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.churrasquero=inmueble.churrasquero?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.azotea=inmueble.azotea?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.condominio_privado=inmueble.condominio_privado?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.cancha=inmueble.cancha?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.piscina=inmueble.piscina?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.sauna=inmueble.sauna?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.jacuzzi=inmueble.jacuzzi?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.estudio=inmueble.estudio?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.jardin=inmueble.jardin?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.porton_electrico=inmueble.porton_electrico?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.aire_acondicionado=inmueble.aire_acondicionado?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.calefaccion=inmueble.calefaccion?imagenes:[];;
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.ascensor=inmueble.ascensor?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.deposito=inmueble.deposito?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.sotano=inmueble.sotano?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.balcon=inmueble.balcon?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.tienda=inmueble.tienda?imagenes:[];
                imagenes=[];
                cantidad_imagenes=Math.floor(Math.random() * (3  - 0)) + 0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                inmuebleImagenes.amurallado_terreno=inmueble.amurallado_terreno?imagenes:[];
                inmuebleImagenes.inmueble=inmueble.id;
                inmueble.imagenes=inmuebleImagenes.id;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                
                
                inmueble.creador=id_creador;
                inmueble.propietario=id_propietario;
                //console.log(inmueble);
                //console.log(inmuebleInternas);
                //console.log(inmuebleComunidad);
                //console.log(inmuebleOtros);
                secuencia.indice_inmuebles=secuencia.indice_inmuebles+1;
                let administradorInmueble=await AdministradorImmueble();
                administradorInmueble.tipo_solicitud="Publicar";
                administradorInmueble.respuesta="";
                administradorInmueble.observaciones="";
                administradorInmueble.link_respaldo_solicitud="";
                administradorInmueble.link_respaldo_respuesta="";
                administradorInmueble.inmueble=inmueble.id;
                administradorInmueble.usuario_solicitante=id_creador;

                await administradorInmueble.save();
                let solicitudesAdministradores=await SolicitudesAdministradores();
                solicitudesAdministradores.administrador_inmueble=administradorInmueble.id;
                solicitudesAdministradores.tipo_solicitud="Publicar";
                solicitudesAdministradores.fecha_solicitud=administradorInmueble.fecha_solicitud;
                solicitudesAdministradores.respuesta="";
                solicitudesAdministradores.observaciones="";
                solicitudesAdministradores.link_respaldo_solicitud="";
                solicitudesAdministradores.link_respaldo_respuesta="";
                solicitudesAdministradores.usuario_solicitante=id_creador;
                if(inmueble.categoria=="Gratuito"){
                    const inmuebleComprobante=InmuebleComprobante();
                    inmuebleComprobante.tipo_comprobante="Publicar";
                    inmuebleComprobante.link_imagen_documento_propiedad=link_comprobante;
                    inmuebleComprobante.link_imagen_dni_propietario=link_comprobante;
                    inmuebleComprobante.solicitud=solicitudesAdministradores.id;
                    inmuebleComprobante.plan="632f100dae97bf30a4b526dd";
                    solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                    await inmuebleComprobante.save();
                }else{
                    const inmuebleComprobante=InmuebleComprobante();
                    inmuebleComprobante.link_imagen_deposito=link_comprobante;
                    numero_aleatorio=Math.floor(Math.random() * (nombres.length  - 0)) + 0;
                    inmuebleComprobante.nombre_depositante=nombres[numero_aleatorio];
                    inmuebleComprobante.tipo_comprobante="Publicar";
                    inmuebleComprobante.medio_pago="Depósito";
                    inmuebleComprobante.monto_pago=30;
                    inmuebleComprobante.cuenta_banco="612febf03b43f416c48b72b9";
                    inmuebleComprobante.solicitud=solicitudesAdministradores.id;
                    inmuebleComprobante.plan="63349dea1dace235a4cc4516";
                    inmuebleComprobante.numero_transaccion="123561565";
                    inmuebleComprobante.inmueble=inmueble.id;
                    solicitudesAdministradores.comprobante=inmuebleComprobante.id;
                    await inmuebleComprobante.save();
                }
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
                inmueble.fecha_publicacion=new Date();
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
        modificarCuentaBanco: async (_,{id,input})=>{
            let cuentasBanco=await CuentasBanco.findById(id);

            if(!cuentasBanco){
                throw new Error('Cuenta de banco no encontrado');
            }
            await CuentasBanco.findOneAndUpdate({_id: id},input);
            return "Se guardaron los cambios";
        },
        eliminarCuentaBanco: async(_,{id})=>{
            let cuentasBanco=await CuentasBanco.findById(id);

            if(!cuentasBanco){
                throw new Error('Cuenta de banco no encontrado');
            }
            await CuentasBanco.findByIdAndDelete({_id: id});
            return "Cuenta de banco eliminada";
        },

        
        registrarSolicitudAdministradorAgente: async(_,{input})=>{
            let administradorAgente=new AdministradorAgente(input);
            administradorAgente.save();
            return "Se registró correctamente";
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
        
        
    }
}

module.exports=resolvers;
//module.exports = pubsub;