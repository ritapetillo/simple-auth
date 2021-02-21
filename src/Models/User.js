const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    photo:{
        type:String
    },
    google_id:{
        type:String
    },
    refreshToken:{
        type:String
    }

})

module.exports = mongoose.model('UserDB',UserSchema)