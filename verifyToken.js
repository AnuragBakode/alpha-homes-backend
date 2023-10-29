const jwt = require('jsonwebtoken')

const  verifyUser = function(req , res , next){
    const token = req.header('token')
    if(!token) return res.send({status : 401 , message : 'Access Denied'})

    try {
        const verified = jwt.verify(token , process.env.TOKEN_SECRET , (err , res) => {
            if(err) {
                return "error"
            }
            return res
        })

        if(verified == 'error'){
            return res.send({status : 400  , message : 'You have login first to access this site'})
        }
        req.user = verified
    } catch (error) {
        res.send({status : 400 , message : "Invalid Credentials"})
    }

    next()
}

const verifyNGO = function(req , res , next){
    const token = req.header('token')
    if(!token) return res.send({status : 401 , message : 'Access Denied'})
    try{
        const verified = jwt.verify(token , process.env.TOKEN_SECRET_NGO , (err , res) => {
            if(err) {
                return "error"
            }
            return res
        })

        if(verified == 'error'){
            return res.send({status : 400  , message : 'You have login first as a NGO to access this site'})
        }
        req.user = verified
    }catch{
        res.send({status : 400 , message : "Invalid Credentials"})
    }
    next()
}

module.exports.verifyUser = verifyUser
module.exports.verifyNGO = verifyNGO