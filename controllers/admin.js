const Guest = require("../models/guest");

module.exports.index = async (req, res) => {
    const attending = await Guest.find({"attending" : "yes"});
    const notAttending = await Guest.find({"attending" : "no"});
    const unknown = await Guest.find({"attending" : "unknown"});
    res.render("users/admin", {attending, notAttending , unknown, pageTitle: "Admin"});
};

module.exports.registerGuest = async(req, res) => {
    const {username, password, family} = req.body;
    const plusOnes = family.split(", ")
    if(req.body.admin === "on"){
        const guest = await new Guest({attending: "unknown", username, isAdmin: true, plusOnes})
        await Guest.register(guest, password);
        await guest.save();
    } else{
        const guest = await new Guest({attending: "unknown", username, isAdmin: false, plusOnes});
        await Guest.register(guest, password);
        await guest.save
    }
    res.redirect("/admin");
};

