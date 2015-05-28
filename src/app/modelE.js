var mongoose = require("mongoose");

// var mongoLabUri = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002";
// var mongooseUri = uriUtil.formatMongoose(mongoLabUri);
var mongooseUriE = "mongodb://localhost/employees";
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
