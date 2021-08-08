const express = require("express");
const router = express.Router();

const { shower } = require("../controllers/public.js");

const User = require("../models/user");

const isLoggedIn = (req, res, next) => {
  if(req.session && req.session.user){
    req.flash('user', req.session.user);
    console.log("khong dang nhap");
    next();
  }else{
    console.log("dang nhap");
    res.redirect("/login");
  }
};

router.route("/").get(isLoggedIn, shower);
router
  .route("/login")
  .get(function (req, res, next) {
    res.render("login");
  })
  .post(async function (req, res, next) {
    try {
      const { email, password} = req.body;
      if (!email || !password ) {
        req.flash("error", "email, password are required!");
        res.render("login");
        return false;
      }
      // check valid account
      const user = await User.findOne({ email }).lean();
      if (!user) {
        req.flash("error", "email is not exist!");
        res.render("login");
        return false;
      }
      //is valid pass
      const comparePasswords = await User.comparePasswords(password, user.password);
      if(!comparePasswords){
        req.flash("error", "password is not correct!");
        res.render("login");
        return false;
      }
      
      delete user.password;
      delete user.__v;

      req.session.user = user;
      req.flash("user", req.session.user);
      
      req.flash("success", "Successful!");
      // res.send("ok");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  });

router
  .route("/register")
  .get(function (req, res, next) {
    // res.render("register",{error:""});
    res.render("register");
  })
  .post(async function (req, res, next) {
    // console.log(req.body);
    try {
      const { email, password, repassword } = req.body;
      if (!email || !password || !repassword) {
        // res.render("register",{error:"email, password, repassword are required!"});
        req.flash("error", "email, password, repassword are required!");
        res.render("register");
        return false;
      }
      // check exists
      const suser = await User.findOne({ email });
      if (suser) {
        req.flash("error", "email is already in use!");
        res.render("register");
        return false;
      }
      //encrypt
      const hashPassword = await User.hashPassword(password);
      const newUser = await new User({ email, password: hashPassword });
      await newUser.save();
      req.flash("success", "Successful!");
      // res.send("ok");
      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  });

router.route("/logout").get(function (req, res, next) {
  // req.logout();
  // req.session = null;
  req.session.destroy();
  // req.flash("success", "Successful log out!");
  res.redirect("/login");
});

module.exports = router;
