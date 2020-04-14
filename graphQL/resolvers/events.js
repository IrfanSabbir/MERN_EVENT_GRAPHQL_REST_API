
const Event = require('../../models/event')
const User = require('../../models/user')

const {transformEvent} = require('./merge')



module.exports =  {
    events :async ()=>{
        try {
            const allEvents = await Event.find()
            return allEvents.map(event => {
                return transformEvent(event)
            })
        }
        catch (err) {
            console.log(err)
            throw err
        }
    },
    createEvents:async (args)=>{
        const userId= "5e9491512c74d435bcc157cd"
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
            return transformEvent(eventResult)
        }
        catch (err) {
            throw err
        }
    }
  

}