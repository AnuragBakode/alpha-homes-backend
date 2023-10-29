const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const usersRoutes = require("./routes/users")
const {verifyUser} = require("./verifyToken")

const PORT = process.env.PORT || 4000

// Initialising App
const app = express();

// Configuring Environment variables
dotenv.config();

// Database Connection
mongoose.connect(process.env.MONGO_DB_CONNECT , {useNewUrlParser : true})
.then(()=> console.log("Db connected"))
.catch((e)=>console.log(e))

// MiddleWares
app.use(cors());
app.use(express.json());

//Configure Routes
app.use(authRoutes)
app.use(usersRoutes)

app.listen(PORT , (req , res) =>{
    console.log("Server Started listing on port " + PORT)
})

app.get("/" , verifyUser , (req , res) => {
    res.send({message: "Hello World!"})
})