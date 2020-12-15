const express = require("express")
const passport = require("passport")
const router = express.Router()
const { ensureAuthenticated } = require("../config/auth")


//desc:     Login/Landing page
//route:    Get /
router.get("/", (req, res) => {
    res.render("login")
})

//desc:     Dashboard
//route:    Get /dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user,
        layout: "layoutUser"
    })
})

// Login
router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
})




module.exports = router