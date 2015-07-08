var mapper = require("./mapper");
var url = require("url");
var employee = require("./employeeModel");

exports.typeCheck = function(req, res, next){
  if(req.method === "GET")
    mapper.employees.getEmployees(req, res, next);
};

exports.getEmployees = function(req, res, next) {
  var query = url.parse(req.url, true).query;
  console.log(query);
  var events = [], details = {};
  employee.findOne({"empName":query.name}, function(err, result){
    mapper.calendar.refreshToken(result, events, callback);
    function callback() {
      result.empAccessToken = null;
      result.empRefreshToken = null;
      result.empIDToken = null;
      result.nextSyncToken = null;
      console.log(result);
      console.log(events);
      res.json({
        empDetails: result,
        empEvents: events
      });
    }
  });
};
