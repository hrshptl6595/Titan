var mapper = require("./mapper");
var request = require("request");
var jwt = require("jsonwebtoken");
var jwkToPem = require("jwk-to-pem");
var fs = require("fs");
var employee = require("./employeeModel");

exports.typeCheck = function(req, res, next) {
  if(req.method === "GET" && !req.headers["authorization"])
    res.render("dashboard");
  else if(req.method === "GET" && req.headers["authorization"]) {
    var events = [];
    mapper.calendar.refreshAccessToken(events, callback);
    function callback() {
      employee.findOne({"empUnique": req.headers["authorization"].slice(7)}, function(e, result){
        delete result.empAccessToken;
        delete result.empRefreshToken;
        delete result.empIDToken;
        res.json({
          empDetails: result,
          empEvents: events
        });
      });
    }
  }
};
