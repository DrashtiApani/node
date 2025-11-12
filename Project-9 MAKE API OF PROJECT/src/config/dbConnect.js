const mongoose = require('mongoose');

const dbConnect = () => {
  mongoose
    .connect('mongodb://localhost:27017/RoleBasedApi')
    .then(() => console.log('✅ Database connected successfully'))
    .catch((err) => console.error('❌ Database connection error:', err));
};

module.exports = dbConnect;
