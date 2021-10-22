const { ApolloServer,gql }=require('apollo-server');
const jwt=require('jsonwebtoken');
require('dotenv').config('variables.env');

//const typeDefs=require('./db/schema');
//const typeDefsUsuario=('./db/schemausuario');
const resolvers=require('./db/resolvers');
const resolversUsuario=require('./module_usuario/db/resolvers/resolverUsuario');
const resolversSuperUsuario=require('./module_usuario/db/resolvers/resolversSuperUsuario');
const pathSchemaSuperUsuario='./module_usuario/db/schema/schemaSuperUsuario.graphql';
const pathSchemaUsuario='./module_usuario/db/schema/schemausuario.graphql';
const pathSchemaAdministrador='./module_usuario/db/schema/schemaAdministrador.graphql';
const conectarDB=require('./config/db')
const fs=require('fs')


//conectar a la base de datos
conectarDB();
const server=new ApolloServer({
    typeDefs:[
        gql(fs.readFileSync('./db/schema.graphql','utf8')),
        gql(fs.readFileSync(pathSchemaUsuario,'utf8')),
        gql(fs.readFileSync(pathSchemaAdministrador,'utf8')),
        gql(fs.readFileSync(pathSchemaSuperUsuario,'utf8')),
        gql(fs.readFileSync('./db/schemaAgencia.graphql','utf8')),
        gql(fs.readFileSync('./db/schemaInmueble.graphql','utf8')),
    ],
    resolvers:[resolvers,resolversSuperUsuario,resolversUsuario],
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