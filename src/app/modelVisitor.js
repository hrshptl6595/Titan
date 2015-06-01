var mongoose = require("mongoose");
var uriUtil = require("mongodb-uri");

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
// // var mongoLabUriV = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002";
// var mongoLabUriV = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002/visitors";
// var mongooseUriV = uriUtil.formatMongoose(mongoLabUriV);
var mongooseUriV = "mongodb://localhost/visitors";
var connV = mongoose.createConnection(mongooseUriV, options);
connV.once("open", function() {
  console.log("connection to visitor db successful");
});

visitorSchema = mongoose.Schema({
  nameVisitor: String,
  emailVisitor: String,
  companyVisitor: String,
  mobnumVisitor: Number,
  empName: String,
  Time: Number,
  place: String
});

module.exports = connV.model("visitor", visitorSchema, "visitors");
