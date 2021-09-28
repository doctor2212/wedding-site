const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Guest = require("./models/guest");

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
app.use(express.json())

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Guest.authenticate()));

passport.serializeUser(Guest.serializeUser());
passport.deserializeUser(Guest.deserializeUser());

app.get("/", (req, res) => {
    res.render("landing-page");
    
});

app.get("/login", (req, res) => {
    res.render("users/login")
});

app.post("/login", passport.authenticate("local", {failiureRedirect: "/login"}), (req, res) => {
    console.log("Success")
    res.redirect("/wedding")
});



// app.get("/new", async (req, res) => {
//     const guest = new Guest({attending: true, username: "admin"});
//     const registeredGuest = await Guest.register(guest, "admin");
//     res.redirect("/wedding")
// })

app.get("/wedding", (req,res) => {
    res.render("wedding");
});

app.post("/wedding", (req, res) => {
    const { rsvp } = req.body;
    console.log(rsvp);
    res.redirect("/wedding");
});

app.get("/register", (req, res) => {
    res.render("users/register")
});

app.get("/login", (req, res) => {
    res.render("users/login");
});


app.get("/wedding/rsvp", (req, res) => {
    res.render("rsvp");
});

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
});

