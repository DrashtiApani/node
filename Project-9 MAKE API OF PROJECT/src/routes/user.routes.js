const express = require('express');
const { registerUser, loginUser, myProfile, editProfile, deleteUser } = require('../controller/userController');
const upload = require('../middlewere/uploadImages');

const { varifyRole,varifyToken } = require('../middlewere/varifyToken');

const router = express.Router();

router.post("/register", upload.single('profile'), registerUser);
router.post("/login", loginUser);
router.get("/myProfile", varifyToken, myProfile);
router.put("/editProfile", varifyToken,varifyRole, upload.single('profile'), editProfile);
router.delete("/deleteUser", varifyToken, deleteUser);
    
module.exports = router;
