
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const indexRoutes = require('./src/routes/index'); 

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api", indexRoutes);

app.get('/', (req, res) => res.json({ message: 'Recipe Sharing Platform API - running' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

});
