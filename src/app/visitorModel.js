var mongoose = require("mongoose");
// var host = "localhost";
var host = "titan-scheduler.in";
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
var mongooseUriV = "mongodb://" + host + "/visitors";

var connV = mongoose.createConnection(mongooseUriV, options);
connV.once("open", function() {
  console.log("connection to visitors db successful");
});

visitorSchema = mongoose.Schema({
  visitorName: String,
  visitorEmail: String,
  visitorCompany: String,
  visitorNumber: Number,
  visitorPicture: String,
  visitorPurpose: String,
  empUnique: String,
  date: Date,
  slot: Number,
  approved: Boolean,
  suggestedAlternative: Boolean
});

module.exports = connV.model("visitor", visitorSchema, "visitors");
