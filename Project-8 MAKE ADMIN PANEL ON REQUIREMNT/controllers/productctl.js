const Product = require("../models/productmodel");
const Category = require("../models/categorymodel");
const Subcategory = require("../models/subcategorymodel");
const ExtraCategory = require("../models/extracategorymodel");
const fs = require("fs");
const path = require("path");

// Add Product Page
module.exports.addproduct = async (req, res) => {
    const category = await Category.find();
    const subcategory = await Subcategory.find();
    const extracategory = await ExtraCategory.find();

    res.render("product/addProduct", { category, subcategory, extracategory });
};

// Insert Product
module.exports.insertproduct = async (req, res) => {
    try {
        if (req.file) req.body.productimage = "/uploads/productimages/" + req.file.filename;
        await Product.create(req.body);
        res.redirect("/product/viewproduct");
    } catch (err) {
        console.log("Error inserting product:", err);
        res.status(500).send("Internal Server Error");
    }
};

// View All Products
module.exports.viewproduct = async (req, res) => {

    const products = await Product.find()
        .populate("category")
        .populate("subcategory")
        .populate("extracategory");
    res.render("product/viewProduct", { products });

};

// View Single Product (Read More)
module.exports.viewSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("subcategory")
            .populate("extracategory");
        res.render("product/singleProduct", { product });
    } catch (err) {
        console.log(err);
        res.redirect("/product/viewproduct");
    }
};

// Delete Product
module.exports.deleteproduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product && product.productimage) {
            const imagePath = path.join(__dirname, "..", product.productimage);
            fs.unlinkSync(imagePath);
        }
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/product/viewproduct");
    } catch (err) {
        console.log("Error deleting product:", err);
        res.redirect("/product/viewproduct");
    }
};

// Edit Product Page
module.exports.editproduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const category = await Category.find();
    const subcategory = await Subcategory.find();
    const extracategory = await ExtraCategory.find();
    res.render("product/editProduct", { product, category, subcategory, extracategory });
};

// Update Product
module.exports.updateproduct = async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            subcategory: req.body.subcategory,
            extracategory: req.body.extracategory,
            quantity: req.body.quantity
        };
        if (req.file) updateData.productimage = "/uploads/productimages/" + req.file.filename;
        else {
            const old = await Product.findById(req.params.id);
            updateData.productimage = old.productimage;
        }
        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect("/product/viewproduct");
    } catch (err) {
        console.log("Error updating product:", err);
        res.redirect("/product/viewproduct");
    }
};

// Subcategory API
module.exports.subcategory = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        const subcategories = await Subcategory.find({ category: categoryId });
        res.json({ subcategories });
    } catch (err) {
        console.log(err);
        res.json({ error: "Error fetching subcategories" });
    }
};

// ExtraCategory API
module.exports.extracategory = async (req, res) => {
    try {
        const subcategoryId = req.query.subcategoryId;
        const extracategories = await ExtraCategory.find({ subcategory: subcategoryId });
        res.json({ extracategories });
    } catch (err) {
        console.log(err);
        res.json({ error: "Error fetching extracategories" });
    }
};
