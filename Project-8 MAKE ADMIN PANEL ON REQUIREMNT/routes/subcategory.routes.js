const express = require("express");
const routes = express.Router();

// const subcategorymodel=require("../models/subcategorymodel")
const subcategoryctl=require("../controllers/subcategoryctl")

routes.get("/addsubcategory",subcategoryctl.addsubcategorypage)
routes.post("/addsubcategory",subcategoryctl.addsubcategory)
routes.get("/viewsubcategory",subcategoryctl.viewsubcategory)

// Edit & Update
routes.get("/editsubcategory/:id", subcategoryctl.editsubcategorypage)
routes.post("/updatesubcategory/:id", subcategoryctl.updatesubcategory)

// Delete
routes.get("/deletesubcategory/:id", subcategoryctl.deletesubcategory)

module.exports = routes;