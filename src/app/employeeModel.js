var mongoose = require("mongoose");
var host = require("./global");
var mongooseUriE = "mongodb://localhost/employees";

var connE = mongoose.createConnection(mongooseUriE);
connE.once("open", function() {
  console.log("connection to employees db successful");
});
var Schema = mongoose.Schema;
var employeeSchema = new Schema({
  empIDToken: String,
  empAccessToken: String,
  empRefreshToken: String,
  empName: String,
  empEmail: String,
  empDept: String,
  empNumber: Number,
  empPicture: String,
  empUnique: String,
  nextSyncToken: String
});

module.exports = connE.model("employee", employeeSchema, "employees");
