const categorymodel=require("../models/categorymodel")
const subcategorymodel= require("../models/subcategorymodel")
const path=require("path")
const fs=require("fs")

module.exports.addsubcategorypage = async (req,res) =>{
    try {
        let category= await categorymodel.find()
        return res.render("subcategory/addSubCategory",{
            category
        })
    } catch (error) {
        console.log(error)
        return res.redirect("/admin")
    }
}

module.exports.addsubcategory = async (req,res) =>{
    try {
        console.log(req.body)
        let subcategory= await subcategorymodel.create(req.body);
        if(subcategory){
            req.flash('success',"subCategory Added");
            return res.redirect("/subcategory/addsubcategory")
        }else{
            req.flash('error',"subCategory Not Added");
            return res.redirect("/subcategory/addsubcategory")
        }
    } catch (error) {
        console.log(error)
        return res.redirect("/admin")
    }
}

module.exports.viewsubcategory = async (req,res) =>{
    try {
        let subcategory= await subcategorymodel.find().populate('category');
        console.log(subcategory)
        return res.render("subcategory/viewSubCategory",{subcategory})
    } catch (error) {
        console.log(error)
        return res.redirect("/admin")
    }
}

// Edit page
module.exports.editsubcategorypage = async (req, res) => {
    try {
        let subcategory = await subcategorymodel.findById(req.params.id).populate('category');
        let category = await categorymodel.find();
        if (!subcategory) {
            req.flash('error', "SubCategory not found");
            return res.redirect("/subcategory/viewsubcategory");
        }
        return res.render("subcategory/editSubCategory", { subcategory, category });
    } catch (error) {
        console.log(error);
        return res.redirect("/subcategory/viewsubcategory");
    }
}

// Update
module.exports.updatesubcategory = async (req, res) => {
    try {
        let updateData = {
            subcategory: req.body.subcategory,
            category: req.body.category
        }
        await subcategorymodel.findByIdAndUpdate(req.params.id, updateData);
        req.flash('success', "SubCategory Updated Successfully");
        return res.redirect("/subcategory/viewsubcategory");
    } catch (error) {
        console.log(error);
        return res.redirect("/subcategory/viewsubcategory");
    }
}

// Delete
module.exports.deletesubcategory = async (req, res) => {
    try {
        await subcategorymodel.findByIdAndDelete(req.params.id);
        req.flash('success', "SubCategory Deleted Successfully");
        return res.redirect("/subcategory/viewsubcategory");

        // let category = await subcategorymodel.findById(req.params.id);

        // if(!category){
        //     req.flash('error', "SubCategory not found");
        //     res.redirect("/subcategory/viewsubcategory");
        // }else{
        //     let  imagepath = category.image;
        //     if(imagepath != ""){
        //         let imagepath1 = path.join(__dirname, '..', imagepath);
        //         try{
        //             await fs.unlinkSync(imagepath);
        //         }catch(err){
        //             console.log(err);
        //         }
        //     }
        //     await categorymodel.findByIdAndDelete(req.params.id);
        //     await subcategorymodel.deleteMany({category:req.params.id})
        // }
    } catch (error) {
        console.log(error);
        return res.redirect("/subcategory/viewsubcategory");
    }
}