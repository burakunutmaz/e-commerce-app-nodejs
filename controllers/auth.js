const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req,res,next)=>{
    console.log(req.get('Cookie'));

    res.render('auth/login', {
    path: '/login',
    pageTitle: 'login',
    loggedIn: req.session.isLoggedIn});
};

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if (!user){
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
    res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    loggedIn:false})
};

exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (confirmPassword !== password){
        return res.redirect('/signup');
    } else {
        User.findOne({email: email})
            .then(userDoc => {
                if (userDoc){
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
                    });
            })
            .catch( err => console.log(err));
    }
};