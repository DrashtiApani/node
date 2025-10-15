const express = require("express");
const port = 8015;
const app = express();
const path = require("path");
const db = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("./config/localStrategy"); 
const cookieParser = require("cookie-parser");
const isAuthenticateUser = require("./config/localStrategy");

const flash = require("connect-flash");
app.use(flash());
const  setFlashMessage  = require("./config/flashMessage");


app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "assets"))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use(
    session({
        name: "testing",
        secret: "admin-panel",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(setFlashMessage.setFlashMessage);

app.use(passport.isAuthenticateUser);

app.use("/", require("./routes/index"));

app.listen(port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log("✅ Server is running on port", port);
});
