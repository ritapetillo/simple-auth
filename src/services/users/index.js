const express = require('express');
const { error } = require('node-error-handler/lib/logger');
const passport = require('passport');
const { verifyToken, generateTokens } = require('../../Lib/auth/tokens');
const { isAuthorized } = require('../../Middlewares/auth');
const User = require('../../Models/User');
const userRoutes =express.Router()

userRoutes.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

userRoutes.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function(req, res) {
      try
   {   console.log(req.user) 
      const {accessToken, refrehToken} = req.user.tokens
      res.cookie('accessToken',accessToken,{httpOnly:true})
      res.cookie('refreshToken',refrehToken,{httpOnly:true})
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');} catch(err){
        console.log(err)
        next(err)
    }
  });

  userRoutes.get('/me', isAuthorized,async(req,res,next)=>{
      try{
          const {user} = req
           res.send(user)      

} catch(err){
          console.log(err)
      }
  })

  userRoutes.post('/auth/refresh',async(req,res,next)=>{
      try{
//we need to gran te refresh token
//verify that the refresh token is valid and it's in the db (user instance)
const {refreshToken} = req.cookies
const decoded = verifyToken(refreshToken,'refresh') 
const user = await User.findById(decoded.id)
const isRefreshValid = user.refreshToken == refreshToken
if(!isRefreshValid) throw error
//if it's valid, I want to generate a new set of refresh token and access token and I want to store the new refresh token in to
//user db refresh token
const tokens = generateTokens(user)
//set the new refresh token in the database
user.refreshToken = tokens.refreshToken
//send the cookies
res.cookie('accessToken',tokens.accessToken,{httpOnly:true})
res.cookie('refreshToken',tokens.refreshToken,{httpOnly:true})


      } catch(err){
          const error = new Error('You are not authorized')
          errpr.code = 401
          next(error)
      }
  })

  userRoutes.get('/auth/logout',async(req,res,next)=>{
    try{
        console.log('clearcookies')
        res.clearCookie('accessToken',{httpOnly:true})
        res.clearCookie('refreshToken',{httpOnly:true})
        res.redirect('http://localhost:3000')

} catch(err){
        console.log(err)
    }
})

module.exports = userRoutes