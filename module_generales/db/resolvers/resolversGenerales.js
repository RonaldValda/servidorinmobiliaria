const Zona=require('../../models/zona');
const Ciudad=require('../../models/ciudad');
const Departamento=require('../../models/departamento');
const VersionesAPP=require('../../models/versionesAPP');
const Banco=require('../../models/banco');
const Publicidad=require('../../models/publicidad');
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
        obtenerBancos: async(_,{})=>{
            let bancos=await Banco.find({});
            return bancos;
        },
        obtenerPublicidad: async(_,{})=>{
            let publicidad=await Publicidad.find({});
            return publicidad;
        }
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
        registrarBanco: async(_,{input})=>{
            const banco=Banco(input);
            await banco.save();
            return banco;
        },
        modificarBanco: async(_,{id,input})=>{
            await Banco.findByIdAndUpdate({id:id},input);
            return "Modificado";
        },
        eliminarBanco: async(_,{id})=>{
            await Banco.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarPublicidad: async(_,{input})=>{
            const publicidad=Publicidad(input);
            var fecha=new Date();
            var fechaVigencia=new Date();
            publicidad.fecha_creacion=fecha;
            fechaVigencia.setMonth(fecha.getMonth()+input.meses_vigencia);
            publicidad.fecha_vencimiento=fechaVigencia;
            await publicidad.save();
            return publicidad;
        },
        modificarPublicidad: async(_,{id,input})=>{
            const publicidad=await Publicidad.findById(id);
            var fecha=publicidad.fecha_creacion;
            fecha.setMonth(fecha.getMonth()+input.meses_vigencia);
            publicidad.fecha_vencimiento=fecha;
            publicidad.precio_min=input.precio_min;
            publicidad.precio_max=input.precio_max;
            publicidad.tipo_contrato=input.tipo_contrato;
            publicidad.tipo_inmueble=input.tipo_inmueble;
            publicidad.tipo_publicidad=input.tipo_publicidad;
            publicidad.descripcion_publicidad=input.descripcion_publicidad;
            publicidad.link_imagen_publicidad=input.link_imagen_publicidad;
            publicidad.link_web_publicidad=input.link_web_publicidad;
            await publicidad.save();
            return publicidad;
        },
        eliminarPublicidad: async(_,{id})=>{
            await Publicidad.findByIdAndDelete(id);
            return "Eliminado";
        }
    }
}
module.exports=resolversGenerales;