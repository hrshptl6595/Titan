var mongoose = require("mongoose");
var uriUtil = require("mongodb-uri");

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
// var mongoLabUriE = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002/employees";
// var mongooseUriE = uriUtil.formatMongoose(mongoLabUriE);
var mongooseUriE = "mongodb://localhost/employees";
var connE = mongoose.createConnection(mongooseUriE, options);
connE.once("open", function() {
  console.log("connection to employee db successful");
});

employeeSchema = mongoose.Schema({
  userNameEmployee: String,
  passwordEmployee: String,
  emailEmployee: String
});

module.exports = connE.model("employee", employeeSchema, "employees");