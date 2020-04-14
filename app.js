const  express = require('express')
const bodyParser = require('body-parser') 
const mongoose =require('mongoose')
const graphqlHttp= require('express-graphql')

const graphQlSchema = require('./graphQL/schemas/index')

const graphQlResolver = require('./graphQL/resolvers/index')

const mongodb_URI =`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-bbsb6.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
const port =  process.env.port || 3000

const app = express()

app.use(bodyParser.json())



app.use('/graphql', graphqlHttp({
    schema:graphQlSchema,
    rootValue:graphQlResolver,
    graphiql:true

}))

mongoose.connect(
    mongodb_URI, 
    {useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(res=>{
        app.listen(port)
    })
    .catch(err=>console.log(err))



    // buildSchema(`
    //     type Event{
    //         _id:ID!
    //         title:String!
    //         description: String!
    //         price: Float!
    //         date: String!,
    //         createdBy:User!

    //     }
    //     type User{
    //         _id:ID!,
    //         email:String!
    //         password:String,
    //         createdEvents:[Event!]
    //     }

    //     input InputEvent{
    //         title:String!
    //         description: String!
    //         price: Float!
    //         date: String!
    //     } 
    //     input UserInput{
    //         email:String!
    //         password:String
    //     }

    //     type RootQuery{
    //         events:[Event!]!
    //     }

    //     type RootMutation{
    //         createEvents(inputEvent: InputEvent): Event
    //         createUser(userInput: UserInput): User
    //     }
    //     schema{
    //         query: RootQuery
    //         mutation: RootMutation
    //     }
     
    // `)
    // {
    //     events :()=>{
    //         return Event.find()
    //         .then(allEvents=>{
    //            return allEvents.map(event=>{

    //                return{
    //                    ...event.toObject(),
    //                    createdBy:()=>queryUser(event.createdBy)

    //                }
    //             })
    //         })        
    //         .catch(err=>{
    //             console.log(err)
    //             throw err

    //         })
    //     },
    //     createEvents:(args)=>{
    //         const userId= "5e9491512c74d435bcc157cd"
    //         let eventResult= null
    //         const event = new Event({
    //             title:args.inputEvent.title,
    //             description:args.inputEvent.description,
    //             price:+args.inputEvent.price,
    //             date: new Date(args.inputEvent.date),
    //             createdBy:userId
    //         })  
    //        return event.save()
    //        .then(result =>{
    //             eventResult = result
    //             console.log(eventResult)
    //             return User.findById(userId)
    //        })
    //        .then(user=>{
    //            console.log("be"+user)
    //             user.createdEvents.push(event)
    //             return user.save()
    //        })
    //        .then(userUpdates=>{
              
    //            console.log(eventResult)
    //            return {
    //                    ...eventResult.toObject(),
    //                     date: new Date(eventResult.date).toISOString(),
    //                     createdBy:()=>queryUser(eventResult.createdBy)
    //                 } 
    //        })
    //        .catch(err => {
    //            throw err
    //        })
    //     },
    //     createUser:(args)=>{
    //         return User.findOne({email: args.userInput.email})
    //         .then(user =>{
    //             if(user){
    //                 throw new Error("Email is taken")
    //             }
    //         return bcript.hash(args.userInput.password, 12)
    //         })
    //         .then(hashedPassword =>{
    //             const user= new User({
    //                email: args.userInput.email,
    //                password:hashedPassword
    //             })
    //             return user.save() 
    //         })
    //         .then(newUser=>{
    //             console.log(newUser)
    //             newUser.password=null
    //             return newUser
    //         })
    //         .catch(err=>{
    //             throw err
    //         })
    //     }

    // }