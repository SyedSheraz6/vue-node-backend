const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { validationResult } = require('express-validator')

const User = require('../models/user')

const SECRET_KEY = "MYsuperSecretsecretKEY"


exports.signup = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req)

    try {
        if(!errors.isEmpty()) {
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
        if(!errors.isEmpty()) {
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

        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, SECRET_KEY, { expiresIn: '2h' })

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