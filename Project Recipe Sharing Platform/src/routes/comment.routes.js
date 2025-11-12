const express = require("express");
const router = express.Router();
const { addComment, getCommentsByRecipe, deleteComment } = require("../controller/comment.controller");
const { varifyToken } = require("../middleware/auth");

router.post("/", varifyToken, addComment);
router.get("/recipe/:recipeId", getCommentsByRecipe);
router.delete("/:id", varifyToken, deleteComment);

module.exports = router;
