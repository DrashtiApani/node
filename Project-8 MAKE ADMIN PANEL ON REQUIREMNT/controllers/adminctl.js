const AdminModel = require("../models/adminmodel");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');


// Dashboard
module.exports.godashboard = (req, res) => {
  try {
    res.render("dashboard");
  } catch (err) {
    console.log("Error loading dashboard:", err);
    res.redirect("/");
  }
};

// Add Admin Page
module.exports.addnewadmin = (req, res) => {
  try {
    const admin = req.cookies.admin || null;
   if(req.file) {
    req.body.profile = AdminModel.adminimage + "/" + req.file.filename;
   }
    res.render("addAdmin", { admin });
  } catch (err) {
    console.log("Error loading add admin page:", err);
    res.redirect("/admin/viewAdmin");
  }
};

// Insert Admin
module.exports.insertData = async (req, res) => {
  try {
    if (req.file) {
      req.body.profile = req.file.filename;
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    req.body.created_date = moment().format("YYYY-MM-DD HH:mm:ss");
    req.body.updated_date = moment().format("YYYY-MM-DD HH:mm:ss");
    req.body.name = req.body.fname + " " + req.body.lname;

    await AdminModel.create(req.body);
    res.redirect("/admin/viewAdmin");
  } catch (err) {
    console.log("Error inserting admin:", err);
    res.redirect("/admin/addAdmin");
  }
};


// View Admins// View Admins
// module.exports.viewnewadmin = async (req, res) => {
//   try {
//     const admin = req.cookies.admin || null;
//     const search = req.query.search || "";

//     const alladmin = await AdminModel.find({
//       $or: [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { city: { $regex: search, $options: "i" } },
//       ],
//     });

//     res.render("viewAdmin", { alladmin, admin, search }); // pass alladmin instead of adminData
//   } catch (err) {
//     console.log("Error viewing admins:", err);
//     res.redirect("/admin");
//   }
// };

// view
module.exports.viewnewadmin = async (req, res) => {
  try {
    const search = req.query.search || "";

    const alladmin = await AdminModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ],
    });

    const admin = req.cookies.admin || null; // agar header me admin info chahiye

    return res.render("viewAdmin", { alladmin, admin, search });
  } catch (err) {
    console.error("Error in viewnewadmin:", err);
    return res.redirect("/admin");
  }
};




// Delete Admin
module.exports.deleteadmin = async (req, res) => {
  try {
    const adminid = req.params.adminid;
    const adminrecord = await AdminModel.findById(adminid);

    if (adminrecord && adminrecord.profile) {
      const imagePath = path.join(__dirname, "..", adminrecord.profile);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await AdminModel.findByIdAndDelete(adminid);
    res.redirect("/admin/viewAdmin");
  } catch (err) {
    console.log("Error deleting admin:", err);
    res.redirect("/admin/viewAdmin");
  }
};

// Edit Admin Page
module.exports.editadmin = async (req, res) => {
  try {
    let admindata = await AdminModel.findById(req.params.adminid);
    if (admindata) {
      return res.render("admin/updateAdmin", { admindata });
    } else {
      console.log("Admin not found");
      return res.redirect("/admin/viewAdmin");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/viewAdmin");
  }
};

// Update Admin
module.exports.updateadmindata = async (req, res) => {
  try {
    const adminid = req.params.adminid;
    const admindata = await AdminModel.findById(adminid);

    if (!admindata) return res.redirect("/admin/viewAdmin");

    // If new file uploaded, delete old image
    if (req.file) {
      const imagePath = path.join(__dirname, "..", admindata.profile);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      req.body.profile = AdminModel.adminimage + "/" + req.file.filename;
    }

    req.body.name = req.body.fname + " " + req.body.lname;
    req.body.updated_date = moment().format("YYYY-MM-DD HH:mm:ss");

    await AdminModel.findByIdAndUpdate(adminid, req.body);
    res.redirect("/admin/viewAdmin");
  } catch (err) {
    console.log("Error updating admin:", err);
    res.redirect("/admin/viewAdmin");
  }
};
