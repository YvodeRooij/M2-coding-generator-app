const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//signup
//insert middleware here
router.post("/signup", async (req, res, next) => {
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(req.body.password, salt);

  const user = new User({ username: req.body.email, password: hash });
  await user.save();

  res.send("signed up");
});

router.get("/login", (req, res, next) => {
  try {
    res.render("auth/login");
    console.log("successfully rendered login page");
  } catch (err) {
    next(err);
  }
});

// insert isLoggedIn
router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (err) {}
});

module.exports = router;
