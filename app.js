const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
const connectDB = require("./config/db")

//Load config
dotenv.config({ path: "./config/config.env" })

connectDB();

const app = express()

// logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Handlebars
app.use(expressLayouts);
app.set("view engine", "ejs")

// Bodyparser
app.use(express.urlencoded({ extended: false }));

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