const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const imageuploads = "/uploads/extracategoryimages";

const extracategoryschema = mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },
  extracategory: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", imageuploads));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

extracategoryschema.statics.uploads = multer({ storage: storage }).single("image");
extracategoryschema.statics.imagePath = imageuploads;

const extracategorymodel = mongoose.model("extracategory", extracategoryschema);
module.exports = extracategorymodel;
