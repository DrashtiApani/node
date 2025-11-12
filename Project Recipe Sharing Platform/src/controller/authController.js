
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const cookieName = process.env.COOKIE_NAME || 'token';
const jwtSecret = process.env.JWT_SECRET || 'replace_with_secret';
const jwtExpires = process.env.JWT_EXPIRES_IN || '7d';

const sendToken = (res, user) => {
  const payload = { id: user._id, role: user.role, username: user.username };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const user = new User({ username, email, password, role });
    await user.save();
    sendToken(res, user);
    res.status(201).json({ message: 'User registered', user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    sendToken(res, user);
    res.json({ message: 'Logged in', user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie(cookieName);
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
