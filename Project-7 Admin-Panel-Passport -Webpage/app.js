const express = require('express');
const path = require('path');
const port = 8002;
const app = express();
const passport = require('passport');
const LocalStrategy = require('./config/localStrategy')
const flash = require('connect-flash');
const flashMSG = require('./config/flashMessage');


app.set('view engine', 'ejs');
const db = require('./config/db');
const Admin = require('./model/adminModel')
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const session = require('express-session');



app.use(express.static(path.join(__dirname,'assets'))) // css add 
app.use(express.urlencoded());

app.use('/uploads',express.static(path.join(__dirname,'uploads')));
// app.use(express.static(path.join(__dirname,'uploads')));


app.use(session({
    name: 'testing',
    secret: 'admin-panel',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000*60*60
    }
}   ))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticateUser);
app.use(flashMSG.setFlashMessage)


app.use('/',require('./routes/index'));


app.listen(port,(err) => { 
    err? console.log(err) : console.log(`Server is running on port ${port}`);
})