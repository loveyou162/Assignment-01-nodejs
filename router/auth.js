const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");
//api đăng nhập
router.post("/login", authController.HandleLogins);
module.exports = router;
