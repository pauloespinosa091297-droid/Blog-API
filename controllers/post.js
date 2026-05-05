const Post = require('../models/Post');

// GET /posts  — anyone can view all posts
module.exports.getAllPosts = (req, res) => {
    return Post.find({})
        // populate replaces the author ID with the actual user object (only username and email)
        .populate('author', 'username email')
        .then(posts => res.status(200).send(posts))
        .catch(err => res.status(500).send({ message: err.message }));
};

// GET /posts/:id  — anyone can view a single post
module.exports.getPost = (req, res) => {
    return Post.findById(req.params.id)
        .populate('author', 'username email')
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Post not found' });
            }
            return res.status(200).send(post);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// POST /posts  — only logged-in users can create a post
module.exports.createPost = (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        // req.user.id comes from the JWT token decoded by the verify middleware
        author: req.user.id
    });

    return newPost.save()
        .then(result => res.status(201).send({
            message: 'Post created successfully',
            post: result
        }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// PATCH /posts/:id  — only the author can edit their post
module.exports.updatePost = (req, res) => {
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Post not found' });
            }

            // Check if the logged-in user is the author of the post
            if (post.author.toString() !== req.user.id) {
                return res.status(403).send({ message: 'You can only edit your own posts' });
            }

            post.title = req.body.title || post.title;
            post.content = req.body.content || post.content;

            return post.save();
        })
        .then(updated => res.status(200).send({
            message: 'Post updated successfully',
            post: updated
        }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// DELETE /posts/:id  — the author OR an admin can delete a post
module.exports.deletePost = (req, res) => {
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Post not found' });
            }

            const isAuthor = post.author.toString() === req.user.id;
            const isAdmin = req.user.isAdmin;

            // Allow deletion only if user is the author or an admin
            if (!isAuthor && !isAdmin) {
                return res.status(403).send({ message: 'Not allowed to delete this post' });
            }

            return Post.findByIdAndDelete(req.params.id);
        })
        .then(() => res.status(200).send({ message: 'Post deleted successfully' }))
        .catch(err => res.status(500).send({ message: err.message }));
};
