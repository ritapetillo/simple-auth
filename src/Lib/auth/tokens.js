const jwt = require('jsonwebtoken');
const User = require('../../Models/User');


const generateTokens = (user) =>{
    //return tokens (access and refresh) with decoded user
    
const accessToken = jwt.sign({
    id:user._id,
    email:user.email
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refrehToken = jwt.sign({
    id:user._id
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

  return {accessToken,refrehToken}

}

const verifyToken = (token, key)=>{
    let decoded
    if(key=='access'){
     decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } else if(key=='refresh'){

    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    }
    if(!decoded) return error
    return decoded
}

module.exports = {generateTokens,verifyToken}