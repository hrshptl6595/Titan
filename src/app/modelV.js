var mongoose = require("mongoose");

// var mongoLabUri = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002";
// var mongooseUri = uriUtil.formatMongoose(mongoLabUri);
var mongooseUriV = "mongodb://localhost/visitors";
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
