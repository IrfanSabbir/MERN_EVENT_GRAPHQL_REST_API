const bcript = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const queryEvent=async (event_Ids)=>{
    try {
        const events = await Event.find({ _id: event_Ids })
        return events.map(event => {
            return {
                ...event.toObject(),
                createdBy: () => queryUser(event.createdBy)
            }
        })
    }
    catch (err) {
        throw err
    }

}

const singleEvent=async (event_Id)=>{
    try {
        const event = await Event.findById(event_Id)
            return {
                ...event.toObject(),
                createdBy: () => queryUser(event.createdBy),
            }
    }
    catch (err) {
        throw err
    }

}

const queryUser = async (id)=>{
      try {
        const user = await User.findById(id)
        return {
            ...user.toObject(),
            createdEvents: () => queryEvent(user.createdEvents)
        }
    }
    catch (err) {
        throw err
    }
}

const treansformBooking = (booking)=>{
    return {
        ...booking.toObject(),
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.updatedAt).toISOString(),
        event:()=>singleEvent(booking.event),
        user: ()=> queryUser(booking.user)

    }

}
const treansformEvent = (event)=>{
    return {
        ...event.toObject(),
        createdBy: () => queryUser(event.createdBy)
    }

}



module.exports =  {
    events :async ()=>{
        try {
            const allEvents = await Event.find()
            return allEvents.map(event => {
                return treansformEvent(event)
            })
        }
        catch (err) {
            console.log(err)
            throw err
        }
    },
    bookings: async()=>{
        try{
            const bookings = await Booking.find()
            return bookings.map(booking=>{
                return treansformBooking(booking)
            })

        }
        catch(err){
            throw err

        }

    },
    createEvents:async (args)=>{
        const userId= "5e9491512c74d435bcc157cd"
        let eventResult= null
        const event = new Event({
            title:args.inputEvent.title,
            description:args.inputEvent.description,
            price:+args.inputEvent.price,
            date: new Date(args.inputEvent.date),
            createdBy:userId
        })  
       try {
            const eventResult = await event.save()
            const user = await User.findById(userId)
           
            user.createdEvents.push(event)
            const userUpdates = await user.save()
            return treansformEvent(eventResult)
        }
        catch (err) {
            throw err
        }
    },
    createUser:async (args)=>{
        try {
            const user = await User.findOne({ email: args.userInput.email })
            if (user) {
                throw new Error("Email is taken")
            }
            const hashedPassword = await bcript.hash(args.userInput.password, 12)
            const user_1 = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const newUser = await user_1.save()
            newUser.password = null
            return newUser
        }
        catch (err) {
            throw err
        }
    },
    bookEvent:async (args)=>{
        try{
            const event =await Event.findOne({_id:args.eventId})
            const booking = new Booking({
                event:event,
                user:"5e9491512c74d435bcc157cd"
            })
            const savedBooking = await booking.save()
            return treansformBooking(savedBooking)

        }
        catch(err){
            throw err

        }

    },
    cancleBooking: async (args)=>{
        try{
            let getBooking = await Booking.findById(args.bookingId).populate('event')
            
            const event=treansformEvent(getBooking.event)
            await Booking.deleteOne({_id:args.bookingId})
            return event

        }
        catch(err){
            throw err

        }
    }

}