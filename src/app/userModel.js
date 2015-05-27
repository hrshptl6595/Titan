var mongoose = require("mongoose");

userSchema = mongoose.Schema({
  userName: String,
  password: String,
  email: String
});

module.exports = mongoose.model("user", userSchema);
