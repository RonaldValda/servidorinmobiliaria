const MembresiaPlanesPago = require('../../../models/membresiaPlanesPago');
const MembresiaPago=require('../../../models/membresiaPago');
const InmuebleReportado=require('../../../models/inmuebleReportado');4
const InmuebleQueja=require('../../../module_inmueble/models/inmuebleQueja');
const Inmueble=require('../../../models/inmueble');
const resolversSuperUsuario={
    Query:{
        obtenerMembresiaPlanesPago: async(_,{})=>{
            return await MembresiaPlanesPago.find();
        },
        obtenerMembresiaPagosSuperUsuario: async(_,{id})=>{
            var filter1={};
            filter1.super_usuario={$in:[null,id]};
            filter1.autorizacion="Confirmado";
            filter1.autorizacion_super_usuario="Pendiente";
            let membresiaPago=MembresiaPago.find(filter1).sort({fecha_solicitud_super_usuario:1});
            await membresiaPago.find({})
                .populate({path:"membresia_planes_pago"})
                .populate({path:"cuenta_banco"})
                .populate({path:"usuario"})
                .populate({path:"administrador"});
            return membresiaPago;
        },
        obtenerNotificacionesSuperUsuario:async (_,{id})=>{
            var filter={};
            filter.usuario_respondedor=id;
            filter.respuesta="";
            var respuesta={};
            respuesta.reportar_inmueble=await InmuebleReportado.find(filter)
                                        .populate({path:"usuario_solicitante"})
                                        .populate({path:"inmueble",populate:{path:"imagenes"}})
                                        .populate({path:"inmueble",populate:{path:"creador"}});
            respuesta.inmuebles_quejas=await InmuebleQueja.find(filter)
                                        .populate({path:"inmueble",populate:{path:"imagenes"}})
                                        .populate({path:"inmueble",populate:{path:"creador"}});
            filter={};
            filter.super_usuario={$in:[null,id]};
            filter.autorizacion="Aprobado";
            filter.autorizacion_super_usuario="Pendiente";
            respuesta.membresias_pagos=MembresiaPago.find(filter).sort({fecha_solicitud_super_usuario:1})
                .populate({path:"membresia_planes_pago"})
                .populate({path:"cuenta_banco"})
                .populate({path:"usuario"})
                .populate({path:"administrador"});
            return respuesta;
        }
    },
    Mutation:{
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
        responderMembresiaPagoSuperUsuario: async(_,{id,id_super_usuario,autorizacion,observaciones})=>{
            let membresia=await MembresiaPago.findById(id);
            let membresiaPlanesPago=await MembresiaPlanesPago.findById(membresia.membresia_planes_pago);
            var fecha=new Date();
            var fechaFinal=new Date();
            if(membresia.super_usuario==null){
                if(autorizacion=="Rechazado"){
                    membresia.autorizacion_super_usuario="Rechazado";
                    membresia.observaciones_super_usuario=observaciones;
                    membresia.super_usuario=id_super_usuario;
                    membresia.fecha_respuesta_super_usuario=fecha;
                }else{
                    membresia.autorizacion_super_usuario=autorizacion;
                    membresia.super_usuario=id_super_usuario;
                    membresia.fecha_respuesta_super_usuario=fecha;
                    var fechaInicio=new Date(membresia.fecha_solicitud);
                    fechaInicio.setDate(fechaInicio.getDate()+2);
                    membresia.fecha_inicio=fechaInicio;
                    fechaFinal.setDate(fechaInicio.getDate());
                    if(membresiaPlanesPago.unidad_medida_tiempo=="Meses"){
                        fechaFinal.setMonth(fechaFinal.getMonth()+membresiaPlanesPago.tiempo);
                    }else{
                        fechaFinal.setDate(fechaFinal.getDate()+membresiaPlanesPago.tiempo);
                    }
                    membresia.fecha_final=fechaFinal;
                }
            }else{
                throw new Error ('La petición ya fue respondida por otro super usuario');
            }
            await membresia.save();
            membresia=await MembresiaPago.findById(id)
                .populate({path:"membresia_planes_pago"})
                .populate("cuenta_banco")
                .populate("usuario")
                .populate("administrador");
            return membresia;
        },
        responderReporteInmueble: async(_,{id_solicitud,input})=>{      
            var fecha=new Date();
            console.log(id_solicitud);
            let inmuebleReportado=await InmuebleReportado.findById(id_solicitud);
            inmuebleReportado.respuesta=input.respuesta;
            inmuebleReportado.fecha_respuesta=fecha;
            inmuebleReportado.observaciones_respuesta=input.observaciones_respuesta;
            let inmueble=await Inmueble.findById(inmuebleReportado.inmueble);
            inmueble.autorizacion="Inactivo";
            await inmuebleReportado.save();
            await inmueble.save();
            return inmuebleReportado;
        },
        responderInmuebleQuejaSuperUsuario: async(_,{id_solicitud,id_super_usuario,input})=>{      
            var fecha=new Date();
            let inmuebleQueja=await InmuebleQueja.findById(id_solicitud);
            if(inmuebleQueja.super_usuario==null){
                inmuebleQueja.super_usuario=id_super_usuario;
            }else{
                if(inmuebleQueja.super_usuario!=id_super_usuario){
                    throw new Error ("La petición ya fue respondida por otro super usuario");
                }
            }
            inmuebleQueja.respuesta=input.respuesta;
            inmuebleQueja.fecha_respuesta=fecha;
            inmuebleQueja.observaciones_respuesta=input.observaciones_respuesta;
            await inmuebleQueja.save();
            return inmuebleQueja;
        },
    }
}
module.exports=resolversSuperUsuario;