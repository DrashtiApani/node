const express = require("express");
const {
    loginUser,
    loginPage,
    logoutUser,
    profilepage,
    changepassword,
    forgotpassword,
    sendMailWithOTP,
    verifyotp,
    resetpassword,
} = require("../controllers/authctl");

const adminroutes = require("./admin.routes");
const blogroutes = require("./blogroutes");
const categoryroutes = require("./category.routes");
const subcategoryroutes = require("./subcategory.routes.js");
const extracategoryroutes = require("./extracategoryroutes");
const productroutes = require("./product");

const routes = express.Router();
const passport = require("passport");

routes.get("/", loginPage);

routes.post("/login", passport.authenticate("local", { failureRedirect: "/" }), loginUser);
routes.get("/logout", logoutUser);

routes.get("/forgotpassword", forgotpassword);
routes.post("/sendMailWithOTP", sendMailWithOTP);

routes.post("/verifyotp", verifyotp);

routes.post("/resetpassword", resetpassword);

routes.post("/change-password", changepassword);

routes.get("/profile", profilepage);


routes.use("/admin", passport.checkAdmin, adminroutes);
routes.use("/blog", passport.checkAdmin, blogroutes);
routes.use("/category", passport.checkAdmin, categoryroutes);
routes.use("/subcategory", passport.checkAdmin, subcategoryroutes);
routes.use("/extracategory", passport.checkAdmin, extracategoryroutes);
routes.use("/product", passport.checkAdmin, productroutes);


module.exports = routes;
