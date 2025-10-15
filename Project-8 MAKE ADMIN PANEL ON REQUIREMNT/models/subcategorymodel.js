const mongoose = require("mongoose")

const subcategoryschema = mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    subcategory:{
        type:String,
        require:true
    }
})

const subcategorymodel = mongoose.model("subcategory",subcategoryschema)
module.exports = subcategorymodel