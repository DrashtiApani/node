const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/blogcontoller");
const BlogModel = require("../models/blogmodel");

// Pages
router.get("/addBlog", BlogController.addBlog);
router.get("/viewBlog", BlogController.viewBlog);
router.get("/viewBlog/:blogid", BlogController.viewFullBlog); 
router.get("/editBlog/:blogid", BlogController.editBlog);
router.get("/deleteBlog/:blogid", BlogController.deleteBlog);

// Actions with multer
router.post("/insert", BlogModel.upload, BlogController.insertBlog);
router.post("/updateBlog/:blogid", BlogModel.upload, BlogController.updateBlog);

module.exports = router;
