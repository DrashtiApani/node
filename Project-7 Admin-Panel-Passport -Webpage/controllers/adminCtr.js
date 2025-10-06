const moment = require('moment');
const bcrypt = require('bcrypt');
const Admin = require('../model/adminModel');
const path = require('path');
const fs = require('fs');

module.exports.admin = async(req,res) => {
   try {
      return res.render('dashboards');
    
   }catch(err)
 {
    console.log(err);
    res.redirect('/admin');
 }
    
 }

 module.exports.addForm = async(req,res) => {
   try {  
    console.log("infoL ", req.user);
      req.flash('success','Admin Added Successfully');
        return res.render('addAdmin');
      // console.log(req.cookies);
   }catch(err)
 {
    console.log(err);
    res.redirect('/admin');
 }
    
 }

 module.exports.viewForm = async(req,res) => {
    try{
      
           var search ="";
       if(req.query.search) {
        search = req.query.search
      }
      let adminData = await Admin.find({
        // status: true,
         $or : [
        {
          name : {$regex : search,$options : 'i' }
        },
        {
          email : {$regex : search,$options : 'i' }
        },
        {
          city : {$regex : search,$options : 'i' }
        }
      ]     
      })
      console.log(adminData);
     
      return res.render('viewAdmin', {
        adminData
      });
    }catch(err){
        console.log(err);
        return res.redirect('/admin');
        
    }
 }

 module.exports.insertAdmin = async(req,res) => {
  try{
    console.log(req.body);
    console.log(req.file);
    if(req.file){
        req.body.profile = req.file.filename;
        req.body.create_date = moment().format('YYYY-MM-DD HH:mm:ss A');
        req.body.update_date = moment().format('YYYY-MM-DD HH:mm:ss A');
        req.body.password = await bcrypt.hash(req.body.password,10);
        req.body.name = req.body.fname + " " + req.body.lname;
    }
     let adminData = await Admin.create(req.body);
      console.log(adminData);
     if(adminData){
      console.log("data inserted");
      req.flash("success", "Admin Inserted Successfully");
      return res.redirect('/admin/viewPage');
     }  else {
        console.log("data not inserted");
        return res.redirect('/admin/formAdd');
     }
  }
  catch(err){
    console.log(err);
    return res.redirect('/admin');
    
  }
 }
//delete krne ke lia
 module.exports.deleteAdmin = async(req,res) => {
  try{
    let adminRecord = await Admin.findById(req.params.adminId);
    if(adminRecord){
     try{
          let imagePath = path.join(__dirname,'..','uploads',adminRecord.profile);
          fs.unlinkSync(imagePath)
     }
     catch(err){
       console.log(err);
       return res.redirect('/admin/formAdd');
     }
    }
    let deleteAdmin = await Admin.findByIdAndDelete(req.params.adminId);
    if(deleteAdmin) {
      console.log("Admin deleted");
      return res.redirect('/admin/viewPage');
      
    }else {
      console.log("Admin not deleted");
      return res.redirect('/admin/formAdd');
    }
  }catch(err){
    console.log(err);
    return res.redirect('/admin/formAdd');
    
  }
 }

 //edit
module.exports.editAdmin = async (req, res) => {
  try {
    // Passport se login hua user check
    if (req.user && req.user._id) {
      let admin = req.user; // passport se current admin
      let adminData = await Admin.findById(req.params.adminId);

      if (adminData) {
        return res.render('updateAdmin', {
          adminData,
          admin
        });
      } else {
        console.log("Admin not found");
        return res.redirect('/admin/viewPage');
      }
    } else {
      // Agar login nahi hai
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    return res.redirect('/admin/formAdd');
  }
};

 //update
//update
module.exports.editAdminData = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params.adminId);

    let adminData = await Admin.findById(req.params.adminId);

    if (!adminData) {
      console.log("Admin not found");
      return res.redirect('/admin/viewPage');
    }

    // Nayi file upload hui hai to purani delete karo
    if (req.file) {
      try {
        if (adminData.profile) {
          let imagePath = path.join(__dirname, '..', 'uploads', adminData.profile);
          fs.unlinkSync(imagePath);
        }
        req.body.profile = req.file.filename;
      } catch (err) {
        console.log(err);
        return res.redirect('/admin/formAdd');
      }
    }

    // Name combine karo
    req.body.name = `${req.body.fname} ${req.body.lname}`;
    req.body.update_date = moment().format('YYYY-MM-DD HH:mm:ss A');

    // Update in DB
    let updateAdmin = await Admin.findByIdAndUpdate(req.params.adminId, req.body);

    if (updateAdmin) {
      console.log("Admin updated");
    } else {
      console.log("Admin not updated");
    }
    return res.redirect('/admin/viewPage');
  } catch (err) {
    console.log(err);
    return res.redirect('/admin/formAdd');
  }
};

module.exports.singleAdmin = async(req,res) => {
  console.log(req.params.id);
try{
    let adminData = await Admin.findById(req.params.id);
  console.log(adminData);
  return res.status(200).json({
    status:"success",data:adminData
  })
  

}catch(err){
  console.log(err);
  return res.redirect('/admin/formAdd');
}
  
}

