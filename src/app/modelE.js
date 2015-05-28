var mongoose = require("mongoose");
var uriUtil = require("mongodb-uri");

var mongoLabUriE = "mongodb://shruti1995:shruti126@ds031892.mongolab.com:31892/heroku_app37234002/employees";
var mongooseUriE = uriUtil.formatMongoose(mongoLabUriE);
// var mongooseUriE = "mongodb://localhost/employees";
var connE = mongoose.createConnection(mongooseUriE);
connE.once("open", function() {
  console.log("connection to employee db successful");
});

EmpSchema = mongoose.Schema({
  userNameE: String,
  passwordE: String,
  emailE: String
});

module.exports = connE.model("employee", EmpSchema);
