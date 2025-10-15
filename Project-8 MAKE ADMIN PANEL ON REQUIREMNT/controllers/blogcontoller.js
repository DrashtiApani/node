const BlogModel = require("../models/blogmodel");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Render Add Blog Page
exports.addBlog = (req, res) => {
  res.render("blog/addBlog");
};

// Insert Blog
exports.insertBlog = async (req, res) => {
  try {
    if (req.file) req.body.image = BlogModel.blogimage + "/" + req.file.filename;
    req.body.created_date = req.body.updated_date = moment().format("YYYY-MM-DD HH:mm:ss");
    await BlogModel.create(req.body);
    res.redirect("/blog/viewBlog");
  } catch (err) {
    console.log(err);
    res.redirect("/blog/addBlog");
  }
};

// View Blogs
exports.viewBlog = async (req, res) => {
  try {
    const search = req.query.search || "";
    const allblog = await BlogModel.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ]
    });

    const formattedBlogs = allblog.map(blog => ({
      ...blog._doc,
      created_date: moment(blog.created_date).format("DD MMM YYYY, h:mm A")
    }));

    res.render("blog/viewBlog", { allblog: formattedBlogs });
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
};

// Render Edit Blog Page
exports.editBlog = async (req, res) => {
  try {
    const blogdata = await BlogModel.findById(req.params.blogid);
    if (blogdata) res.render("blog/updateBlog", { blogdata });
    else res.redirect("/blog/viewBlog");
  } catch (err) {
    console.log(err);
    res.redirect("/blog/viewBlog");
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const blogdata = await BlogModel.findById(req.params.blogid);
    if (blogdata && req.file) {
      const imagePath = path.join(__dirname, "..", blogdata.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      req.body.image = BlogModel.blogimage + "/" + req.file.filename;
    }
    req.body.updated_date = moment().format("YYYY-MM-DD HH:mm:ss");
    await BlogModel.findByIdAndUpdate(req.params.blogid, req.body);
    res.redirect("/blog/viewBlog");
  } catch (err) {
    console.log(err);
    res.redirect("/blog/viewBlog");
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogdata = await BlogModel.findById(req.params.blogid);
    if (blogdata && blogdata.image) {
      const imagePath = path.join(__dirname, "..", blogdata.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await BlogModel.findByIdAndDelete(req.params.blogid);
    res.redirect("/blog/viewBlog");
  } catch (err) {
    console.log(err);
    res.redirect("/blog/viewBlog");
  }
};

// View Full Blog Page
exports.viewFullBlog = async (req, res) => {
  try {
    const blogdata = await BlogModel.findById(req.params.blogid);
    if (blogdata) {
      const formattedDate = moment(blogdata.created_date).format("DD MMM YYYY, h:mm A");
      res.render("blog/viewFullBlog", { blogdata, formattedDate });
    } else {
      res.redirect("/blog/viewBlog");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/blog/viewBlog");
  }
};
