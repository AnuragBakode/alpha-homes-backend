const express = require("express")
const router = express.Router()
const dotenv =  require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Importing Validation
const {registerValidation , loginValidation} = require("../validation")

// Configuring dot env
dotenv.config();

// Authentication Routes
router.post("/register" , async (req , res) => {
    const {error} = registerValidation(req.body)

    // Check for validation 
    if(error){
        return res.send({status : 400 , message : error.details[0].message})
    }

    // Check if Email already exists or not
    const emailExists = await User.findOne({email : req.body.email})

    if(emailExists) return res.send({status : 400 , message : "User already Exists"})
    
    // And if not exists create new user with given details and store it in the database
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create User 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role : req.body.role,
        contact : req.body.contact
    });

    try{
        const savedUser = await user.save();
        res.send({status : 200 , message : "Account Created Successfully"})
    }catch{
        res.send({status : 400 , message : "Something went Wrong"})
    }
})

router.post("/login" , async (req , res) => {
    const {error} = loginValidation(req.body)
    // Check for validation 
    if(error){
        return res.send({status : 400 , message : error.details[0].message})
    }

    // Check if the email exists 
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.send({status : 400 , message : "Email doesn't exists"})

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.send({status : 400  , message : "Invalid Password"});

    try{
        // Create and assign token on the basis of role
        var token;
        if(user.role == 'user'){
            token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        }else{
            token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_NGO)
        }
        res.send({status : 200 , message : "LoggedIn Successfully" , 
        data : {
            token : token,
            role : user.role
        }
    })
    }catch{
        return res.send({ status : 500 , message : "Something went wrong, Try Again"})
    }
})

module.exports = router