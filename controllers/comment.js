const Comment = require('../models/Comment');

// GET /comments/:postId  — anyone can view comments on a post
module.exports.getComments = (req, res) => {
    return Comment.find({ post: req.params.postId })
        .populate('author', 'username')
        .then(comments => res.status(200).send(comments))
        .catch(err => res.status(500).send({ message: err.message }));
};

// POST /comments/:postId  — only logged-in users can add a comment
module.exports.addComment = (req, res) => {
    const newComment = new Comment({
        content: req.body.content,
        author: req.user.id,
        // Store which post this comment belongs to
        post: req.params.postId
    });

    return newComment.save()
        .then(result => res.status(201).send({
            message: 'Comment added successfully',
            comment: result
        }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// DELETE /comments/:id  — admin only
module.exports.deleteComment = (req, res) => {
    return Comment.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).send({ message: 'Comment not found' });
            }
            return res.status(200).send({ message: 'Comment deleted successfully' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};
