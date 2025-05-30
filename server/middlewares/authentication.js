const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authentication = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = decoded;
            next();
        });
    }
}

module.exports = authentication;
