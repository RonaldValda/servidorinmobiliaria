const MembresiaPlanesPago = require('../../../models/membresiaPlanesPago');
const resolversSuperUsuario={
    Query:{
        obtenerMembresiaPlanesPago: async(_,{})=>{
            return await MembresiaPlanesPago.find();
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
        }
    }
}
module.exports=resolversSuperUsuario;