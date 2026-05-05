const express = require('express');
const commentController = require('../controllers/comment');
const { verify, verifyAdmin } = require('../auth');

const router = express.Router();

// Public — anyone can view comments
router.get('/:postId', commentController.getComments);

// Logged-in users can add a comment
router.post('/:postId', verify, commentController.addComment);

// Admin only — delete any comment
router.delete('/:id', verify, verifyAdmin, commentController.deleteComment);

module.exports = router;
