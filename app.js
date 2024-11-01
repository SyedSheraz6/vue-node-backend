const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


const homeRoutes = require('./routes/home')
const userRoutes = require('./routes/user')
const app = express()

const MONGOD_DB_URL = 'mongodb+srv://sherazsyed16:TwkxBkv21biHhcNA@cluster0.fwxks.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0'
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})


app.use(userRoutes)
app.use(homeRoutes)



//Error handling middleware
app.use((err,req,res,next)=>{
        res.status(err.statusCode || 500).json({
            message: err.message,
        }) 

}) 


mongoose.connect(MONGOD_DB_URL).then(()=>{
    console.log('Connected')
    app.listen(3000)
})
