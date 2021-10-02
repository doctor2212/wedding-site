if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
};

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const Guest = require("./models/guest");
const { isLoggedIn } = require("./middleware");

const admin = require("./routes/admin")
const login = require("./routes/login")
const wedding = require("./routes/wedding");

// const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/wedding-site";
const secret = process.env.SECRET || "thisshouldbeabettersecret"

mongoose.connect(dbUrl, { 
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
app.use(mongoSanitize())

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function(e){
    console.log(e)
});

const sessionConfig = {
    store,
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
);

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
});

app.get("*", (req, res) => {
    res.status(404, "Cannot find that page");
    req.flash("error", "Unable to find that page!");
    res.redirect("/")
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
});

