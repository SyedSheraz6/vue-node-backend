const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
// const { Server } = require('socket.io')
const cors = require('cors')
const{ init }  = require('./socket')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const homeRoutes = require('./routes/home')
const userRoutes = require('./routes/user')
const app = express()

const MONGOD_DB_URL = 'mongodb+srv://sherazsyed16:TwkxBkv21biHhcNA@cluster0.fwxks.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0'
app.use(bodyParser.json())
app.use(multer({storage:storage}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images' )))
app.use(cors())

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
    const server = app.listen(3000)
    const io = init(server)

    io.on('connection', (socket) => {
      console.log('a user connected');
    });
})
