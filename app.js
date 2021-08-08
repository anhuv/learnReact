const express = require('express');
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash');
const db = require('./configs/db');

db.conectDB()

const routerConfig = require('./routes');

const app = express();
//set view engine
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

//set body sparse
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'mit',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, expires: 60*60*24 }
  }))
app.use(flash());

//middleware set state of flash
app.use(function (req, res, next) {
  res.locals.error_messages = req.flash('error');
  res.locals.success_messages = req.flash('success');
  next();
})

app.use('/', routerConfig);
//handle error
app.use(function (req, res, next) {
  next();
})
//other error
app.use(function (error, req, res, next) {
  console.log(error);
  // res.render("error"); file ejs /html
})

// app.listen(3000, function () {
//     console.log("running");
// });

module.exports = app;