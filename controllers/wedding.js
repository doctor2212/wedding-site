const Guest = require("../models/guest");
const Question = require("../models/questions");
const Gift = require("../models/gifts");

module.exports.home = (req,res) => {
    res.render("wedding/wedding", {pageTitle: "Home"});
};

module.exports.rsvp = async (req, res) => {
    const { username } = req.user;
    const { attending } = req.body;
    if(attending === "yes"){
        const updatedGuest = await Guest.findOneAndUpdate({ username }, {attending: "yes"} )
        await updatedGuest.save()
    } else if (attending === "no") {
        const updatedGuest = await Guest.findOneAndUpdate({ username }, {attending: "no"} )
        await updatedGuest.save()
    };
    req.flash("success", "RSVP successfully updated")
    res.redirect("/wedding");
};

module.exports.renderLocation = (req, res) => {
    res.render("wedding/location", {pageTitle: "Location"});
};

module.exports.renderQuestions = async(req, res) => {
    const [...questions] = await Question.find({});
    res.render("wedding/questions", { questions, pageTitle: "About"})
};

module.exports.newQuestion = async(req, res) => {
    const {question, answer} = req.body;
    const newQuestion = await new Question({question, answer});
    await newQuestion.save();
    res.redirect("/admin")
};

module.exports.deleteQuestion = async(req, res) => {
    const { question } = req.body;
    const questionToDelete = await Question.findOneAndDelete({question});
    res.redirect("/wedding/questions");
};

module.exports.renderGifts = async(req, res) => {
    const [...gifts] = await Gift.find({});
    res.render("wedding/gifts", { gifts, pageTitle: "Wedding Gifts"})
};