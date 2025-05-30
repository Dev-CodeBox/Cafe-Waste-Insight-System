const Admin = require('../models/admin.schema');
const bcrypt = require('bcrypt');
const validator = require('validator');


const resetPassword = async (req, res) => {
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
            const hashedPassword = await bcrypt.hash(password, 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            return res.status(201).json({ success: true, message: 'Password Reset successfully' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

module.exports = resetPassword;