const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const { RSA_NO_PADDING } = require('constants');

const app = express();

mongoose.connect("mongodb://localhost:27017/wedding-site", { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/wedding", (req,res) => {
    res.render("wedding");
});

app.get("/wedding/rsvp", (req, res) => {
    res.render("rsvp");
});

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
});

