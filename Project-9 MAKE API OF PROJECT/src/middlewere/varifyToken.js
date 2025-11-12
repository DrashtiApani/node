const jwt = require('jsonwebtoken');
const userModel = require("../model/user.model");

// exports.varifyToken = async (req, res, next) => {
//     let authorization = req.headers.authorization;
//     if (!authorization) {
//         return res.json({ message: "Unauthorized user", status: 401 });
//     }
//     let token = authorization.split(" ")[1];
//     let { userId } = jwt.verify(token, "testing"); //token verify karva mate ane name same apu testing che a
//     let user = await userModel.findById(userId);
//     if (!user) {
//         return res.json({ message: "Unauthorized user", status: 401 });
//     }
//     req.user = user;

//     next();
//     console.log(varifyToken)
// }
exports.varifyToken = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization;
        if (!authorization) {
            return res.json({ message: "Unauthorized user", status: 401 });
        }

        let token = authorization.split(" ")[1];
        let { userId } = require("jsonwebtoken").verify(token, "testing"); // JWT verify
        let user = await require("../model/user.model").findById(userId); // DB se user

        if (!user) {
            return res.json({ message: "Unauthorized user", status: 401 });
        }

        req.user = user;

        // ✅ Debug log: req.user check karna ho to
        console.log("Decoded user:", req.user);

        next();
    } catch (err) {
        console.log("Verify Token Error:", err);
        return res.json({ message: "Invalid Token", status: 401 });
    }
};


exports.varifyRole = (roles) => {
    return (req, res, next) => {
       if(roles.includes(req.user.role)){
        next();
       }else{
        return res.json({ message: "Unauthorized user", status: 401 });
       }
    }
}