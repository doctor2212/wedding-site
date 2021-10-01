const { boolean } = require("joi");
const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const GiftSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true
    },
    isPurchased: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Gift", GiftSchema);
