const express = require("express");
const routes = express.Router();
const categoryctl = require("../controllers/categoryctl")
const categorymodel = require("../models/categorymodel");

routes.get("/addcategory",categoryctl.addcategory);

routes.post("/insertcategory",categorymodel.uploads,categoryctl.insertcategory)

routes.get("/viewcategory",categoryctl.viewcategory);

routes.get("/deletecategory/:id", categoryctl.deletecategory);

routes.get("/editcategory/:id",categoryctl.editcategory);

routes.post("/updatecategory/:id", categorymodel.uploads, categoryctl.updatecategory);

module.exports = routes;