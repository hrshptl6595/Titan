var mapper = require("./mapper");
var request = require("request");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var employee = require("./employeeModel");
var visitor = require("./visitorModel");
// var host = "localhost";
var host = "titan-scheduler.in";

exports.empLoad = null;

exports.typeCheck = function(req, res, next) {
  console.log(req.headers);
  if(req.method === "GET" && req.headers["x-employee"] && req.cookies.accessToken) {
    mapper.dashboard.verification(req.cookies.accessToken, res, function(arg){
      employee.findOne({"empUnique": arg}, "empName empEmail empPicture empDept empNumber empUnique", function(e, result){
        visitor.find({"empUnique": arg, "approved": null}, function(e, pendingArray){
          visitor.find({"empUnique": arg, "date": new Date(), "approved": true}, function(e, todayArray){
            res.json({
              empDetails: result,
              pendingReqsArray: pendingArray,
              visitorsTodayArray: todayArray
            });
            console.log({
              empDetails: result,
              pendingReqsArray: pendingArray,
              visitorsTodayArray: todayArray
            })
          });
        });
      });
    });
  }
  else if(req.method === "GET" && req.headers["x-calendar"] && req.cookies.accessToken) {
    var events = [];
    mapper.dashboard.verification(req.cookies.accessToken, res, function(arg){
      employee.findOne({"empUnique": arg}, function(e, result){
        mapper.calendar.getEvents(events, result.empAccessToken, callback);
        function callback(){
          res.json({
            empEvents: events
          });
        }
      });
    });
  }
  else if(req.method === "GET") {
    var empLoad;
    if(req.cookies.accessToken) {
      mapper.dashboard.verification(req.cookies.accessToken, res, function(arg){
        res.render("employee");
      });
    }
    else{
      empLoad = mapper.dashboard.empLoad;
      mapper.dashboard.empLoad = null;
      res.render("employee", function(err, html){
        res.cookie(
          "accessToken",
          jwt.sign({empUnique: empLoad}, "moony wormtail padfoot prongs", {expiresInMinutes: 60}),
          {httpOnly: true}
        );
        res.send(html);
      });
    }
  }
  else if(req.method === "POST" && req.cookies.accessToken){
    mapper.dashboard.verification(req.cookies.accessToken, res, function(arg){
      visitor.findOne({"visitorNumber": req.body.visitor.visitorNumber}, function(err, result){
        result.approved = req.body.visitor.approved;
        result.suggestedAlternative = req.body.visitor.suggestedAlternative;
        result.date = req.body.visitor.date;
        result.slot = req.body.visitor.slot;
        result.save();
      });
      if(req.body.visitor.suggestedAlternative){
        employee.findOne({"empUnique": req.body.visitor.empUnique}, function(err, result){
          mapper.visitorAppointment.sendAlternativeMailer(result, req.body.visitor);
        });
      }
      if(req.body.visitor.approved)
        employee.findOne({"empUnique": req.body.visitor.empUnique}, function(err, result){
          mapper.calendar.refreshToken(result, req.body.visitor, callback);
          function callback(myEvent){
            res.send(myEvent);
          }
        });
      else
        res.send("disapproved");
    })
  }
};

exports.verification = function(token, res, callback) {
  jwt.verify(token, "moony wormtail padfoot prongs", function(err, decoded){
    console.log(err);
    console.log(decoded);
    if((err && err.name==="TokenExpiredError") || (decoded.empUnique==null)) {
      res.clearCookie("accessToken");
      res.setHeader("x-redirect","true");
      res.redirect(301, "http://" + host + ":8080/employeeLogin");
      console.log("redirecting...........");
    }
    else
      callback(decoded.empUnique);
  });
}
