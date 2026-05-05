const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth');

// POST /users/register
module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes('@')) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters' });
    }

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        // hashSync encrypts the password before saving to the database
        password: bcrypt.hashSync(req.body.password, 10)
    });

    return newUser.save()
        .then(result => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// POST /users/login
module.exports.loginUser = (req, res) => {
    if (!req.body.email.includes('@')) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    return User.findOne({ email: req.body.email })
        .then(result => {
            if (result === null) {
                return res.status(404).send({ message: 'No email found' });
            }

            // compareSync checks the plain text password against the encrypted one
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

            if (isPasswordCorrect) {
                return res.status(200).send({
                    message: 'User logged in successfully',
                    access: auth.createAccessToken(result)
                });
            } else {
                return res.status(401).send({ message: 'Incorrect email or password' });
            }
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// GET /users/details  (requires token via verify middleware)
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            // Hide the password before sending user data
            user.password = '';
            return res.status(200).send(user);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};
