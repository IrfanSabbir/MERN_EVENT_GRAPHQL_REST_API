const bookingsResolver =require('./booking')
const eventResolver =require('./events')
const authResolver =require('./auth')

const rootResolver={
    ...bookingsResolver,
    ...eventResolver,
    ...authResolver
}

module.exports = rootResolver