const MembresiaPlanesPago = require('../../../module_generales/models/membresiaPlanesPago');
const MembresiaPago=require('../../models/membresiaPago');
const Usuario = require('../../models/usuario');
const UsuarioInmuebleBuscado = require('../../models/usuarioInmuebleBuscado');
const InmuebleQueja=require('../../../module_inmueble/models/inmuebleQueja');
const SolicitudesAdministradores=require('../../../models/solicitudesAdministradores');
const AdministradorInmueble=require('../../../models/administradorInmueble');
const EmailClaveVerificaciones=require('../../models/emailClaveVerificaciones');
const transporter=require("../../models/mailer");
const bcryptjs = require('bcryptjs');
const InscripcionAgente=require('../../models/inscripcionAgente');
const { find } = require('../../models/inscripcionAgente');
const resolversUsuario={
    Query:{
        obtenerMembresiaPagos: async(_,{id})=>{
            var filter1={};
            filter1.usuario=id;
            let membresiaPago=await MembresiaPago.find(filter1).sort({fecha_final:1})
                .populate({path:"membresia_planes_pago"})
                .populate({path:"cuenta_banco"})
                .populate({path:"usuario"})
                .populate({path:"administrador"});
            return membresiaPago;
        },
        obtenerMembresiaPagosAdministrador: async(_,{id})=>{
            var filter1={};
            filter1.administrador={$in:[null,id]};
            filter1.autorizacion="Pendiente";
            let membresiaPago=MembresiaPago.find(filter1).sort({fecha_solicitud:1});
            await membresiaPago.find({})
                .populate({path:"membresia_planes_pago"})
                .populate({path:"cuenta_banco"})
                .populate({path:"usuario"})
                .populate({path:"administrador"});
            return membresiaPago;
        },
        obtenerUsuarioInmueblesBuscados: async(_,{id})=>{
            var filter1={};
            filter1.usuario=id;
            let usuarioInmuebleBuscado=await UsuarioInmuebleBuscado.find(filter1);
            return usuarioInmuebleBuscado;
        },
        obtenerNotificacionesAccionesVendedor:async (_,{id_inmueble})=>{
            var filter={};
            filter.inmueble=id_inmueble;
            
            var resultado={};
            const administradorInmueble=await AdministradorInmueble.findOne(filter)
                                        .populate({path:"usuario_respondedor"})
                                        .populate({path:"super_usuario"});
            resultado.inmueble_queja=await InmuebleQueja.find(filter)
                                        .populate({path:"usuario_respondedor"});
            filter={};
            filter.administrador_inmueble=administradorInmueble.id;
            resultado.solicitudes_administradores=await SolicitudesAdministradores.find(filter)
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
                populate:({path:"plan"})
            });
            resultado.administrador_inmueble=administradorInmueble;
            return resultado;
        },
        obtenerAgentesCiudad: async(_,{ciudad})=>{
            var filter={};
            filter.ciudad=ciudad;
            filter.tipo_usuario="Agente";
            const usuarios=Usuario.find(filter).sort({cantidad_calificados:1});
            return usuarios;
        }
    },
    Mutation:{
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
                if(actividad=="Recuperar"||actividad=="Modificar"){
                    throw new Error('El usuario no está registrado');
                }
            }
            try{
                //hashear password
                const salt = await bcryptjs.genSalt(10);
                if(input.password!=""){
                    input.password = await bcryptjs.hash(password,salt);
                }
                if(actividad=="Registrar"){
                    const nuevoUsuario = new Usuario(input);
                    await nuevoUsuario.save();
                }else if(actividad=="Recuperar"){
                    usuario=await Usuario.findOne({email:input.email});
                    usuario.password=input.password;
                    await usuario.save();
                    //await Usuario.findOneAndUpdate({email:input.email},input);
                }else{
                    usuario=await Usuario.findOne({email:input.email});
                    usuario.link_foto=input.link_foto;
                    usuario.nombres=input.nombres;
                    usuario.apellidos=input.apellidos;
                    usuario.nombre_agencia=input.nombre_agencia;
                    usuario.web=input.web;
                    usuario.telefono=input.telefono;
                    if(input.password!=""){
                        usuario.password=input.password;
                    }
                    await usuario.save();
                }
                
                usuario=await Usuario.findOne({email:input.email})
                    .populate("usuario_inmueble_base")
                    .populate({path:"membresia_pagos",match:filter1,
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"membresia_pagos",match:filter1,
                    populate:{path:"usuario"}})
                    .populate({path:"membresia_pagos",
                    populate:{path:"membresia_planes_pago"}})
                    .populate({path:"membresia_pagos",match:filter1,
                    populate:{path:"administrador"}});
                return usuario;
                
            }catch(error){
                console.log(error);
            }
            
        },
        modificarUsuario: async (_,{input}) => {
            const {email,password}=input;
            const existeUsuario = await Usuario.findOne({ email });
            if(!existeUsuario){
                throw new Error('El usuario no está registrado');
            }
            
            try{
                
                if(input.password!=""){
                    
                    const salt = await bcryptjs.genSalt(10);
                    input.password = await bcryptjs.hash(password,salt);
                }
                existeUsuario.link_foto=input.link_foto;
                existeUsuario.nombres=input.nombres;
                existeUsuario.apellidos=input.apellidos;
                existeUsuario.nombre_agencia=input.nombre_agencia;
                existeUsuario.web=input.web;
                existeUsuario.telefono=input.telefono;
                if(input.password!=""){
                    existeUsuario.password=input.password;
                }
                console.log(existeUsuario.nombres);
                await existeUsuario.save();
                return "Modificado";
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
                existeUsuario.fecha_penultimo_ingreso=existeUsuario.fecha_ultimo_ingreso;
                existeUsuario.fecha_ultimo_ingreso=fecha;
                await existeUsuario.save();
                usuario=await Usuario.findOne({email:input.email})
                .populate("usuario_inmueble_base")
                .populate({path:"membresia_pagos",
                populate:{path:"cuenta_banco"}})
                .populate({path:"membresia_pagos",
                populate:{path:"usuario"}})
                .populate({path:"membresia_pagos",
                populate:{path:"membresia_planes_pago"}})
                .populate({path:"membresia_pagos",
                populate:{path:"administrador"}});
            }else{
                if(!existeUsuario){
                    const nuevoUsuario = new Usuario(input);
                    nuevoUsuario.registro=Date.now();
                    nuevoUsuario.fecha_ultimo_ingreso=Date.now();
                    nuevoUsuario.fecha_penultimo_ingreso=nuevoUsuario.fecha_ultimo_ingreso;
                    await nuevoUsuario.save();
                    usuario=nuevoUsuario;
                }else{
                    //var fecha=new Date();
                    //fecha.setDate(fecha.getDate()-3);
                    existeUsuario.fecha_penultimo_ingreso=existeUsuario.fecha_ultimo_ingreso;
                    existeUsuario.fecha_ultimo_ingreso=fecha;
                    await existeUsuario.save();
                    usuario=await Usuario.findOne({email:input.email})
                    .populate("usuario_inmueble_base")
                    .populate({path:"membresia_pagos",
                    populate:{path:"cuenta_banco"}})
                    .populate({path:"membresia_pagos",
                    populate:{path:"usuario"}})
                    .populate({path:"membresia_pagos",
                    populate:{path:"membresia_planes_pago"}})
                    .populate({path:"membresia_pagos",
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
        registrarMembresiaPago: async(_,{input})=>{
            let membresia=new MembresiaPago(input);
            let membresiaPlanesPago=await MembresiaPlanesPago.findById(input.membresia_planes_pago);
            
            var fechaInicio=new Date();
            var fechaFinal=new Date();
            membresia.fecha_solicitud=fechaInicio;
            if(membresiaPlanesPago.unidad_medida_tiempo=="Meses"){
                fechaFinal.setMonth(fechaFinal.getMonth()+membresiaPlanesPago.tiempo);
            }else{
                fechaFinal.setDate(fechaFinal.getDate()+membresiaPlanesPago.tiempo);
            }
            if(membresia.medio_pago=="Tarjeta"){
                membresia.fecha_inicio=fechaInicio;
                membresia.fecha_final=fechaFinal;
                membresia.autorizacion="Aprobado";
                membresia.fecha_respuesta=fechaInicio;
                membresia.respuesta_entregada=true;
                membresia.activo=true;
            }
            await membresia.save();
            let usuario=await Usuario.findById(membresia.usuario);
            usuario.membresia_pagos.push(membresia.id);
            await usuario.save();
            var id=membresia.id;
            let resultado=MembresiaPago.findById(id)
           // await membresia
                .populate("membresia_planes_pago")
                .populate("cuenta_banco")
                .populate("usuario")
                .populate("administrador");
            return resultado;
        },
        responderMembresiaPago: async(_,{id,id_administrador,autorizacion,observaciones})=>{
            let membresia=await MembresiaPago.findById(id);
            let membresiaPlanesPago=await MembresiaPlanesPago.findById(membresia.membresia_planes_pago);
            var fecha=new Date();
            var fechaFinal=new Date();
            if(membresia.administrador==null){
                if(autorizacion=="Rechazado"){
                    membresia.autorizacion="Rechazado";
                    membresia.observaciones=observaciones;
                    membresia.administrador=id_administrador;
                    membresia.fecha_respuesta=fecha;
                }else{
                    membresia.autorizacion=autorizacion;
                    membresia.administrador=id_administrador;
                    membresia.fecha_respuesta=fecha;
                    membresia.fecha_solicitud_super_usuario=fecha;
                }
            }else{
                throw new Error ('La petición ya fue respondida por otro administrador');
            }
            await membresia.save();
            membresia=await MembresiaPago.findById(id)
                .populate({path:"membresia_planes_pago"})
                .populate("cuenta_banco")
                .populate("usuario");
            return membresia;
        },
        registrarMembresiaPlanesPago: async(_,{input})=>{
            const membresiaPlanesPago=MembresiaPlanesPago(input);
            await membresiaPlanesPago.save();
            return membresiaPlanesPago;
        },
        modificarMembresiaPlanesPago: async(_,{id,input})=>{
            const membresiaPlanesPago=await MembresiaPlanesPago.findById(id);
            membresiaPlanesPago.nombre_plan=input.nombre_plan;
            membresiaPlanesPago.costo=input.costo;
            membresiaPlanesPago.unidad_medida_tiempo=input.unidad_medida_tiempo;
            membresiaPlanesPago.tiempo=input.tiempo;
            membresiaPlanesPago.activo=input.activo;
            await membresiaPlanesPago.save();
            return "Se guardaron los cambios";
        },
        registrarUsuarioInmuebleBuscado: async(_,{id,input})=>{
            const usuarioInmuebleBuscado=UsuarioInmuebleBuscado(input);
            usuarioInmuebleBuscado.usuario=id;
            await usuarioInmuebleBuscado.save();
            return usuarioInmuebleBuscado;
        },
        modificarUsuarioInmuebleBuscado: async(_,{id,input})=>{
            //console.log("aqui");
            await UsuarioInmuebleBuscado.findByIdAndUpdate(id,input);
            //console.log("aqui1");
            return "Se guardaron los cambios";
        },
        modificarUsuarioInmuebleBuscadoPersonales: async(_,{id,nombre_configuracion,numero_telefono})=>{
            //console.log("aqui");
            const buscado=await UsuarioInmuebleBuscado.findById(id);
            buscado.nombre_configuracion=nombre_configuracion;
            buscado.numero_telefono=numero_telefono;
            await buscado.save();
            //console.log("aqui1");
            return "Guardado";
        },
        registrarEmailClaveVerificaciones: async(_,{input,actividad})=>{
            let usuario=await Usuario.findOne({email:input.email});
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
        buscarUsuarioEmail: async(_,{email})=>{
            let usuario=await Usuario.findOne({email:email});
            /*const administradores=await Usuario.find({});
            var numero=(await Usuario.find({}).countDocuments());
            console.log(numero);*/
            /*let administradores=await Usuario.find({});
            var count=administradores.length;
            var random = Math.floor(Math.random() * count);
            usuario=administradores[random];*/


            if(!usuario){
                throw new Error("No se encontró al usuarioc");
            }
            return usuario;
        },
        registrarSolicitudInscripcionAgente: async(_,{id_usuario_solicitante,agencia,web,telefono,ciudad,link_respaldo_solicitud})=>{
            const usuario=await Usuario.findById(id_usuario_solicitante);  
            usuario.nombre_agencia=agencia;
            usuario.ciudad=ciudad;
            usuario.web=web;
            usuario.telefono=telefono;
            const inscripcionAgente=InscripcionAgente(input);
            inscripcionAgente.usuario_solicitante=id_usuario_solicitante;
            inscripcionAgente.link_respaldo_solicitud=link_respaldo_solicitud;
            var filter={};
            filter.ciudad=ciudad;
            filter.tipo_usuario="Administrador";
            let administradores=await Usuario.find(filter);
            var count=administradores.length;
            if (count>0){
                var random = Math.floor(Math.random() * count);
                const administrador=administradores[random]
                inscripcionAgente.usuario_respondedor=administrador.id;
            }
            var fecha=new Date();
            inscripcionAgente.fecha_solicitud=fecha; 
            await inscripcionAgente.save();
            await usuario.save();
            return inscripcionAgente;
        },
        marcarLeidoSolicitudAdministradorUsuario: async(_,{id})=>{
            await SolicitudesAdministradores.findByIdAndUpdate(id,{respuesta_entregada:true});
            return "Se guardaron los cambios";
        },
        registrarUsuariosMasivo: async(_,{})=>{
            var cantidad=50;
            let nombres=["Juan","Ruben","Maria","Mario","Roberto","Pedro","Luis",
            "Victor","Carlos","Cesar","Pablo","Rodrigo","Ariel","Cristian",
            "Roxana","Shirley","Rosalia","Juana","Carlota","Carla","Raul",
            "Wilber","Miguel","Angel","Fernando","Fernanda","David","Paola",
            "Evelin","Alejandra","Alejandro","Marco","Alberto","Ruth"];
            let apellidos=["Llanos","Mamani","Arando","Castro","Cruz","Perez","Gonzales",
                        "Loredo","Peredo","Abastoflor","Paco","Rodriguez","Dominguez",
                        "Fuentes","Gallardo","Guzman","Suarez","Vega","Bejarano","Palacios",
                        "Garcilazo","Bohorquez","Branco","Arancibia","Puma","Nogales"];
            let ciudades=["La Paz","Oruro","Potosí","Cochabamba","Tarija","Sucre","Santa Cruz","Trinidad"];
            var i=0;
            for(i=0;i<cantidad;i++){
                var numero_aleatorio=Math.floor(Math.random() * (ciudades.length - 0)) + 0;
                const usuario=Usuario();
                usuario.ciudad=ciudades[numero_aleatorio];
                usuario.ciudad="Sucre";
                numero_aleatorio=Math.floor(Math.random() * (nombres.length - 0)) + 0;
                usuario.nombres=nombres[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (apellidos.length - 0)) + 0;
                usuario.apellidos=apellidos[numero_aleatorio];
                usuario.email="email"+(i+1000)+"@email.com";
                const salt = await bcryptjs.genSalt(10);
                usuario.password = await bcryptjs.hash("12345",salt);
                usuario.medio_registro="Creada";
                usuario.tipo_usuario="Agente";
                usuario.nombre_agencia="Agencia "+i;
                numero_aleatorio=Math.floor(Math.random() * (99999999 - 0)) + 0;
                usuario.telefono=""+numero_aleatorio;
                usuario.web="www.agencia"+i+".com";
                usuario.verificado=true;
                usuario.estado_cuenta=true;
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 0;
                usuario.cantidad_calificados=numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5 - 1)) + 1;
                usuario.sumatoria_calificacion=numero_aleatorio*usuario.cantidad_calificados;
                await usuario.save();
            }
            return "Registrado";
        }
    }
}
module.exports=resolversUsuario;