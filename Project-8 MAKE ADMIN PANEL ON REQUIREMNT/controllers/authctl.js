const mailMessage = require("../config/middleware/mailMessage");
const AdminModel = require("../models/adminmodel");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Login Page
module.exports.loginPage = (req, res) => {
  try {
    if(!req.isAuthenticated()){
      return res.render("Auth/login");
    }else{
      return res.redirect("/admin");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};

// ✅ Passport login handler
module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("Authentication error:", err);
      return next(err);
    }

    if (!user) {
      console.log("Invalid email or password");
      return res.redirect("/"); // back to login
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log("Login error:", err);
        return next(err);
      }

      console.log("✅ Login successful:", user.email);
      req.flash("success", "Login Successful");
      return res.redirect("/admin"); // go to dashboard
    });
  })(req, res, next);
};

// ✅ Logout
module.exports.logoutUser = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.log("Logout error:", err);
        return res.redirect("/admin");
      }
      req.session.destroy(() => {
        res.clearCookie("connect.sid"); // passport session cookie
        return res.redirect("/");
      });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};

// Forgot password page
module.exports.forgotpassword = async (req, res) => {
  try {
    return res.render("Auth/forgotpass");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// Send OTP
module.exports.sendMailWithOTP = async (req, res) => {
  try {
    let admin = await AdminModel.findOne({ email: req.body.email });
    if (!admin) return res.redirect("/");

    let otp = Math.floor(Math.random() * 10000);

    let msg = {
      from: "drashtiapani4@gmail.com",
      to: req.body.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    };

    await mailMessage.sendEmail(msg);
    res.cookie("otp", otp);
    res.cookie("email", req.body.email);

    return res.render("Auth/verifyotp");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// Verify OTP
module.exports.verifyotp = async (req, res) => {
  try {
    let otp = req.cookies.otp;
    if (otp == req.body.otp) {
      res.clearCookie("otp");
      return res.render("Auth/resetpassword");
    }
    return res.render("Auth/verifyotp");
  } catch (error) {
    console.log("OTP Error:", error);
    return res.redirect("/");
  }
};

// Reset password
module.exports.resetpassword = async (req, res) => {
  try {
    let { newpassword, conformpassword } = req.body;

    if (newpassword !== conformpassword) {
      return res.render("Auth/resetpassword");
    }

    let email = req.cookies.email;
    if (!email) {
      console.log("Email Not Found");
      return res.redirect("/verifyotppage");
    }

    let hashpass = await bcrypt.hash(newpassword, 10);
    await AdminModel.findOneAndUpdate({ email }, { password: hashpass });

    res.clearCookie("otp");
    res.clearCookie("email");

    console.log("✅ Password Reset Done");
    return res.redirect("/");
  } catch (error) {
    console.log("Reset Password Error:", error);
    return res.redirect("/resetpassword");
  }
};

// Change password
module.exports.changepassword = async (req, res) => {
  try {
    let admin = req.user; // ✅ now comes from Passport
    const { newpass, conformpass, oldpass } = req.body;

    let matchpassword = await bcrypt.compare(oldpass, admin.password);
    if (!matchpassword) {
      console.log("❌ Old password not matched");
      return res.redirect("/change-password");
    }

    if (newpass !== conformpass) {
      console.log("❌ New and confirm password not matched");
      return res.redirect("/change-password");
    }

    let hashpass = await bcrypt.hash(newpass, 10);
    await AdminModel.findByIdAndUpdate(admin._id, { password: hashpass });

    console.log("✅ Password Changed Successfully");
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log("Change Password Error:", error);
    return res.redirect("/change-password");
  }
};

// Profile page
module.exports.profilepage = async (req, res) => {
  try {
    let admin = req.user; // ✅ use Passport session
    if (admin) {
      return res.render("Auth/profilepage", { admin });
    }
    return res.redirect("/");
  } catch (error) {
    console.log("Profile Error:", error);
    return res.redirect("/");
  }
};
