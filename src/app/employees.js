var mapper = require("./mapper");
var url = require("url");
var host = require("./global");
var employee = require("./employeeModel");

exports.typeCheck = function(req, res, next){
  if(req.method === "GET")
    mapper.employees.getEmployees(req, res, next);
};

exports.getEmployees = function(req, res, next) {
  var query = url.parse(req.url, true).query;
  console.log(query);
  var events = [], details = {};
  if(query.name) {
    var regex = new RegExp("^" + query.name + "$", "i");
    employee.findOne({"empName": regex}, function(err, result){
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
  }
  else if(query.department) {
    var regexp = new RegExp("/" + query.department + "/");
    employee.find({"empDept": query.department}, function(err, results){
      for(var i=0;i<results.length;i++) {
        results[i] = {
          empName: results[i].empName
        };
      }
      res.json(results);
    });
  }
};
