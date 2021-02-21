const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../../Models/User')
const {generateTokens } = require('./tokens')

passport.use("google",new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3001/api/users/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
      try
//check if the user is already in our db
{
    let user = await User.findOne({google_id:profile.id})
if(!user){
    const newUser = new User({
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        email:profile.emails[0].value,
        photo:profile.photos[0].value,
        google_id:profile.id
    })
    user = await newUser.save()
  
} 
 //generate an accessToken with the user information
    //generate a refeshToken to re-generate the accessToken
const tokens = generateTokens(user)
user.refreshToken = tokens.refreshToken
done(null,{user,tokens})

    } catch(err){
done(err,null)
    }
  }));

passport.serializeUser(function(user,done){done(null,user)})
module.exports = passport