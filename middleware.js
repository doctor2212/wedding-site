module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in to perform this action");
        return res.redirect("/login")
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if(!req.user.isAdmin === true){
        req.flash("error", "You are unauthorised to perform this action");
        return res.redirect("/wedding")
    }
    next();
}