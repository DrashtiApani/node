const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, cb) => {
    let adminRec = await adminModel.findOne({ email: email });
    if (adminRec) {
        let matchPassword = await bcrypt.compare(password, adminRec.password);
        if (matchPassword) {
            cb(null, adminRec);
        } else {
            cb(null, false)
        }
    } else {
        cb(null, false)
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    let adminRec = await adminModel.findById(id);
    if (adminRec) {
        cb(null, adminRec);
    }
});


passport.checkAdmin = (req,res,next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
}

passport.setAuthenticateUser = (req,res,next) => {
    if(req.user) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;