const MembresiaPlanesPago = require('../../../models/membresiaPlanesPago');
const MembresiaPago=require('../../../models/membresiaPago');
const Usuario = require('../../../models/usuario');
const UsuarioInmuebleBuscado = require('../../models/usuarioInmuebleBuscado');
const InmuebleQueja=require('../../../module_inmueble/models/inmuebleQueja');
const SolicitudesAdministradores=require('../../../models/solicitudesAdministradores');
const AdministradorInmueble=require('../../../models/administradorInmueble');
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
                                        .populate({path:"inmueble_vendido",populate:{path:"usuario_comprador"}})
                                        .populate({path:"inmueble_dar_baja"});
            resultado.administrador_inmueble=administradorInmueble;
            return resultado;
        }
    },
    Mutation:{
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
        }
    }
}
module.exports=resolversUsuario;