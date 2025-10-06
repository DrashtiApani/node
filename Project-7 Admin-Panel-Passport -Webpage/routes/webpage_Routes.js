const express = require("express");
const routes = express.Router();

const webpageCtr = require("../controllers/webpageCtr");

routes.get("/", webpageCtr.webpage)
routes.get("/readMore/:id", webpageCtr.readMore)

module.exports = routes;
