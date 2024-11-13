const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Nodemailer = require("nodemailer");
const CryptoJS = require('crypto-js');

const { validationResult } = require('express-validator')

const User = require('../models/user')

const SECRET_KEY = "MYsuperSecretsecretKEY"

const transporter = Nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sherazsyed16@gmail.com',
        pass: 'cryi nmey jsfj xczw'
    }
});

const generateSecretToken = () => {
    const secretKey = "mySecretKeyForResetting";
    const timestamp = new Date().getTime(); // Get the current timestamp
    const token = CryptoJS.HmacSHA256(secretKey + timestamp, secretKey).toString();
    return token;
}


exports.signup = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req)

    try {
        if (!errors.isEmpty()) {
            const error = new Error("Invalid input!")
            error.statusCode = 422
            throw error
        }
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            const error = new Error("Email already exist!")
            error.statusCode = 403
            throw error
        }
        const hashedPw = await bcrypt.hash(password, 12)
        const user = new User({
            name: name,
            email: email,
            password: hashedPw
        })
        const registeredUser = await user.save()
        res.status(200).json({
            message: 'Account created successfully!',
            data: {
                name: registeredUser.name,
                userId: registeredUser._id
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req)

    try {
        if (!errors.isEmpty()) {
            const error = new Error("Invalid input!")
            error.statusCode = 422
            throw error
        }
        const user = await User.findOne({ email: email })

        if (!user) {
            const error = new Error("Email does not exist!")
            error.statusCode = 401
            throw error
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            const error = new Error("Your password is incorrect!")
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, SECRET_KEY, { expiresIn: '8h' })

        res.status(200).json({
            message: "Login successfull!",
            data: {
                token: token,
                email: user.email,
                name: user.name,
                userId: user._id.toString()
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.getResetLink = async (req, res, next) => {
    const email = req.body.email
    const token = generateSecretToken()
    const tokenExpiry = new Date().getTime() + 3600 * 1000;  // 1hour

    try {
        const user = await User.findOne({email: email})

        if(!user) {
            const error = new Error("This e-mail does not exist")
            error.statusCode = 401
            throw error
        }
    
        user.resetToken = token,
        user.resetTokenExpiry = tokenExpiry
    
        await user.save()
    
        transporter.sendMail({
            from: 'resetEmail@Testing.com',
            to: 'sherazsyed16@gmail.com',
            subject: 'Reset Password',
            html: `
                <span>Click on the link to reset your password: <a href='http://localhost:5173/${token}'>Reset Password</a> </span>
                <p>Best Regards,<br>The Team</p>`
        }, (error, info) => {
            if (error) {
                throw error
            }
            res.status(200).json({
                message:'Reset password link sent. Check your email!',
            })
        })
        
    } catch (error) {
        next(error)
    }
   
}

exports.resetPassword = async (req, res, next) => {
    const token = req.body.token
    const newPassword = req.body.password

    try {
        const user = await User.findOne({resetToken: token})

        if(!user) {
            const error = new Error("User not found or invalid token. Try getting a new token!")
            error.statusCode = 404
            throw error
        }
    
        const currentTimestamp = new Date().getTime();
    
        if(currentTimestamp > user.resetTokenExpiry) {
            const error = new Error("Token expired!")
            error.statusCode = 401
            throw error
        }

        if(token !== user.resetToken) {
            const error = new Error("Invalid token!")
            error.statusCode = 401
            throw error
        }

        const hashedPw = await bcrypt.hash(newPassword, 12)
        user.password = hashedPw
        await user.save()
        res.status(200).json({
            message: 'Password updated successfully',
        })

    } catch (error) {
        next(error)
    }
   
}