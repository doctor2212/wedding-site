const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const GuestSchema = new Schema({
    attending: {
        type: Boolean,
        required: true,
    }
});

GuestSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Guest", GuestSchema);