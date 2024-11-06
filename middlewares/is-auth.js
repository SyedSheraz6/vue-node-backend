const jwt = require('jsonwebtoken')
const SECRET_KEY = "MYsuperSecretsecretKEY"

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if (!authHeader  || authHeader === "Bearer undefined") {
        const error = new Error('Not Authenticated. Login first!')
        error.statusCode = 422
        throw error
    }

    const token = authHeader.split(" ")[1]
    
    if (!token) {
        const error = new Error('Not Authenticated. Login first!')
        error.statusCode = 422
        throw error
    }
    let authToken;
    try {
        authToken = jwt.verify(token, SECRET_KEY)
    } catch (error) {
        
        error.statusCode = 500
        throw error
    }

    if(!authToken) {
        const error = new Error('Not Authenticated. Login first!')
        error.statusCode = 422
        throw error
    }
    req.userId = authToken.userId
    next()
}

module.exports = isAuth