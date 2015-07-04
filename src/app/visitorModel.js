var mongoose = require("mongoose");
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
var mongooseUriV = "mongodb://localhost/visitors";

var connV = mongoose.createConnection(mongooseUriV, options);
connV.once("open", function() {
  console.log("connection to visitors db successful");
});

visitorSchema = mongoose.Schema({
  visitorName: String,
  visitorEmail: String,
  visitorCompany: String,
  visitorNumber: Number,
  empName: String,
  date: Date,
  Time: Number,
  place: String,
  approved: Boolean
});

module.exports = connV.model("visitor", visitorSchema, "visitors");
