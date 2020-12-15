const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
const connectDB = require("./config/db")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")

//Load config
dotenv.config({ path: "./config/config.env" })

connectDB();

const app = express()

require("./config/passport")(passport);

// logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs")

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Static Folder
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);