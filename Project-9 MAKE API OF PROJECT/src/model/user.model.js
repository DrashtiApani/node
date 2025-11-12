const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Employee', 'Manager'], 
       
    },
    profile: { 
        type: String, 
        default: "" 
    },
    mobile: { 
        type: String 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female'], 
        default: 'Male' 
    },
    isDelete: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);
