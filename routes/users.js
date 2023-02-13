var express = require("express");
const UserModel = require("../schemas/UserSchema");
// const { users } = require("../schemas/UserSchema");
var router = express.Router();

/* GET users listing. */
router.get("/users", async (req, res, next) => {
  try {
    const result = await UserModel.find({});
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
    const result = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Retrived User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/user/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    const result = await UserModel.deleteOne({ _id: req.params.id });
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
    const result = await UserModel.findOneAndUpdate(
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
    const user = await UserModel.findById(req.params.id);
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
  const newUser = new UserModel();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.message = req.body.message;
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

  // newUser.save( (err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.status(200).json({
  //       status: 200,
  //       statusmessage: "Successfully Created User",
  //       users: newUser,
  //     });
  //   }
  // });
});

module.exports = router;
