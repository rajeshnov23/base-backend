var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
},
  email: {
    type: String,
    required: true,
},
hash: String,
salt: String,
});
let UserModel = mongoose.model("user", UserSchema, "User");
module.exports = UserModel
