const express = require("express");
const routes = express.Router();
const adminModel = require("../models/adminmodel");
const adminCtl = require("../controllers/adminctl");


routes.get("/adminpage", adminCtl.godashboard);
routes.get("/", adminCtl.godashboard);

routes.get("/addAdmin", adminModel.uploads, adminCtl.addnewadmin);
routes.post("/insertadmin", adminModel.uploads, adminCtl.insertData);

routes.get("/viewAdmin", adminCtl.viewnewadmin);

routes.get("/deleteAdmin/:adminid", adminCtl.deleteadmin);

routes.get("/editAdmin/:adminid", adminCtl.editadmin);
routes.post('/updateAdmin/:adminid', adminModel.uploads, adminCtl.updateadmindata);

module.exports = routes;
