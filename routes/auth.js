const express = require('express');
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');
const router = express.Router();


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', check('email').isEmail(), authController.postSignup);

module.exports = router;