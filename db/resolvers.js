const Usuario = require('../models/usuario');
const Proyecto = require('../models/proyecto'); 
const Tarea = require('../models/tarea');
const Inmueble = require('../models/inmueble'); 
const Agencia = require('../models/agencia');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InmuebleFavorito = require('../models/inmuebleFavorito'); 
require('dotenv').config({path: 'variables.env'})
//crea y firma un JWT

const crearToken = (usuario,secreta,expiresIn)=>{
    console.log(usuario);
    const {id,email}=usuario;

    return jwt.sign({id,email},secreta,{expiresIn});
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
        obtenerInmueblesSimpleFiltro: async (_,{input1})=>{
            var filter1={};
            if(input1.tipo_inmueble!="Todos") filter1.tipo_inmueble={$in:input1.tipo_inmueble};
            if(input1.tipo_contrato!="Todos") filter1.tipo_contrato={$in:input1.tipo_contrato};
            //filter1={"tipo_inmueble":input1.tipo_inmueble,"tipo_contrato":input1.tipo_contrato}
            if(input1.precio_min<input1.precio_max) {
                filter1.precio={$gte:input1.precio_min,$lte:input1.precio_max}
            }else{
                filter1.precio={$gte:input1.precio_min};
            };
            //console.log("filtro....",filter1);

            const inmuebles=Inmueble.find(filter1).sort({precio:1});
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
        obtenerUsuarioFavorito: async(_,{id})=>{
            const inmuebleFavorito=await InmuebleFavorito.find({usuario:id})
            .populate({
                path: "usuario"
            }).populate({
                path: "inmueble",
                populate:{
                    path:"agencia"
                }
            });
            return inmuebleFavorito;
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
        }
    },
    Mutation: {
        crearUsuario: async (_,{input}) => {
            const {email,password}=input;
            const existeUsuario = await Usuario.findOne({ email });
            //console.log(existeUsuario);
            if(existeUsuario){
                throw new Error('El usuario ya está registrado');
            }
            try{

                //hashear password
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password,salt);

                console.log(input);

                //Registrar un nuevo usuario
                const nuevoUsuario = new Usuario(input);
                console.log(nuevoUsuario);

                nuevoUsuario.save();
                return 'Usuario creado correctamente';
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
                usuario=Usuario.findOne({email:input.email});
            }else{
                
                if(!existeUsuario){
                    console.log("aquiiii");
                    const nuevoUsuario = new Usuario(input);
                    await nuevoUsuario.save();
                    usuario=nuevoUsuario;
                }else{
                    usuario=Usuario.findOne({email:input.email});
                }
            }
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
                const nuevoInmueble = new Inmueble(input);
                nuevoInmueble.agencia=id;
                await nuevoInmueble.save();
                let resultado=await Inmueble.find().where('_id').equals(nuevoInmueble.id);
                console.log("imprimiendo resultado  ",resultado);
                return "Se registro correctamente";
            }catch(error){
                console.log(error);
            }
        },
        actualizarInmueble: async(_,{id,input})=>{
            let inmueble=await Inmueble.findById(id);
            if(!inmueble){
                throw new Error('Inmueble no encontrada');
            }
            await Inmueble.findOneAndUpdate({_id: id},input);
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
        registrarInmuebleFavorito: async (_,{id_inmueble,id_usuario,input}) => {
            try{
                let inmuebleFavorito=await InmuebleFavorito.findOne({"inmueble":id_inmueble,"usuario":id_usuario});
                if(inmuebleFavorito){
                    await InmuebleFavorito.findOneAndUpdate({_id:inmuebleFavorito.id},input);
                }else{
                    inmuebleFavorito=InmuebleFavorito(input);
                    inmuebleFavorito.inmueble = id_inmueble;
                    inmuebleFavorito.usuario = id_usuario;
                    await inmuebleFavorito.save();
                    let inmueble=await Inmueble.findById(id_inmueble);
                    inmueble.usuarios_favorito.push(inmuebleFavorito);
                    await inmueble.save();
                }
                return "Se registro correctamente";
            }catch(error){
                console.log(error);
            }
        },
        registrarInmuebleMasivo: async (_,{id})=>{
            var min=800;
            var max=1000;
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
            let estado_inmueble=["Sin Negociar","Sin Negociar","Sin Negociar","Negociaciones","Vendido"];
            let ciudad="Sucre";
            let zona=["Zona 1","Zona 2","Zona 3","Zona 4","Zona 5","Zona 6","Zona 7","Zona 8","Zona ","Zona 10"];
            let tipo_inmueble=["Casa","Departamento","Terreno"];
            let tipo_contrato=["Venta","Alquiler","Anticrético"];
            let imagenes_2D=["","www.linkimagenes"];
            let video_2D=["","www.linkvideo"];
            let tour_virtual=["","www.linktourvirtual"];
            let video_tour=["","www.linkvideotour"];
            let valores_booleanos=[true,false];
            const cantidad_inmuebles=Math.floor(Math.random() * (max - min)) + min;
            var i=0;
            for(i=0;i<cantidad_inmuebles;i++){
                const inmueble=Inmueble();
                var numero_aleatorio=Math.floor(Math.random() * (nombres.length - 0)) + 0;
                inmueble.nombre_propietario=nombres[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (apellidos.length - 0)) + 0;
                inmueble.nombre_propietario=inmueble.nombre_propietario+" "+apellidos[numero_aleatorio];
                inmueble.ciudad=ciudad;
                numero_aleatorio=Math.floor(Math.random() * (zona.length - 0)) + 0;
                inmueble.zona=zona[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 0;
                inmueble.direccion="Dirección "+numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (400 - 0)) + 20;
                inmueble.precio=numero_aleatorio*1000;
                numero_aleatorio=Math.floor(Math.random() * (tipo_inmueble.length  - 0)) + 0;
                inmueble.tipo_inmueble=tipo_inmueble[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (estado_inmueble.length  - 0)) + 0;
                inmueble.estado_inmueble=estado_inmueble[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 1;
                inmueble.superficie_terreno=inmueble.tipo_inmueble=="Departamento"?numero_aleatorio*10:numero_aleatorio*10;
                numero_aleatorio=Math.floor(Math.random() * (50 - 0)) + 1;
                inmueble.superficie_construccion=inmueble.tipo_inmueble=="Departamento"?numero_aleatorio*10:0;
                if(inmueble.tipo_inmueble=="Casa"){
                    var num_aux=numero_aleatorio;
                    numero_aleatorio=Math.floor(Math.random() * (num_aux - 0)) + 1;
                    inmueble.superficie_construccion=numero_aleatorio*10;
                }
                numero_aleatorio=Math.floor(Math.random() * (tipo_contrato.length  - 0)) + 0;
                inmueble.tipo_contrato=tipo_contrato[numero_aleatorio];
                //----------------cambiar precio para alquiler--------------------------
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
                
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.documentos_dia=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.construccion_estrenar=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.incluye_credito=valores_booleanos[numero_aleatorio];
                inmueble.sin_construir=inmueble.tipo_inmueble=="Terreno"?true:false;
                numero_aleatorio=Math.floor(Math.random() * (20  - 0)) + 0;
                inmueble.tiempo_construccion=numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.inmueble_compartido=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (4  - 0)) + 2;
                inmueble.numero_duenios=inmueble.inmueble_compartido?numero_aleatorio:1;
                numero_aleatorio=Math.floor(Math.random() * (7  - 0)) + 1;
                inmueble.numero_pisos=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sin_hipoteca=valores_booleanos[numero_aleatorio];
                let imagenes=[];
                var cantidad_imagenes=Math.floor(Math.random() * (4  - 0)) + 1;
                var j=0;
                for(j=0;j<cantidad_imagenes;j++){
                    numero_aleatorio=Math.floor(Math.random() * (url_imagenes.length  - 0)) + 0;
                    imagenes.push(url_imagenes[numero_aleatorio]);
                }
                numero_aleatorio=Math.floor(Math.random() * (11  - 0)) + 1;
                inmueble.coordenadas.push(Math.round((latitud-1/numero_aleatorio)*10000)/10000);
                numero_aleatorio=Math.floor(Math.random() * (80  - 0)) + 1;
                inmueble.coordenadas.push(Math.round((longitud-1/numero_aleatorio)*10000)/10000);
                inmueble.agencia=id;
                inmueble.url_imagenes=imagenes;
                
                numero_aleatorio=Math.floor(Math.random() * (5 - 0)) + 1;
                inmueble.numero_dormitorios=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5  - 0)) + 1;
                inmueble.numero_banios=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (5  - 0)) + 1;
                inmueble.numero_garaje=inmueble.tipo_inmueble=="Terreno"?0:numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.mascotas_permitidas=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.lavanderia=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.zona_lavadora=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.churrasquero=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.azotea=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.cancha=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.piscina=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.lavanderia=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sauna=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.tienda=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.estudio=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.jardin=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.balcon=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.ascensor=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.sotano=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.deposito=inmueble.tipo_inmueble=="Terreno"?false:valores_booleanos[numero_aleatorio];

                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.iglesia=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.parque=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.deportiva=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.policial=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.residencial=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.estudiantil=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.comercial=valores_booleanos[numero_aleatorio];

                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.verificados=valores_booleanos[numero_aleatorio];
                numero_aleatorio=Math.floor(Math.random() * (valores_booleanos.length  - 0)) + 0;
                inmueble.bienes_adjudicados=valores_booleanos[numero_aleatorio];
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
                //console.log(inmueble);
                //console.log(inmuebleInternas);
                //console.log(inmuebleComunidad);
                //console.log(inmuebleOtros);
                await inmueble.save();
                //await inmueble.save();
            }
            return "Se registraron los inmuebles";
        },
    }
}
module.exports=resolvers;