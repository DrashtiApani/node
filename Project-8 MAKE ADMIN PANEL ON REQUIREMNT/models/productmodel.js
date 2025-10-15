const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const imagePath = "/uploads/productimages";

const productschema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    description:
    {
        type: String

    },
    price:
    {
        type: Number, required: true
    }, category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory",
        required: true,
    },
    extracategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "extracategory",

    },
    productimage: {
        type: String,

    },
    quantity: {
        type: Number,

    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", imagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

productschema.statics.uploads = multer({ storage: storage }).single("productimage");
productschema.statics.imagePath = imagePath;

const Product = mongoose.model("product", productschema);
module.exports = Product;
