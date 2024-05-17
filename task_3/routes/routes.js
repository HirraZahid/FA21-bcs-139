const express = require("express");
const router = express.Router();

// Homepage route
router.get("/", (req, res) => {
  res.render("homepage", { title: "Homepage" });
});

//contact us 
router.get("/contact-us", (req, res) => {
  res.render("contact-us", { title: "Contact Us" });
});

//ajax example
router.get("/ajaxExample", (req, res) => {
  res.render("ajaxExample", { title: "Ajax Example" });
});
//blogs
router.get("/blogs", (req, res) => {
  res.render("blogs", { title: "Blogs" });
});
//singleBlog
router.get("/singleBlog", (req, res) => {
  res.render("singleBlog", { title: "My Blog" });
});

//login 
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});


//sign up 
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup" });
});
//about me
router.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});
//addblog
router.get("/addBlog", (req, res) => {
  res.render("addBlog", { title: "addBlog" });
});
module.exports = router;
