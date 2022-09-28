const { ApolloServer,gql }=require('apollo-server');
const jwt=require('jsonwebtoken');
require('dotenv').config('variables.env');

//const typeDefs=require('./db/schema');
//const typeDefsUsuario=('./db/schemausuario');
const resolvers=require('./db/resolvers');
const resolversGenerales=require('./module_generales/db/resolvers/resolversGenerales');
const resolversUsuario=require('./module_usuario/db/resolvers/resolverUsuario');
const resolversAdministrador=require('./module_usuario/db/resolvers/resolversAdministrador');
const resolversSuperUsuario=require('./module_usuario/db/resolvers/resolversSuperUsuario');
const pathSchemaGenerales='./module_generales/db/schema/schemaGenerales.graphql';
const pathSchemaSuperUsuario='./module_usuario/db/schema/schemaSuperUsuario.graphql';
const pathSchemaUsuario='./module_usuario/db/schema/schemausuario.graphql';
const pathSchemaAdministrador='./module_usuario/db/schema/schemaAdministrador.graphql';
const conectarDB=require('./config/db')
const fs=require('fs')


//conectar a la base de datos
conectarDB();
const server=new ApolloServer({
    typeDefs:[
        gql(fs.readFileSync(pathSchemaGenerales,'utf8')),
        gql(fs.readFileSync(pathSchemaUsuario,'utf8')),
        gql(fs.readFileSync(pathSchemaAdministrador,'utf8')),
        gql(fs.readFileSync(pathSchemaSuperUsuario,'utf8')),
        gql(fs.readFileSync('./db/schemaAgencia.graphql','utf8')),
        gql(fs.readFileSync('./db/schemaInmueble.graphql','utf8')),
    ],
    resolvers:[resolversGenerales,resolvers,resolversSuperUsuario,resolversUsuario,resolversAdministrador],
    context: ({req})=>{
        const token = req.headers['authorization']||'';
        if(token){
            try{
                const usuario = jwt.verify(token,process.env.SECRETA);
                return {
                    usuario
                }
            }catch(error){

            }
        }
    },
    playground: true,
    introspection: true,
});
/*server.listen().then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`);
})*/
server.listen({port:process.env.PORT||4000}).then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`);
});