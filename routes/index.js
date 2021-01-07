const express = require("express")
const passport = require("passport")
const router = express.Router()
const { ensureAuthenticated, ensureGuest, ensureAdmin } = require("../config/auth")
const { getExternalIP } = require("../config/ipGet")
const getUserIsp = require("../config/ispGet")
const getHeapMapData = require("../config/getHeatMapData")
const cleanupHeatData = require("../config/cleanupHeat")
const bcrypt = require("bcryptjs")
const agg = require("../config/agg")


const Data = require("../models/Data")
const Heat = require("../models/Heat")
const User = require("../models/User")

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
        if (userData != "") {
            //const heatmapData = await getHeapMapData(req);
            const heatmapDataFromDb = await Heat.find({ user: req.user.id }).lean();
            const heatmapDataCleaned = cleanupHeatData(heatmapDataFromDb);

            res.render("dashboard", {
                user: req.user,
                layout: "layoutUser",
                userData,
                heatmapDataCleaned,
                helper: require("../helpers/helper"),
                title: "Express"
            })
        } else {
            res.render("dashboard", {
                user: req.user,
                layout: "layoutUserNoScript",
                userData,
                helper: require("../helpers/helper"),
                title: "Express"
            })
        }
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})

//desc:     Admin Dashboard
//route:    Get /admin_dashboard
router.get("/adminDashboard", ensureAdmin, ensureAuthenticated, async (req, res) => {
    try {
        const methodTypesCount = await Data.aggregate([
            {
                "$group": {
                    "_id": "$userJson.method",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$group": {
                    "_id": null,
                    "counts": {
                        "$push": { "k": { "$toString": "$_id" }, "v": "$count" }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$counts" }
                }
            }
        ]);
        const statusTypesCount = await Data.aggregate([
            {
                "$group": {
                    "_id": "$userJson.status",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$group": {
                    "_id": null,
                    "counts": {
                        "$push": { "k": { "$toString": "$_id" }, "v": "$count" }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$counts" }
                }
            }
        ]);
        const domainTypesCount = await Data.aggregate([
            {
                "$group": {
                    "_id": "$userJson.url",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$group": {
                    "_id": null,
                    "counts": {
                        "$push": { "k": { "$toString": "$_id" }, "v": "$count" }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$counts" }
                }
            }
        ]);
        const ispTypesCount = await Data.aggregate([
            {
                "$group": {
                    "_id": "$userIsp",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$group": {
                    "_id": null,
                    "counts": {
                        "$push": { "k": { "$toString": "$_id" }, "v": "$count" }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$counts" }
                }
            }
        ]);

        // -- Aggregation for Content Type
        let distinctContentType = await Data.distinct("userJson.Content-Type").lean()
        distinctContentType.shift();
        const avgPerContentTypeArr = await agg(distinctContentType);
        // --

        const numOfUsers = await User.countDocuments();
        const userData = await Data.find({ user: req.user.id }).lean()
        res.render("adminDashboard", {
            user: req.user,
            layout: "layoutAdmin",
            userData,
            numOfUsers,
            methodTypesCount,
            statusTypesCount,
            domainTypesCount,
            ispTypesCount,
            distinctContentType,
            avgPerContentTypeArr,
            resultContent: JSON.stringify(avgPerContentTypeArr),
            helper: require("../helpers/helper"),
            title: "Express"
        })
    } catch (err) {
        console.error(err)
        res.render("error/500admin")
    }
})


//desc:     Admin Login Page
//route:    Get /adminlogin
router.get("/adminlogin", ensureGuest, (req, res) => {
    res.render("adminlogin")
})

// desc:     Data Upload
// route:    Post /dashboard
router.post("/dashboard", ensureAuthenticated, async (req, res) => {
    try {
        // set upload to true for data upload
        let upload = true;
        const { result } = req.body;

        // get public userIp
        const userAddress = await getExternalIP();
        // get userIsp from publicIp
        const userIsp = await getUserIsp(userAddress);

        //preparing json
        jsonString = result;
        myJson = JSON.parse(jsonString);
        const docs = []; // {user: , userJson: {}}
        for (let i = 0; i < myJson.length; i++) {
            let entry = {
                user: req.user.id,
                userIsp: userIsp,
                userJson: myJson[i]
            };
            docs.push(entry);
        }

        if (upload) {
            await Data.create(docs)
        }

        const heatmapData = await getHeapMapData(myJson);
        const heatData = [];
        for (let i = 0; i < heatmapData.length; i++) {
            let entry = {
                user: req.user.id,
                lat: heatmapData[i].lat,
                lon: heatmapData[i].lon,
                intensity: heatmapData[i].intensity
            };
            heatData.push(entry);
        }

        if (upload) {
            await Heat.create(heatData)
        }


        res.redirect("/dashboard")
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})


// Login User
router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next);
});

// Login Admin
router.post("/adminlogin", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/adminDashboard",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next);
});

router.post("/update-name", ensureAuthenticated, async function (req, res) {
    try {
        let id = req.user.id;
        let username = req.body.name;

        let userCheck = await User.findOne({ name: username });
        if (userCheck != null) {
            throw "Error! UserName already in Use";
        }

        let userFromDb = await User.findOne({ _id: id })
        userFromDb.name = username;
        await userFromDb.save();

        res.redirect("/dashboard");
    } catch (err) {
        console.error(err)
        res.render("error/usernameChangeError")
    }
});

router.post("/update-pass", async (req, res) => {
    const { pass, pass2 } = req.body;
    let err = "";
    try {
        //check passwords match
        if (pass !== pass2) {
            err = "passwords dont match";
            throw err;
        }

        //check passlength
        if (pass.length < 8) {
            err = "password of invalid length";
            throw err;
        }

        let userFromDb = await User.findOne({ _id: req.user.id })
        await bcrypt.hash(pass, 10, async function (err, hash) {
            userFromDb.password = hash;
            await userFromDb.save();
        });

        res.redirect("/dashboard");

    } catch (err) {
        console.error(err);
        res.redirect("/dashboard");
    }
})


// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
})


module.exports = router