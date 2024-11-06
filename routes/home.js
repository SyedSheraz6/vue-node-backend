const express = require('express')
const { body } = require('express-validator')

const homeControllers = require('../controllers/home')
const isAuth = require('../middlewares/is-auth')

const router = express.Router()


router.get('/', homeControllers.getPosts)
router.get('/my-posts', isAuth , homeControllers.getMyPosts)

router.post('/create', [
    body('title').trim().isLength({min: 4}).withMessage('Title should be atleast 4 characters'),
    body('subject').trim().isLength({min: 4 , max: 20}).withMessage('Subject should be between 4 and 20 characters'),
    body('message').trim().isLength({min: 4 , max: 120}).withMessage('Message should be between 4 and 120 characters'),
], isAuth, homeControllers.createPost)

router.put('/:postId', [
    body('title').trim().isLength({min: 4}).withMessage('Title should be atleast 4 characters'),
    body('subject').trim().isLength({min: 4 , max: 20}).withMessage('Subject should be between 4 and 20 characters'),
    body('message').trim().isLength({min: 4 , max: 120}).withMessage('Message should be between 4 and 120 characters'),
], isAuth, homeControllers.updatePost)

router.delete('/:postId', isAuth ,homeControllers.deletePost)

module.exports = router