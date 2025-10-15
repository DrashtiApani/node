const express = require("express");
const router = express.Router();
const productctl = require("../controllers/productctl");
const Product = require("../models/productmodel");

router.get("/addproduct", productctl.addproduct);
router.post("/insertproduct", Product.uploads, productctl.insertproduct);

router.get("/viewproduct", productctl.viewproduct);

router.get("/viewproduct/:id", productctl.viewSingleProduct);

router.get("/editproduct/:id", productctl.editproduct);
router.post("/updateproduct/:id", Product.uploads, productctl.updateproduct);

router.get("/deleteproduct/:id", productctl.deleteproduct);

// APIs
router.get("/subcategory", productctl.subcategory);
router.get("/extracategory", productctl.extracategory);

module.exports = router;
