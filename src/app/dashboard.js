var mapper = require("./mapper");
var request = require("request");
var jwt = require("jsonwebtoken");
var jwkToPem = require("jwk-to-pem");
var fs = require("fs");
var employee = require("./employeeModel");

exports.empLoad = null;

exports.typeCheck = function(req, res, next) {
  if(req.method === "GET" && !req.headers["x-employee"])
    res.render("dashboard");
  else if(req.method === "GET" && req.headers["x-employee"]) {
    var events = [], details = {};
    employee.findOne({"empUnique": mapper.dashboard.empLoad}, function(e, result){
      mapper.calendar.getEvents(events, result.empAccessToken, callback);
      function callback() {
        result.empAccessToken = null;
        result.empRefreshToken = null;
        result.empIDToken = null;
        result.nextSyncToken = null;
        res.json({
          empDetails: result,
          empEvents: events
        });
      }
    });
  }
};
