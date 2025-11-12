const express = require('express');

const upload = require('../middlewere/uploadImages');
const { varifyToken, varifyRole } = require('../middlewere/varifyToken');
const { getAllUsers,updateUser,deleteUser } = require('../controller/managerController');

const router = express.Router();


router.get("/getAllUsers", varifyToken, varifyRole(['Manager', 'Admin']), getAllUsers);

router.put("/updateUser", varifyToken, varifyRole(['Manager', 'Admin']), upload.single('profile'), updateUser);
router.delete("/deleteUser", varifyToken, varifyRole(['Manager', 'Admin']), deleteUser);

module.exports = router;
