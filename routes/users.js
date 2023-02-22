var express = require("express");
const UsersModel = require("../schemas/UsersSchema");
// const { users } = require("../schemas/UserSchema");
var router = express.Router();
const logger = require("../logger");

/* GET users listing. */
router.get("/users", async (req, res, next) => {
  try {
    const result = await UsersModel.find({});
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Retrived Users",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    const result = await UsersModel.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Retrieved User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/user/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    const result = await UsersModel.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Deleted User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/user/:id", async (req, res, next) => {
  const newUser = {};
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.message = req.body.message;
  console.log("newuser", newUser);
  try {
    const result = await UsersModel.findOneAndUpdate(
      { _id: req.params.id },
      newUser
    );
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Updated User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/test/:id", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.message = req.body.message;
    const result = await user.save();
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Updated User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/user", async (req, res, next) => {
  const newUser = new UsersModel();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.message = req.body.message;
  // console.log(req.body)
  let condition = req.body.name?.trim() !== "" && req.body.name !== null && req.body.email?.trim() !== "" && req.body.email !== null && req.body.message?.trim() !== "" && req.body.message !== null;
  if (condition) {
    try {
      const result = await newUser.save();
      res.status(201).json({
        status: "S",
        statusmessage: "Successfully Created User",
        users: result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  else {
    logger.log("error", "error in the request "+newUser);
    res.status(500).json({
      status: "E",
      statusmessage: "Error Creating User",
      users: req.body,
    });
  }

});

module.exports = router;
