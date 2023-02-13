var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const mongoose = require("mongoose"); // new
mongoose.set("strictQuery", false);
const mongoString = process.env.DATABASE_URL;
console.log("db env string ", process.env.DATABASE_URL);
const app = express();
//CORS middleware
const cors = require("cors");

mongoose
  .connect(mongoString, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to database -- so loading the app");
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors());
    app.use(express.static(path.join(__dirname, "public")));

    app.get("/", (req, res) => {
      res.send("Hello Geeks");
    });
    // app.use("/api", indexRouter);
    app.use("/api", usersRouter);
  })
  .catch((error) => {
    console.log("connection error", error);
  });

module.exports = app;
