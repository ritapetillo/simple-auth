const express = require('express')
const apiRouter = express.Router()
const userRoutes = require('./users')


apiRouter.use('/users',userRoutes)



module.exports = apiRouter