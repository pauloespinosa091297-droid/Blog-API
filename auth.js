const jwt = require('jsonwebtoken');
require('dotenv').config();

// Creates a token containing user info
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

// Middleware: checks if user sent a valid token
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === 'undefined') {
        return res.send({ auth: 'Failed. No Token' });
    }

    // Remove "Bearer " from the token string
    token = token.slice(7, token.length);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(403).send({
                auth: 'Failed',
                message: err.message
            });
        }
        // Store decoded user info so controllers can use it via req.user
        req.user = decodedToken;
        next();
    });
};

// Middleware: checks if the logged-in user is an admin
module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: 'Failed',
            message: 'Action Forbidden. Admins only.'
        });
    }
};
