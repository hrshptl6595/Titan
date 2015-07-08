var express = require("express");
var mapper = require("./app/mapper");
var employee = require("./app/employeeModel");
var request = require("request");
var app = express();
var port = process.env.PORT || 8080;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app
  .use(function(req,res,next){
    console.log(req.method, req.url);
    next();
  })
  .use(express.static(__dirname + "/views"))
  .use(express.static(__dirname + "/views/partials"))
  .use("/visitorAppointment", mapper.visitorAppointment.typeCheck)
  .use("/employeeLogin", mapper.employeeLogin.typeCheck)
  .use("/dashboard", mapper.dashboard.typeCheck)
  .use("/employees", mapper.employees.typeCheck)
  .use(function(req,res,next){
    res.writeHead(403); res.write("Invalid path!"); res.end();
  })
  .listen(port, function(){
    console.log("Request Passed!" + __dirname);
  });
