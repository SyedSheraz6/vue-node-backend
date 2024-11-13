const express = require('express')
const { body } = require('express-validator')

const userControllers = require('../controllers/user')

const router =  express.Router()

router.post('/signup',
    [
        body('name').trim().isLength({min:4}).withMessage('Name must be atleast 4 characters long.'),
        body('email').trim().isEmail(),
        body('password').trim().isLength({min:4}).withMessage('Password must be atleast 4 characters long.')
    ], userControllers.signup)

router.post('/login',    [
    body('email').trim().isEmail(),
    body('password').trim().isLength({min:4}).withMessage('Password must be atleast 4 characters long.')
], userControllers.login)

router.post('/reset-link', userControllers.getResetLink)
router.post('/reset', userControllers.resetPassword)

module.exports = router