const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const error_handler = require('node-error-handler')
const apiRoutes = require('./services')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const server = express()
const PORT = process.env.PORT
require('./Lib/auth/auth_google')

const whiteList= ['http://localhost:3000']

//MIDDLEWARE
server.use(express.json())
server.use(cookieParser())

server.use(cors({
    origin:whiteList,
    credentials:true
}))
server.use(passport.initialize())

//ROUTE(S)
server.use('/api',apiRoutes)


//ERROR HANDLER
server.use(error_handler({ log: true, debug: true }));



//CONNECT TO SERVER
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then(res=>server.listen(PORT,()=>console.log('connect to '+ PORT)))