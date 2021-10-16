const MembresiaPlanesPago = require('../models/membresiaPlanesPago');
const MembresiaPago=require('../models/membresiaPago');
const Usuario = require('../models/usuario');
const resolversUsuario={
    Query:{
        obtenerMembresiaPagos: async(_,{id})=>{
            var filter1={};
            filter1.usuario=id;
            let membresiaPago=await MembresiaPago.find(filter1).sort({fecha_final});
            await membresiaPago.find({})
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
    },
    Mutation:{
        registrarMembresiaPago: async(_,{input})=>{
            let membresia=new MembresiaPago(input);
            var fecha=new Date();
            membresia.fecha_solicitud=fecha;
            if(membresia.medio_pago=="Tarjeta"){
                membresia.fecha_inicio=fecha;
                membresia.autorizacion="Aprobado";
                membresia.fecha_respuesta=fecha;
                membresia.respuesta_entregada=true;
                membresia.activo=true;
            }
            await membresia.save();
            let usuario=await Usuario.findById(membresia.agente);
            
            usuario.membresia_pago.push(membresia.id);
            await usuario.save();
            
            var id=membresia.id;
            membresia=await membresia.findById(id)
                .populate("membresia_planes_pago")
                .populate("cuenta_banco")
                .populate("usuario")
                .populate("administrador");
            return agentePago;
        },
        responderAgentePago: async(_,{id,id_administrador,autorizacion,observaciones})=>{
            let membresia=await MembresiaPago.findById(id);
            var fecha=new Date();
            console.log(fecha);
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
                    var fecha_inicio=Date.parse(mebresia.fecha_solicitud.toString());
                    var fechad=new Date(membresia.fecha_solicitud);
                    console.log(fechad);
                    fechad.setDate(fechad.getDate()+2);
                    membresia.fecha_inicio=fechad;
                }
            }else{
                throw new Error ('La petición ya fue respondida por otro administrador');
            }
            await membresia.save();
            membresia=await MembresiaPago.findById(id)
                .populate("cuenta_banco")
                .populate("usuario")
                .populate("administrador");
            return agentePago;
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
        }
    }
}
module.exports=resolversUsuario;