const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  author: { type: String },
  image: { type: String },
  content: { type: String },
  tags: { type: String },
  created_date: { type: String },
  updated_date: { type: String }
});

// static path for images
BlogSchema.statics.blogimage = "uploads/blogImages";

// multer storage
BlogSchema.statics.upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, BlogSchema.statics.blogimage);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
}).single("image");

const BlogModel = mongoose.model("Blog", BlogSchema);
module.exports = BlogModel;
