const express = require("express");
const { handleUsersSignUp } = require("../controller/user");
const { handleUsersLogin } = require("../controller/user");
const router = express.Router();
router.post("/", handleUsersSignUp);
router.post("/login", handleUsersLogin);
module.exports = router;
