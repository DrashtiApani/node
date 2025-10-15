const mongoose=require("mongoose")

// mongoose.connect("mongodb://localhost:27017/categorys")

mongoose.connect('mongodb+srv://DrashtiApani:DrashtiApani@cluster0.cwgzcyd.mongodb.net/categorys')

const db=mongoose.connection;

db.once("open",(err)=>{
    if(err){
        console.log(err)
        return;
    }
    console.log("Database Connected")
})
module.exports=db;