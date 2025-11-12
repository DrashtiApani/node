
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const recipeRoutes = require('./recipe');
const commentRoutes = require('./comment.routes');

router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
