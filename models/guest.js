const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const GuestSchema = new Schema({
    attending: {
        type: String,
        enum: ["yes", "no", "unknown"],
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    plusOnes: [
        {
            type: String,
            required: false,
        }
    ]
});

GuestSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Guest", GuestSchema);
