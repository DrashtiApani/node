const express = require('express');
const dbConnect = require('./config/dbConnect');
const indexRoute = require("./routes/index.routes");
const path = require('path');

const app = express();
const port = 8021;

dbConnect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", indexRoute);

app.listen(port, () => {
    console.log(`✅ Server running at: http://localhost:${port}`);
});
