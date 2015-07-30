var mongoose = require("mongoose");
var mongooseUriV = "mongodb://localhost/visitors";

var connV = mongoose.createConnection(mongooseUriV);
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
