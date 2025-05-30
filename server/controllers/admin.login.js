const Admin = require('../models/admin.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require('dotenv');
dotenv.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        } else {
            if (!password) {
                return res.status(400).json({ success: false, message: 'Password is required' });
            }
            if (password.length < 6) {
                return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
            }
            const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: 'Invalid password' });
            } else {
                const token = jwt.sign(
                    { id: existingAdmin._id, role: existingAdmin.role, email: existingAdmin.email, name: existingAdmin.name },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000
                }).status(200).json({ success: true, message: 'Login successful' });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = login;