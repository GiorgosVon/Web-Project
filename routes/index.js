const express = require("express")
const passport = require("passport")
const router = express.Router()
const { ensureAuthenticated, ensureGuest } = require("../config/auth")

const Data = require("../models/Data")

//desc:     Login/Landing page
//route:    Get /
router.get("/", ensureGuest, (req, res) => {
    res.render("login")
})

//desc:     Dashboard
//route:    Get /dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
    try {
        const userData = await Data.find({ user: req.user.id }).lean()
        res.render("dashboard", {
            user: req.user,
            layout: "layoutUser",
            userData,
            helper: require("../helpers/helper"),
            title: "Express"
        })
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})

// desc:     Data Upload
// route:    Post /dashboard
router.post("/dashboard", ensureAuthenticated, async (req, res) => {
    try {
        const { result } = req.body;

        //preparing json
        jsonString = result;
        myJson = JSON.parse(jsonString);
        const docs = []; // {user: , userJson: {}}
        for (let i = 0; i < myJson.length; i++) {
            let entry = {
                user: req.user.id,
                userJson: myJson[i]
            };
            docs.push(entry);
        }
        await Data.create(docs)
        res.redirect("/dashboard")
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
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