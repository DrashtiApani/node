const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const localStrategy = require('../config/localStrategy');
const passport = require('passport');
const session = require('express-session');
const { sendEmail } = require('../config/mailMessage');
const { validationResult } = require('express-validator');  


module.exports.loginPage = (req,res) => {
  try {
    if(req.isAuthenticated()) {
      return res.redirect('/admin');
    }else {
      return res.render('Auth/login');
    }
  }catch(err){
    console.log(err);
    return res.redirect('/admin/formAdd');
  }
}

module.exports.loginUser = async(req,res) => {
  try {
    req.flash('success','Login successfully');
    return res.redirect('/admin');
  }catch(err){
    console.log(err);
    return res.redirect('/admin/formAdd');
  }
}

module.exports.logoutUser = (req,res) => {
    req.flash("logout", "You have logged out successfully!");

    
    req.session.destroy((err) => {
        if(err) {
            console.log("error destroy session", err);
            req.flash("error", "Something went wrong while logging out!");
            return res.redirect('/');
        } else {
            console.log("logout successfully");
            return res.redirect('/');
        }
    });
}

module.exports.forgotPassword = (req,res) => {
  try {
    return res.render('Auth/forgotPassword');
  }catch(err){
    console.log(err);
    return res.redirect('/admin/formAdd');
  }
}

module.exports.sendEmailWithOtp = async (req,res) => {
  try {
    let admin = await Admin.findOne({email : req.body.email});
    if(!admin) {
      console.log("Admin not found");
      return res.redirect('/');
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render('Auth/forgotPassword', { errors: errors.array() });
    }

    let Otp = Math.floor(Math.random() * 10000);
    console.log(Otp);

    let sendOtp = await sendEmail({
       from: "drashtiapani4@gmail.com",
      to: req.body.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is: <b>${Otp}</b></p>`,
    });
    res.cookie("otp",Otp);
    res.cookie("email",req.body.email);
    return res.render('Auth/verifyOtp');

    console.log("OTP sent successfully:", sendOtp.messageId);
  } catch (err) {
    console.log(err);
    return res.redirect('/admin/formAdd');
  }
};

module.exports.verifyOtp = (req,res) => {
  try {
    let otp = req.cookies.otp;
    if(otp == req.body.otp) {
      res.clearCookie("otp");
      return res.render('Auth/resetPassword');
    }else {
      console.log("OTP not match");
      return res.redirect('Auth/verifyOtp');
    }
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}

module.exports.verifyOtp = (req,res) => {
  try {
    return res.render('Auth/resetPassword');
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}

module.exports.resetPassword = async(req,res) => {
  try {
    let email = req.cookies.email;
    let admin = await Admin.findOne({email : email});
    if(!admin) {
      return res.redirect('/');
    }
    if(req.body.password == req.body.cpassword) {
      let hashPassword = await bcrypt.hash(req.body.password,10);
      await Admin.findByIdAndUpdate(admin._id,{password : hashPassword});
      res.clearCookie("email");
      return res.redirect('/');
    }else {
      console.log("Password not match");
      return res.redirect('/resetPassword');
    }
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}

module.exports.resetPasswordPage = (req,res) => {
  try {
    return res.render('Auth/resetPassword');
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}

module.exports.changePasswordPage = (req,res) => {
  try {
    let admin = req.user || req.cookies.admin;   // ✅ added
    return res.render('Auth/changePassword',{admin});
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}

module.exports.changePassword = async(req,res) => {
  try {
    let admin = req.user || req.cookies.admin;   // ✅ added
    const {oldPassword,newPassword,confirmPassword } = req.body;

    // DB se fresh data
    let dbAdmin = await Admin.findById(admin._id);
    if(!dbAdmin) {
      console.log("Admin not found");
      return res.redirect('/changePassword');
    }

    let matchPassword = await bcrypt.compare(oldPassword,dbAdmin.password);
    if(matchPassword) {
      if(newPassword == confirmPassword) {
        let hashPassword = await bcrypt.hash(newPassword,10);
        await Admin.findByIdAndUpdate(dbAdmin._id,{password : hashPassword});
        console.log("Password changed successfully");  
        return res.redirect('/admin');
      }else {
        console.log("New & confirmPassword not match");
        return res.redirect('/changePassword');
      }
    }else {
      console.log("Old password not match");
      return res.redirect('/changePassword');
    }
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}

module.exports.profilePage = (req,res) => {
  try {
    let admin = req.user || req.cookies.admin;   // ✅ added
    return res.render('Auth/profile',{admin});
  }catch(err) {
    console.log(err);
    return res.redirect('/');
  }
}
