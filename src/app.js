var host = require("./app/global");
var express = require("express");
var mapper = require("./app/mapper");
var request = require("request");
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var app = express();
var port = process.env.PORT || 8080;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app
  .use(cookieParser())
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(function(req,res,next){
    console.log(req.method, req.url);
    next();
  })
  .use(express.static("views"))
  .use(express.static("views/partials"))
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
