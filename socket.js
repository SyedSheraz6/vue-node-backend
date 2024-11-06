const { Server } = require('socket.io')

let io;

exports.init = server => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    })

    return io
}

exports.getIo = () => {
    if(!io) {
        throw new Error('socket.io connection not established!')
    }
    return io
}