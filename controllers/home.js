const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

const Post = require('../models/post')
const User = require('../models/user')

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
        res.status(200).json({
            message: 'Post fetched successfully!',
            data: posts,
        })
    } catch (error) {
        next(error)
    }

}

exports.createPost = async (req, res, next) => {
    const title = req.body.title
    const subject = req.body.subject
    const message = req.body.message
    const creator = req.userId
    const imageUrl = req.file.path

    // imageUrl = imageUrl.replace(/\\/g, '/');

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Invalid input!',
            errors: errors.array(),
        })
    } else {
        const post = new Post({
            title,
            subject,
            message,
            imageUrl,
            creator
        })
        try {
            await post.save()
            const user = await User.findById(creator)
            user.posts.push(post._id)
            await user.save()
            res.status(200).json({
                message: 'Post created successfully!',
                data: post,
            })
        } catch (error) {
            next(error)
        }
    }


}

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId

    const title = req.body.title
    const subject = req.body.subject
    const message = req.body.message
    const imageUrl = req.file.path

    const errors = validationResult(req)

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Your input is invalid')
            error.statusCode = 422
            throw error
        }

        const post = await Post.findById({ _id: postId })
        if (!post) {
            const error = new Error("Post not fetched!")
            error.statusCode = 404
            throw error
        }
        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error("Not Authorized to update this post")
            error.statusCode = 401
            throw error
        }
        if(post.imageUrl !== imageUrl) {
            clearIamge(post.imageUrl)
        }
        post.title = title
        post.subject = subject
        post.message = message
        post.imageUrl = imageUrl

        await post.save()
        res.status(200).json({
            message: 'Message updated successfully!',
            data: post,
        })

    } catch (error) {
        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId
    try {
        const post = await Post.findOne({ _id: postId })
        if (!post) {
            const error = new Error("Post not found")
            error.statusCode = 404
            throw error
        }
        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error("Not Authorized to delete this post")
            error.statusCode = 401
            throw error
        }
        await Post.deleteOne({ _id: postId })
        clearIamge(post.imageUrl)
        const user = await User.findById(req.userId)
        user.posts.pull(postId)
        await user.save()
        res.status(200).json({
            message: 'Post deleted successfully',
            data: post,
        })

    } catch (error) {
        next(error)
    }

}

const clearIamge = imagePath => {
    const image = path.join(__dirname, '..' , imagePath)
    fs.unlink(image, err => {
        console.log(err)
    })
}