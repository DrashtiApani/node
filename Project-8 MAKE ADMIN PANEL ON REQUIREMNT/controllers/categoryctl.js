const categorymodel = require("../models/categorymodel");
const fs = require('fs');
const path = require('path');
const subcategorymodel = require("../models/subcategorymodel");

module.exports.addcategory = (req, res) => {
    try {
        return res.render("category/addCategory")
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.insertcategory = async (req, res) => {
    try {
        console.log("Uploaded file:", req.file);

        if (req.file) {
            req.body.categoryimage = "/uploads/categoryimages/" + req.file.filename;
        } else {
            req.body.categoryimage = "";
            console.log("No image uploaded");
        }

        await categorymodel.create(req.body);
        console.log("✅ Category Inserted Successfully");

        res.redirect("/category/viewcategory");
    } catch (err) {
        console.log("Error inserting category:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.viewcategory = async (req, res) => {
    try {
        const category = await categorymodel.find();
        return res.render("category/viewCategory", { category })
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.deletecategory = async (req, res) => {
    try {
        console.log("Deleting category id:", req.params.id);

        let category = await categorymodel.findById(req.params.id);
        if (category && category.categoryimage) {
            try {
                let imagePath = path.join(__dirname, "..", category.categoryimage);
                fs.unlinkSync(imagePath);
                console.log("Image deleted from server");
            } catch (err) {
                console.log("Image not found on server");
            }
        }

        await categorymodel.findByIdAndDelete(req.params.id);
        await subcategorymodel.deleteMany({ category: req.params.id });

        if (deletedcategory) {
            console.log("✅ category Deleted Successfully");
        } else {
            console.log("category not deleted");
        }
        return res.redirect("/category/viewCategory");
    } catch (err) {
        console.log(err);
        return res.redirect("/category/viewCategory");
    }
};

module.exports.editcategory = async (req, res) => {
    try {
        let category = await categorymodel.findById(req.params.id);
        res.render("category/editCategory", { category });
    } catch (err) {
        console.log("Error in editCategoryPage:", err);
        res.redirect("category/viewCategory");
    }
}

module.exports.updatecategory = async (req, res) => {
    try {
        let updateData = {
            categoryname: req.body.categoryname
        };
        if (req.file) {
            updateData.categoryimage = "/uploads/categoryimages/" + req.file.filename;
        } else {
            let oldCategory = await categorymodel.findById(req.params.id);
            updateData.categoryimage = oldCategory.categoryimage;
        }
        await categorymodel.findByIdAndUpdate(req.params.id, updateData);
        console.log("Category updated successfully");
        res.redirect("/category/viewcategory");
    } catch (err) {
        console.log("Error in updateCategory:", err);
        res.redirect("/category/viewcategory");
    }
};

