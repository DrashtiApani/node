const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');
const { varifyToken, varifyRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', recipeController.getAll);
router.get('/user/mine', varifyToken, recipeController.getMine);
router.get('/:id', recipeController.getById);
router.post('/', varifyToken, upload.single('image'), recipeController.createRecipe);
router.put('/:id', varifyToken, upload.single('image'), recipeController.updateRecipe);
router.delete('/:id', varifyRole(['admin', 'user']), recipeController.deleteRecipe);

module.exports = router;
