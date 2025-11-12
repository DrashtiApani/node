const userModel = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ✅ Register
exports.registerUser = async (req, res) => {
    try {
        const exist = await userModel.findOne({ email: req.body.email });
        if (exist) return res.json({ message: "User already exists", status: 400 });

        let imagePath = "";
        if (req.file) imagePath = `/uploads/${req.file.filename}`;

        const hashPass = await bcrypt.hash(req.body.password, 10);

        const user = await userModel.create({
            ...req.body,
            password: hashPass,
            profile: imagePath
        });

        return res.json({ message: "User registered successfully", status: 200, data: user });
    } catch (err) {
        console.log("Register Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        let users = await userModel.find({ isDelete: false }).select("-password")
        return res.json({ message: "ALL USER", status: 200, data: users })
    } catch (err) {
        console.log("Error", err);
        return res.json({ message: "server Error", status: 500 });
    }
}

// ✅ Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ message: "User not found", status: 404 });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: "Invalid credentials", status: 400 });

        const token = jwt.sign({ userId: user._id, role: user.role }, "testing", );

        return res.json({ message: "Login successful", status: 200, data: token });
    } catch (err) {
        console.log("Login Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};

// ✅ My Profile
exports.myProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) return res.json({ message: "User not found", status: 404 });

        return res.json({ message: "My Profile", status: 200, data: user });
    } catch (err) {
        console.log("MyProfile Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};

// ✅ Edit Profile
exports.editProfile = async (req, res) => {
    try {
        
        if (!req.body) req.body = {};

        let user = await userModel.findById(req.user._id);
        if (!user) return res.json({ message: "User not found", status: 404 });

        if (req.file) {
            if (user.profile && user.profile !== "") {
                const oldPath = path.join(__dirname, "../", user.profile);
                if (fs.existsSync(oldPath)) await fs.promises.unlink(oldPath);
            }
            req.body.profile = `/uploads/${req.file.filename}`;
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });

        return res.json({ message: "Profile updated successfully", status: 200, data: user });
    } catch (err) {
        console.log("Edit Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};

// ✅ Delete 
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        let user = await userModel.findById(userId);
        
        if (!user) return res.json({ message: "User not found", status: 404 });

        if (user.profile !== "") {
            const imagePath = path.join(__dirname, "..", user.profile);
            fs.unlinkSync(imagePath);
        }

        user = await userModel.findByIdAndUpdate(userId, { isDelete: true }, { new: true });

        return res.json({ message: "User soft deleted successfully", status: 200, data: user });
    } catch (err) {
        console.log("Delete Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};
