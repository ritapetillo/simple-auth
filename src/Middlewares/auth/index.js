const { error } = require("node-error-handler/lib/logger")
const { verifyToken } = require("../../Lib/auth/tokens")
const User = require("../../Models/User")

const isAuthorized = async (req,res,next) =>{

  try { 
      console.log(req.cookies)
      console.log('isauth function')
    const {accessToken} = req.cookies
    console.log(accessToken)
    const decoded = verifyToken(accessToken,'access')
    console.log(decoded)
    if(!decoded) throw error
    const user = await User.findById(decoded.id)
    if(!user) throw error
    req.user = user
next()

    }catch(err){
        const error = new Error('You are not authorized')
        error.code = 401
        next(error)
    }



}

module.exports = {isAuthorized}