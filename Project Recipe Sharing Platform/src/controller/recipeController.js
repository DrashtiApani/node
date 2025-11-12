const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');

// create recipe
exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients = [], steps = [], image, cuisine, cookingTime } = req.body;
    const recipe = new Recipe({
      title, description, ingredients, steps, image, cuisine, cookingTime,
      author: req.user._id
    });
    await recipe.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { recipes: recipe._id } });
    res.status(201).json({ message: 'Recipe created', recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get all recipes
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.cuisine) filter.cuisine = req.query.cuisine;
    if (req.query.author) filter.author = req.query.author;

    const recipes = await Recipe.find(filter)
      .populate('author', 'username email')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username' } });

    res.json({ count: recipes.length, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get single recipe
exports.getById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username email')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username' } });
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    res.json({ recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get recipes of logged-in user
exports.getMine = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'username');
    res.json({ count: recipes.length, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// update recipe (owner or admin)
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const allowedFields = ['title','description','ingredients','steps','image','cuisine','cookingTime'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) recipe[field] = req.body[field];
    });
    await recipe.save();
    res.json({ message: 'Updated', recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete recipe (owner or admin)
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(recipe.author, { $pull: { recipes: recipe._id } });
    await Comment.deleteMany({ recipe: recipe._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const recipeId = req.params.id;

    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    if (!mongoose.Types.ObjectId.isValid(recipeId)) return res.status(400).json({ message: 'Invalid recipe ID' });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const comment = new Comment({ text, author: req.user._id, recipe: recipeId });
    await comment.save();

    recipe.comments.push(comment._id);
    await recipe.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
