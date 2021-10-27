const AdministradorZona=require('../../models/administradorZona');
const InscripcionAgente=require('../../models/inscripcionAgente');
const MembresiaPago=require('../../models/membresiaPago');
const resolversAdministrador={
    Query:{
        obtenerAdministradorZonas: async(_,{id_administrador})=>{
            var filter={};
            filter.administrador=id_administrador;
            console.log(id_administrador);
            const administradorZonas=await AdministradorZona.find(filter)
                .populate({path:"zona"});
            
            return administradorZonas;
        },
        obtenerNotificacionesAdministrador: async(_,{id})=>{
            var filter={};
            filter.administrador={$in:[null,id]};
            filter.autorizacion="Pendiente";
            var resultado={};
            resultado.membresias_pagos=await MembresiaPago.find(filter)
                                        .populate("membresia_planes_pago")
                                        .populate("cuenta_banco")
                                        .populate("usuario");
            filter={};
            filter.usuario_respondedor={$in:[null,id]};
            filter.respuesta="";
            resultado.inscripciones_agentes=await InscripcionAgente.find(filter)
                                        .populate("usuario_solicitante");
            return resultado;
        },
        
    },
    Mutation:{
        responderSolicitudInscripcionAgente: async(_,{id,id_administrador,respuesta,observaciones})=>{
            
            const inscripcionAgente=await InscripcionAgente.findById(id);
            if(inscripcionAgente.usuario_respondedor==null||inscripcionAgente.usuario_respondedor==id_administrador){
                inscripcionAgente.usuario_respondedor=id_administrador;
                var fecha=new Date();
                inscripcionAgente.respuesta=respuesta;
                inscripcionAgente.observaciones=observaciones;
                inscripcionAgente.fecha_respuesta=fecha;
                await inscripcionAgente.save();
            }else{
                 throw new Error("La solicitud ya fue respondida por otro administrador");
            }
            return inscripcionAgente;
        }
    }
}
module.exports=resolversAdministrador;