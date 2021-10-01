const express = require('express');
const router = express.Router();

const passport = require('passport');
const login = require("../controllers/login")

router.route("/")
    .get(login.loginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), login.login);

module.exports = router;