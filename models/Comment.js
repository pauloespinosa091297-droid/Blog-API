const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required']
    },
    author: {
        // References the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    post: {
        // References the Post model — this tells us which post the comment belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post reference is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
