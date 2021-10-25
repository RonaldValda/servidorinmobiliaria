const Zona=require('../../models/zona');
const Ciudad=require('../../models/ciudad');
const Departamento=require('../../models/departamento');
const VersionesAPP=require('../../models/versionesAPP');
const resolversGenerales={
    Query:{
        obtenerZonas: async(_,{id_ciudad})=>{
            let zonas=await Zona.find({ciudad:id_ciudad});
            return zonas;     
        },
        obtenerDepartamentos: async(_,{})=>{
            let departamentos=await Departamento.find({});
            return departamentos;
        },
        obtenerCiudades: async(_,{id_departamento})=>{
            var filter={};
            filter.departamento=id_departamento
            let ciudades=await Ciudad.find(filter);
            return ciudades;
        },
        obtenerGeneralesLugares: async(_,{})=>{
            var respuesta={};
            respuesta.ciudades=await Ciudad.find({})
            .populate({path:"departamento"});
            respuesta.zonas=await Zona.find({});
            return respuesta;
        },
        obtenerVersionesAPP: async(_)=>{
            let versionesAPP=await VersionesAPP.findOne({}).sort({fecha_publicacion:1})
            return versionesAPP;     
        },
    },
    Mutation:{
        registrarDepartamento: async(_,{nombre_departamento})=>{
            const departamento=Departamento();
            departamento.nombre_departamento=nombre_departamento;
            await departamento.save();
            return departamento;
        },
        modificarDepartamento: async(_,{id,nombre_departamento})=>{
            const departamento=await Departamento.findById(id);
            departamento.nombre_departamento=nombre_departamento;
            departamento.save();
            return "Guardado";
        },
        eliminarDepartamento: async(_,{id})=>{
            await Departamento.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarCiudad: async(_,{id_departamento,nombre_ciudad})=>{
            const ciudad=Ciudad();
            ciudad.departamento=id_departamento;
            ciudad.nombre_ciudad=nombre_ciudad;
            await ciudad.save();
            return ciudad;
        },
        modificarCiudad: async(__,{id,nombre_ciudad})=>{
            const ciudad=await Ciudad.findById(id);
            ciudad.nombre_ciudad=nombre_ciudad;
            await ciudad.save();
            return "Guardado";
        },
        eliminarCiudad: async(_,{id})=>{
            await Ciudad.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarZona: async(_,{id_ciudad,input})=>{
            let zona=new Zona(input);
            zona.ciudad=id_ciudad;
            await zona.save();
            return zona;
        },
        modificarZona: async(_,{id,input})=>{
            let zona=await Zona.findById(id);
            zona.nombre_zona=input.nombre_zona;
            zona.coordenadas=input.coordenadas;
            await zona.save();
            return "Guardado";
        },
        eliminarZona: async(_,{id})=>{
            await Zona.findByIdAndDelete(id);
            return "Eliminado";
        },
    }
}
module.exports=resolversGenerales;