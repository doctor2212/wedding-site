module.exports.loginForm = (req, res) => {
    if(!req.user) {
        res.render("users/login")
    } else{
        res.redirect("/wedding");
    }
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome", req.user.username)
    res.redirect("/wedding")
}