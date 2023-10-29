const mongoose = require("mongoose")

const RequestSchema = mongoose.Schema({
    imageURL : {
        type : String, 
        required: true
    },

    description : {
        type : String,
        required : true
    },

    location : {
        type : String,
        required : true
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    cloudinary_id : {
        type : String 
    }
}, {timestamps : true})

module.exports = mongoose.model("Request" , RequestSchema)