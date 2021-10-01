const express = require('express');
const router = express.Router();
const admin = require("../controllers/admin")

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAdmin } = require("../middleware");

router.route("/")
    .get(isLoggedIn, isAdmin, catchAsync(admin.index))
    .post(isLoggedIn, isAdmin, catchAsync(admin.registerGuest));

module.exports = router;
