const express = require('express')
const { body } = require('express-validator')

const homeControllers = require('../controllers/home')

const router = express.Router()


router.get('/', homeControllers.getPosts)
router.post('/create', [
    body('title').trim().isLength({min: 4}).withMessage('Title should be atleast 4 characters'),
    body('subject').trim().isLength({min: 4 , max: 20}).withMessage('Subject should be between 4 and 20 characters'),
    body('message').trim().isLength({min: 4 , max: 120}).withMessage('Message should be between 4 and 120 characters'),
], homeControllers.createPost)
router.delete('/:postId', homeControllers.deletePost)
router.put('/:postId', homeControllers.updatePost)


module.exports = router