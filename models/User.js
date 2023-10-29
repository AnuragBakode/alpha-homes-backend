const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true,
        min : 8,
        max : 15
    },

    role : {
        type : String,
        required : true
    }, 

    contact : {
        type : String,
        required : true
    }, 

    requests : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Request'
    }]
})

module.exports = mongoose.model("User" , UserSchema)