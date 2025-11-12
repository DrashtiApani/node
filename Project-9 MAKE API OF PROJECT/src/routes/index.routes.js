const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const managerRoutes = require('./manager.routes');

router.use('/users', userRoutes);
router.use('/managers', managerRoutes);

module.exports = router;
