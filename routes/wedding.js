const express = require('express');
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAdmin } = require("../middleware");

const wedding = require("../controllers/wedding")

router.route("/")
    .get(isLoggedIn, wedding.home)
    .post(isLoggedIn, catchAsync(wedding.rsvp));

router.get("/location", isLoggedIn, wedding.renderLocation);

router.route("/questions")
    .get(isLoggedIn, catchAsync(wedding.renderQuestions))
    .post(isLoggedIn, isAdmin, catchAsync(wedding.newQuestion))
    .delete(isLoggedIn, isAdmin, catchAsync(wedding.deleteQuestion));

router.get("/gifts", isLoggedIn, catchAsync(wedding.renderGifts));

module.exports = router;
