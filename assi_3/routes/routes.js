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
module.exports = router;
