const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const homeRoutes = require('./routes/home')
const app = express()

const MONGOD_DB_URL = 'mongodb+srv://sherazsyed16:TwkxBkv21biHhcNA@cluster0.fwxks.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0'

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})



app.use(homeRoutes)


mongoose.connect(MONGOD_DB_URL).then(()=>{
    console.log('Connected')
    app.listen(3000)
})
