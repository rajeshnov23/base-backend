var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

const logger = require("./logger");
require("dotenv").config();
const mongooseConnect=require("./db/db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let userRouter = require("./routes/user");

// console.log("db env string ", process.env.DATABASE_URL);
const app = express();
//CORS middleware
const cors = require("cors");

mongooseConnect()
  .then(() => {
    console.log("connected to database -- so loading the app");

    logger.log("info", "connected to database -- so loading the app");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors());
    app.use(express.static(path.join(__dirname, "public")));


    app.get("/", (req, res) => {
      res.send("Hello World");
    });
    // app.use("/api", indexRouter);
    // app.use("/api", usersRouter);
    app.use("/api/auth", userRouter);

    app.use((error, req, res, next) => {
      console.log("Error Handling Middleware called")
      console.log('Path: ', req.path)
      console.error('Error: ', error)
     
      res.status(500).send(error)
    });
    process.on('uncaughtException', function(err) {
  
      // Handle the error safely
      console.log("error is caught here")
  })
  })
  .catch((error) => {
    console.log("connection error", error);
  });

module.exports = app;
