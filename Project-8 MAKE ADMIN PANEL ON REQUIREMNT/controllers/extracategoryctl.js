const extracategorymodel = require("../models/extracategorymodel");
const categorymodel = require("../models/categorymodel");
const subcategorymodel = require("../models/subcategorymodel");
const fs = require("fs");
const path = require("path");

// Add page
module.exports.addextracategory = async (req, res) => {
  try {
    let category = await categorymodel.find();
    let subcategory = await subcategorymodel.find().populate("category");
    return res.render("extracategory/addExtraCategory", {
      category,
      subcategory,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};

// dependend dropdown ma catagory and subcategory fetch karva mate
module.exports.subcategory = async (req, res) => {
  try {
   let categoryId = req.query.categoryId;
   let subcategories = await subcategorymodel.find({ category: categoryId });
  //  console.log(subcategories);
   
   res.json({  subcategories,message: "Subcategories fetched successfully" });
  } catch (err) {
    console.log(err);
    res.json({ error: "Error fetching subcategories" });
  }
};

// Insert
module.exports.insertextracategory = async (req, res) => {
  try {
    let { category, subcategory, extracategory } = req.body;
    let imagePath = "";

    if (req.file) {
      imagePath = extracategorymodel.imagePath + "/" + req.file.filename;
    }

    await extracategorymodel.create({
      category,
      subcategory,
      extracategory,
      image: imagePath,
    });

    return res.redirect("/extracategory/viewextracategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/extracategory/addextracategory");
  }
};


// View
module.exports.viewextracategory = async (req, res) => {
  try {
    let extracategory = await extracategorymodel
      .find()
      .populate("category")
      .populate("subcategory");

    return res.render("extracategory/viewExtraCategory", {
      extracategory,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};

// Delete
module.exports.deleteextracategory = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await extracategorymodel.findById(id);

    if (data.image) {
      let fullPath = path.join(__dirname, "..", data.image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await extracategorymodel.findByIdAndDelete(id);
    return res.redirect("/extracategory/viewextracategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/extracategory/viewextracategory");
  }
};

// Edit page
module.exports.editextracategory = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await extracategorymodel.findById(id);
    let category = await categorymodel.find();
    let subcategory = await subcategorymodel.find().populate("category");

    return res.render("extracategory/editExtraCategory", {
      data,
      category,
      subcategory,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/extracategory/viewextracategory");
  }
};

// Update
module.exports.updateextracategory = async (req, res) => {
  try {
    let id = req.params.id;
    let { category, subcategory, extracategory } = req.body;
    let data = await extracategorymodel.findById(id);

    let imagePath = data.image;
    if (req.file) {
      // delete old image
      if (data.image) {
        let fullPath = path.join(__dirname, "..", data.image);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      imagePath = extracategorymodel.imagePath + "/" + req.file.filename;
    }

    await extracategorymodel.findByIdAndUpdate(id, {
      category,
      subcategory,
      extracategory,
      image: imagePath,
    });

    return res.redirect("/extracategory/viewextracategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/extracategory/viewextracategory");
  }
};
