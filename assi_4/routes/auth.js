const express = require("express");
let User = require("../models/user");
let bcryptjs = require("bcryptjs");

let checkSessAuth = require("../middlewares/checkSessAuth");
let checkNotSessAuth = require("../middlewares/checkNotSessAuth");

let router = express.Router();

router.get("/login", checkNotSessAuth, async (req, res, next) => {
  const errorMessage = req.query.error;
  res.render("auth/login", { title: "Login", errorMessage });
});

router.post('/login', async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  console.log(user)

  if (!user) {
    return res.redirect('/login?error=User does not exist, please register');
  }

  if (await bcryptjs.compare(req.body.password, user.password)) {
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    res.redirect('/')
  

  } else {
    // handle incorrect password
    return res.redirect('/login?error=Invalid password');
  }
});

router.get("/register", checkNotSessAuth, async (req, res, next) => {
  res.render("auth/register", { title: "Register" });
});

router.post("/register", async (req, res, next) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.render("auth/register", { title: "Register", errorMessage: "User already exists" });
    }

    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;

    let salt = await bcryptjs.genSalt(10);
    let hashedPass = await bcryptjs.hash(req.body.password, salt);

    user.password = hashedPass;

    await user.save();
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});


router.get("/logout", checkSessAuth, async (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
  }
  res.redirect("/");
});

module.exports = router;

