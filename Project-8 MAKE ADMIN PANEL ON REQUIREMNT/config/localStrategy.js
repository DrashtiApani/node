

// const passport = require('passport')
// const localStratagy = require('passport-local').Strategy;
// const adminModel = require("../models/adminmodel")
// const bcrypt = require('bcrypt')

// passport.use(new localStratagy({
//     usernameField: "email"           // convert username to email
// }, async (email, password, cb) => {       // user ka email aur  password deta hai jab login request ati hai
//     let adminRecord = await adminModel.findOne({ email: email });
//     if (adminRecord) {
//         let matchPassword = await bcrypt.compare(password, adminRecord.password);
//         if (matchPassword) {
//             cb(null, adminRecord)    // cb batata hai autahntication success huaa hai ya nahi
//         } else {
//             cb(null, false)
//         }

//     } else {
//         cb(null,false)
//     }
// }))

// passport.serializeUser((user, cb) => {
//     cb(null, user._id)      // session me sirf id store karenge
// })

// passport.deserializeUser(async (id, cb) => {
//     let adminRecord = await adminModel.findById(id);
//     if (adminRecord) {
//         cb(null, adminRecord)
//     }
// })

// passport.checkAdmin = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     return res.redirect("/");
// }

// passport.isAuthenticateUser = (req, res, next) => {
//     if(req.user){
//         res.locals.user = req.user;
//         next();
//     }
// }




// module.exports = passport;



const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AdminModel = require("../models/adminmodel");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {
    try {
      const adminRecord = await AdminModel.findOne({ email });
      if (!adminRecord) {
        return cb(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, adminRecord.password);
      if (!isMatch) {
        return cb(null, false, { message: "Incorrect password" });
      }

      return cb(null, adminRecord);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const adminRecord = await AdminModel.findById(id);
    cb(null, adminRecord);
  } catch (err) {
    cb(err);
  }
});

// ✅ Protect admin-only routes
passport.checkAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
};

// ✅ Add user into res.locals for views
passport.isAuthenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
