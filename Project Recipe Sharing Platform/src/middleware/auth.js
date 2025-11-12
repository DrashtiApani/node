// src/middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const cookieName = process.env.COOKIE_NAME || 'token';
const jwtSecret = process.env.JWT_SECRET || 'replace_with_secret';

exports.varifyToken = async (req, res, next) => {
  try {
    // 1) Try cookie first
    let token = null;
    if (req.cookies && req.cookies[cookieName]) {
      token = req.cookies[cookieName];
    }

    // 2) Fallback to Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized user", status: 401 });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id || decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user", status: 401 });
    }

    req.user = user;
    // console.log("Decoded user:", req.user.username, req.user.role);
    next();
  } catch (err) {
    console.log("Verify Token Error:", err);
    return res.status(401).json({ message: "Invalid Token", status: 401 });
  }
};

exports.varifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (roles.includes(req.user.role)) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied: insufficient role", status: 403 });
    }
  };
};
