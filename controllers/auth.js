const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.NODEMAILER_KEY
    }
}));

exports.getLogin = (req,res,next)=>{
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
    path: '/login',
    pageTitle: 'login',
    errorMessage: message});
};

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if (!user){
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(match => {
                    if (match){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/login');
                })
                .catch(err => {
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err));

};

exports.postLogout = (req,res,next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getSignup = (req,res,next) => {
    let message = req.flash('error');

    if (message.length > 0){
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    errorMessage: message})
};

exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (confirmPassword !== password){
        req.flash('error', "Passwords don't match.")
        return res.redirect('/signup');
    } else {
        User.findOne({email: email})
            .then(userDoc => {
                if (userDoc){
                    req.flash('error', 'There is already a user with this email.')
                    return res.redirect('/signup');
                }
                return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            email: email,
                            password: hashedPassword,
                            cart: { items: [] }
                        });
                        return user.save();
                    })
                    .then(result => {
                        res.redirect('/login');
                        return transporter.sendMail({
                            to: email,
                            from: 'burakunutmaz32@gmail.com',
                            subject: 'Signup succeeded!',
                            html: '<h1>You successfully registered!</h1>'
                        }).catch(err => console.log(err));

                    });
            })
            .catch( err => console.log(err));
    }
};