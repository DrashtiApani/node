const express=require("express");
const passport = require("passport");
const { loginPage, loginUser , logoutUser, forgotPassword, sendEmailWithOtp, verifyOtp, resetPassword , resetPasswordPage,changePasswordPage,changePassword , profilePage} = require("../controllers/authCtr");
const { body } = require("express-validator");
const routes=express.Router();


routes.get('/',loginPage)
// validation ke lia
// routes.post('/login', passport.authenticate('local', { failureRedirect: '/' }), [
//     body("email").isEmail().withMessage("Please enter a valid email"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
// ], loginUser);
routes.post('/login', passport.authenticate('local', { failureRedirect: '/' }), loginUser);

routes.get('/logout',logoutUser)
routes.get('/forgotPassword',forgotPassword)
routes.post('/send-email',sendEmailWithOtp)
routes.post('/verify-otp',verifyOtp)
routes.get('/verify-otp',verifyOtp)
routes.post('/reset-password',resetPassword)
routes.get('/resetPassword',resetPasswordPage)
routes.get('/change-password',changePasswordPage)
routes.post('/change-password',changePassword)
routes.get('/profile',profilePage)


routes.use('/admin',passport.checkAdmin, require('./admin_Routes'))
routes.use("/blog", require("./blog_Routes"));
routes.use("/webpage",require("./webpage_Routes"))

module.exports=routes;