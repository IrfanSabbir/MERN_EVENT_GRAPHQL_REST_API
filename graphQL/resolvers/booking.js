const bcript = require('bcryptjs')

const Event = require('../../models/event')
const Booking = require('../../models/booking')
const {transformBooking, transformEvent} = require('./merge')




module.exports =  {
    bookings: async()=>{
        try{
            const bookings = await Booking.find()
            return bookings.map(booking=>{
                return transformBooking(booking)
            })

        }
        catch(err){
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
            return transformBooking(savedBooking)

        }
        catch(err){
            throw err

        }

    },
    cancleBooking: async (args)=>{
        try{
            let getBooking = await Booking.findById(args.bookingId).populate('event')
            
            const event=transformEvent(getBooking.event)
            await Booking.deleteOne({_id:args.bookingId})
            return event

        }
        catch(err){
            throw err

        }
    }

}