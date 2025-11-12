const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');


exports.addComment = async (req, res) => {
  try {
    const { text, recipeId } = req.body;

if (!text || !recipeId) {
  return res.status(400).json({ message: "Missing required fields: text or recipeId" });
}

if (!mongoose.Types.ObjectId.isValid(recipeId)) {
  return res.status(400).json({ message: "Invalid recipe ID" });
}

const recipeExists = await Recipe.findById(recipeId);
if (!recipeExists) return res.status(404).json({ message: "Recipe not found" });

const comment = new Comment({
  text,
  author: req.user._id,
  recipe: recipeId
});
await comment.save();

recipeExists.comments.push(comment._id);
await recipeExists.save();

res.status(201).json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding comment" });
  } 
};

exports.getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    const comments = await Comment.find({ recipe: recipeId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json({ message: "Comments fetched", comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid comment ID" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Comment.findByIdAndDelete(id);
    await Recipe.findByIdAndUpdate(comment.recipe, { $pull: { comments: comment._id } });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
