import express from 'express';
const {expressMiddleware}= require('@apollo/server/express4');
import createApolloGraphqlServer from './graphql';


async function init(){          // why we created all inside function, because to start Apollo server, it need await
    const app= express();
    const PORT= process.env.PORT || 8000;   

    app.use(express.json());  

    app.get('/', (req,res)=>{
        res.json({message: 'Server is running'})
    })

    const gqlServer= await createApolloGraphqlServer();
    
    app.use("/graphql", expressMiddleware(gqlServer));  // expressMiddleware returns response in json format so we need to express.json() middleware

    app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))

}

init();