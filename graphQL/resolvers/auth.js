const bcript = require('bcryptjs')
const User = require('../../models/user')



module.exports =  {
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
   
   

}