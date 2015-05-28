var mongoose = require("mongoose");
var uriUtil = require("mongodb-uri");

// var mongoLabUriV = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002";
var mongoLabUriV = "mongodb://shruti1995:shruti126@ds031892.mongolab.com:31892/heroku_app37234002";
var mongooseUriV = uriUtil.formatMongoose(mongoLabUriV);
// var mongooseUriV = "mongodb://localhost/visitors";
var connV = mongoose.createConnection(mongooseUriV);
connV.once("open", function() {
  console.log("connection to visitor db successful");
});

visitorSchema = mongoose.Schema({
  nameV: String,
  emailV: String,
  companyV: String,
  mobnumV: Number
});

module.exports = connV.model("visitor", visitorSchema, "visitors");