var mongoose = require("mongoose");
// var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
//                 replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
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
  empDesignation: String,
  empNumber: Number,
  empPicture: String,
  empUnique: String,
  nextSyncToken: String
});

module.exports = connE.model("employee", employeeSchema, "employees");