const express = require("express")
const router = express.Router()
const dotenv =  require("dotenv")
const cloudinary = require("../cloudinary")
const Request = require("../models/Request")
const { verifyUser, verifyNGO } = require("../verifyToken")
const User = require("../models/User")
const multer = require("multer")
const upload = multer({ storage: multer.diskStorage({}) })

// Configuring dot env
dotenv.config();

// Routes

// Get all requests for a specific User
router.get('/getRequests', verifyUser ,async (req , res) => {
    try{
        const user = await User.findById(req.user._id).populate('requests')
        const requests = user.requests;
        res.send({status : 200 , message : "Requests loaded successfully" , data : requests})
    }catch{
        res.send({status : 400 , message : "Something went wrong you can try refreshing the page"})
    }
})

// Upload a request
router.post('/uploadRequest',verifyUser , upload.single('image') ,async (req , res) => {
    try{
        const result = cloudinary.uploader.upload(req.file.path)
        const request = new Request({
                description : req.body.description,
                location : req.body.location,
                imageURL : (await result).secure_url,
                owner : req.user._id,
                cloudinary_id : (await result).public_id
        })

        const savedRequest = await request.save();
        const user = await User.findById(req.user._id)
        user.requests.push(savedRequest)
        const updatedUser = user.save()
        res.send({status : 200 , message : "Request uploaded successfully"})
    }catch{
        res.send({status : 400 , message : "Something went wrong you may try again"})
    }
})

// Delete a request
router.delete("/deleteRequest/:id" , verifyUser ,async (req , res) => {
    try{
        const request = await Request.findById(req.params.id)
        await cloudinary.uploader.destroy(request.cloudinary_id)
        const owner = await User.findById(request.owner)
        let index = owner.requests.indexOf(request._id)
        console.log(owner._id)
        owner.requests.splice(index , 1)
        owner.save()

        await Request.deleteOne({_id : req.params.id})
        res.send({status : 200 , message  : "Request deleted Successfully"})
    }catch{
        res.send({status : 400 , message : "Something went wrong you can try again after some time"})
    }
})

// Get all requests for NGOs
router.get("/getRequestsNGO",verifyNGO , async (req , res) => {
    try{
        const requests = await Request.find()
        // Can not send the user details because of security concerns
        // Therefore for every request we have to seggregate requests detail and its specific owner details 
        //with only some necessery details like name and contact number only
        const result = await Promise.all(requests.map(async (request) => {
            const owner = await User.findById(request.owner)
            var ownerWithSpecificDetails = {
                name : owner.name,
                contact : owner.contact
            }
            return {...request._doc, ownerDetails: ownerWithSpecificDetails}
        }))
        res.send({status : 200 , message : "Requests Loaded Successfully" , data : result})
    }catch{
        res.send({status : 400 , messsage : "Something went wrong try reloading the page"})
    }
})


module.exports = router