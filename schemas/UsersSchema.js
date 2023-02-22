var mongoose = require("mongoose");

var UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
},
  email: {
    type: String,
    required: true,
},
  message: {
    type: String,
    required: true,
    min: [15, 'Messages must be at least 15 characters long.']
},
});
let UsersModel = mongoose.model("users", UsersSchema, "Users");
module.exports = UsersModel
