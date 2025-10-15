const express = require("express");
const routes = express.Router();
const extracategoryctl = require("../controllers/extracategoryctl");
const extracategorymodel = require("../models/extracategorymodel");


routes.get("/addextracategory", extracategoryctl.addextracategory);

routes.get("/subcategory", extracategoryctl.subcategory);

routes.post("/insertextracategory", extracategorymodel.uploads, extracategoryctl.insertextracategory);

routes.get("/viewextracategory", extracategoryctl.viewextracategory);


routes.get("/deleteextracategory/:id", extracategoryctl.deleteextracategory);

routes.get("/editextracategory/:id", extracategoryctl.editextracategory);

routes.post("/updateextracategory/:id",extracategorymodel.uploads,extracategoryctl.updateextracategory
);


module.exports = routes;
