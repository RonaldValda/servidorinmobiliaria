const { ApolloServer,gql }=require('apollo-server');
const jwt=require('jsonwebtoken');
require('dotenv').config('variables.env');

//const typeDefs=require('./db/schema');
//const typeDefsUsuario=('./db/schemausuario');
const resolvers=require('./db/resolvers');
const conectarDB=require('./config/db')
const fs=require('fs')


//conectar a la base de datos
conectarDB();
const server=new ApolloServer({
    typeDefs:[
        gql(fs.readFileSync('./db/schema.graphql','utf8')),
        gql(fs.readFileSync('./db/schemausuario.graphql','utf8')),
        gql(fs.readFileSync('./db/schemaAgencia.graphql','utf8')),
        gql(fs.readFileSync('./db/schemaInmueble.graphql','utf8')),
    ],
    resolvers:[resolvers],
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