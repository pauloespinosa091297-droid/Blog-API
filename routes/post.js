const express = require('express');
const postController = require('../controllers/post');
const { verify } = require('../auth');

const router = express.Router();

// Public routes — no token needed
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);

// Protected routes — token required (verify middleware)
router.post('/', verify, postController.createPost);
router.patch('/:id', verify, postController.updatePost);
router.delete('/:id', verify, postController.deletePost);

module.exports = router;
