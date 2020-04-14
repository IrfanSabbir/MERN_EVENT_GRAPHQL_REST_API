
const Event = require('../../models/event')
const User = require('../../models/user')

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

const transformBooking = (booking)=>{
    return {
        ...booking.toObject(),
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.updatedAt).toISOString(),
        event:()=>singleEvent(booking.event),
        user: ()=> queryUser(booking.user)

    }

}
const transformEvent = (event)=>{
    return {
        ...event.toObject(),
        createdBy: () => queryUser(event.createdBy)
    }

}

exports.transformBooking = transformBooking
exports.transformEvent = transformEvent