const jwt = require('jsonwebtoken')

const authenticateUser =async (req, res, next) => {
    try  {
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        jwt.verify(token, 'karan', (err, user) => {
            if(err) {
                return res.status(403).json({message: 'Invalid token', data: {}});
            }
            req.user = user;
            next();
        })
    }catch(err) {
        res.status(500).json({message: err.message, data: {}})
    }
}

module.exports = {authenticateUser}