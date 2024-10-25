const Post = require('../models/post')
const { validationResult } = require('express-validator')

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
        res.status(200).json({
            message: 'Post fetched successfully!',
            data: posts,
        })
    } catch (error) {
        console.log(error)
    }

}

exports.createPost = async (req, res, next) => {
    console.log('create post')
    const title = req.body.title
    const subject = req.body.subject
    const message = req.body.message

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).json({
            message:'Invalid input!',
            errors: errors.array(),
        })
    } else {
        const post = new Post({
            title,
            subject,
            message
        })
        try {
            await post.save()
            res.status(200).json({
                message: 'Post created successfully!',
                data: post,
            })
        } catch (error) {
            console.log(error)
        }
    }


}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId

    const postExist = await Post.findById(postId)

    if (postExist) {
        const post = await Post.findByIdAndDelete(postId)
        res.status(200).json({
            message: 'Post deleted successfully',
            data: post,
        })
    }
    if (!postExist) {
        res.status(404).json({ message: 'Post not found' })
    }
}

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId

    const title = req.body.title
    const subject = req.body.subject
    const message = req.body.message

    try {
        const post = await Post.findById({_id: postId})
        if(!post) {
            res.status(404).json({message: 'Post not fetched!'})
        } else {
            post.title = title
            post.subject = subject
            post.message = message
            await post.save()
            res.status(200).json({
                message: 'Message updated successfully!',
                data: post,
            })
        }
    } catch (error) {
        console.log(error)
    }
}