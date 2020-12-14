const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")

//User model 
const User = require("../models/User")

//desc:     Dashboard
//route:    Get /dashboard
router.get("/dashboard", (req, res) => {
    res.render("dashboard")
})

//desc:     Register
//route:    Get /register
router.get("/register", (req, res) => {
    res.render("register")
})

//desc:     Register Handle
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }

    //check passwords match
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    }

    //check passlength
    if (password.length < 8) {
        errors.push({ msg: "Password should be at least 8 characters" });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: "Email is already in use" })
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // set password to hashed
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(user => {
                                    res.redirect("/");
                                })
                                .catch(err => console.log(err));
                        }))
                }
            })
    }
})

module.exports = router