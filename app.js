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
const { isLoggedIn } = require("./middleware");

const admin = require("./routes/admin")
const login = require("./routes/login")
const wedding = require("./routes/wedding")

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
    res.locals.pageTitle = String;
    next();
});

app.use("/admin", admin);
app.use("/login", login);
app.use("/wedding", wedding);

app.get("/", (req, res) => {
    res.render("landing-page");
    
});

app.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.flash("success", "Goodbye")
    res.redirect("/")
})

app.get("*", (req, res) => {
    res.status(404, "Cannot find that page");
    req.flash("error", "Unable to find that page!");
    res.redirect("/")
})
app.listen(3000, () => {
    console.log(`Serving on port 3000`)
});