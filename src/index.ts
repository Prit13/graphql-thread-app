import express from 'express';
import { ApolloServer } from '@apollo/server';
import { prismaClient } from './lib/db';

const {expressMiddleware}= require('@apollo/server/express4');


async function init(){          // why we created all inside function, because to start Apollo server, it need await
    const app= express();
    const PORT= process.env.PORT || 8000;   

    app.use(express.json());

    const gqlServer = new ApolloServer({
        // schemas
        typeDefs: `
            type Query{
                hello: String
                say(name: String): String
            }

            type Mutation{
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: ()=> `Hey there, Im graphql server` ,
                say: (_, {name})=> `Hey ${name}, How are you`
            },

            Mutation: {
                // resolver_name: function(_, {field_name1,field_name2}: {field_name1: data_type, field_name2: data_type}): return_type
                createUser: async(_, 
                    {firstName, lastName, email, password} : 
                    {firstName: string, lastName: string, email: string, password: string} )=> {
                        await prismaClient.user.create({
                            data: {
                                email,
                                firstName,
                                lastName,
                                password,
                                salt: "random_salt",
                                // profileImageURL: ""
                            }
                        })
                        return true;
                    }
            }

        },
    });

    await gqlServer.start();

    app.get('/', (req,res)=>{
        res.json({message: 'Server is running'})
    })

    app.use("/graphql", expressMiddleware(gqlServer));  // expressMiddleware returns response in json format so we need to express.json() middleware

    app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))

}

init();