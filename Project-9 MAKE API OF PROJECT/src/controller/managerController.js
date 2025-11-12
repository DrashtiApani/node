const userModel = require("../model/user.model");
const fs = require("fs");
const path = require("path");


exports.getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find({ role: "Manager", isDelete: false }).select("-password");
        return res.json({ message: "All Users", status: 200, data: users });
    } catch (err) {
        console.log("GetAll Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};

exports.updateUser = async (req, res) => {
    try {
        if (!req.body) req.body = {};

        let user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.json({ message: "User not found", status: 404 });

        if (req.file) {
            if (user.profile !== "") {
                const imagePath = path.join(__dirname, "..", user.profile);
                fs.unlinkSync(imagePath);
            }

            req.body.profile = `/uploads/${req.file.filename}`;
        }

        user = await userModel.findByIdAndUpdate(user._id, req.body, { new: true });

        return res.json({ message: "User updated successfully", status: 200, data: user });
    } catch (err) {
        console.log("Update Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};


// ✅ Soft Delete User (manager can delete only normal users)
exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ message: "Email is required", status: 400 });

        let user = await userModel.findOne({ email, isDelete: false });
        if (!user) return res.json({ message: "User not found", status: 404 });

        if (user.role !== "user") return res.json({ message: "Cannot delete Manager/Admin", status: 403 });

        if (user.profile !== "") {
            const imagePath = path.join(__dirname, "..", user.profile);
            fs.unlinkSync(imagePath);
        }

        user = await userModel.findByIdAndUpdate(user._id, { isDelete: true }, { new: true });

        return res.json({ message: "User soft deleted successfully", status: 200, data: user });
    } catch (err) {
        console.log("Delete Error:", err);
        return res.json({ message: "Server Error", status: 500 });
    }
};
