const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const imageuploads = '/uploads/categoryimages';

const todoschema = mongoose.Schema({
    categoryname: {
        type: String,
        required: true
    },
    categoryimage: {
        type: String,
        required: true
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imageuploads));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

todoschema.statics.uploads = multer({ storage: storage }).single('categoryimage');

const Todo = mongoose.model('category', todoschema);

module.exports = Todo;
