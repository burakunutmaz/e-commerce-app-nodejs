const User = require('../models/user');

exports.getLogin = (req,res,next)=>{
    console.log(req.get('Cookie'));

    res.render('auth/login', {
    path: '/login',
    pageTitle: 'login',
    loggedIn: req.session.isLoggedIn});
};

exports.postLogin = (req,res,next)=>{
    User.findById('633aef27eb7588b750567cb3')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));

};