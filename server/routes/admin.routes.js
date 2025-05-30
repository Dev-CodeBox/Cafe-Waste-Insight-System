const express = require('express');
const router = express.Router();

// const signup = require('../controllers/admin.signup');
const login = require('../controllers/admin.login');
const resetPassword = require('../controllers/reset.password');
const logout = require('../controllers/admin.logout');

const authentication = require('../middlewares/authentication');
const dish = require('../controllers/dish');
const dailyInsight = require('../controllers/daily.insight');
const weeklyInsight = require('../controllers/weekly.insight');

// router.post('/signup', signup); //Used First Time To Register Admin
router.post('/login', login);
router.patch('/reset-password', resetPassword);
router.post('/logout', logout);

router.get('/authenticate', authentication, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

router.post('/dish', authentication, dish);
router.post('/daily-insight', authentication, dailyInsight);
router.post('/weekly-insight', authentication, weeklyInsight);

module.exports = router;