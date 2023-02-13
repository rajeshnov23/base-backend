var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

module.exports = UserModel = mongoose.model("user", UserSchema, "Users");
