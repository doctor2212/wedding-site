const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const Guest = require("./models/guest");
const catchAsync = require("./utils/catchAsync");
const { isLoggedIn } = require("./middleware")

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
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Guest.authenticate()));

passport.serializeUser(Guest.serializeUser());
passport.deserializeUser(Guest.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("landing-page");
    
});

app.get("/login", (req, res) => {
    if(!req.user) {
        res.render("users/login")
    } else{
        res.redirect("/wedding");
    }
});

app.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
    req.flash("success", "Welcome", req.user.username)
    res.redirect("/wedding")
});

app.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye")
    res.redirect("/")
})

// app.get("/new", async (req, res) => {
//     const guest = new Guest({attending: "unknown", username: "Nathan"});
//     const registeredGuest = await Guest.register(guest, "nathan");
//     res.redirect("/wedding")
// });

// app.get("/new", async (req, res) => {
//     const guest = new Guest({attending: "unknown", username: "John"});
//     const registeredGuest = await Guest.register(guest, "john");
//     res.redirect("/wedding")
// });

app.get("/wedding", isLoggedIn, (req,res) => {
    res.render("wedding/wedding");
});

app.post("/wedding", isLoggedIn, catchAsync(async (req, res) => {
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
}));

app.get("/wedding/location", isLoggedIn, (req, res) => {
    res.render("wedding/location");
});

app.get("/register", (req, res) => {
    res.render("users/register")
});

app.get("/admin", catchAsync(async (req, res) => {
    const attending = await Guest.find({"attending" : "yes"});
    const notAttending = await Guest.find({"attending" : "no"});
    const unknown = await Guest.find({"attending" : "unknown"});
    res.render("users/admin", {attending, notAttending , unknown});
}));

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
});

