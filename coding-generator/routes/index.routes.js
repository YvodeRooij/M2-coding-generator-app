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
  // retreive info from form
  const { email, password } = req.body;

  // check if user already exists
  try {
    const userFromDatabase = await User.findOne({ email });
    if (userFromDatabase) {
      return res.status(400).send("User already exists, go back to previous page");
    }

    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(password, salt);

    const user = new User({ email: req.body.email, password: hash });
    await user.save();

    res.redirect("/my-overview");
  } catch (error) {
    next(error);
  }
});

router.get("/my-overview", (req, res, next) => {
  res.render("my-overview");
});

router.get("/login", (req, res, next) => {
  try {
    res.render("auth/login");
    console.log("successfully rendered login page");
  } catch (err) {
    next(err);
  }
});

router.post("/login", (req, res) => {
  console.log("SESSION =====> ", req.session);
});

// insert isLoggedIn
router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (err) {}
});

module.exports = router;
