const {buildSchema} =require("graphql")


module.exports = buildSchema(`
type Booking {
    _id:ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event{
    _id:ID!
    title:String!
    description: String!
    price: Float!
    date: String!,
    createdBy:User!

}

type User{
    _id:ID!,
    email:String!
    password:String,
    createdEvents:[Event!]
}

input InputEvent{
    title:String!
    description: String!
    price: Float!
    date: String!
} 
input UserInput{
    email:String!
    password:String
}

type RootQuery{
    events:[Event!]!
    bookings:[Booking!]!
   
}

type RootMutation{
    createEvents(inputEvent: InputEvent): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!):Booking!
    cancleBooking(bookingId : ID!):Event !
    
}
schema{
    query: RootQuery
    mutation: RootMutation
}

`)