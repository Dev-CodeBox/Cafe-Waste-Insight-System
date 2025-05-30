const Admin = require('../models/admin.schema');
const bcrypt = require('bcrypt');
const validator = require('validator');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        } else {
            if (!password) {
                return res.status(400).json({ success: false, message: 'Password is required' });
            }
            if (password.length < 6) {
                return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new Admin({
                name,
                email,
                password: hashedPassword,
                role
            });
            await newAdmin.save();
            return res.status(201).json({ success: true, message: 'Admin created successfully' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = signup;