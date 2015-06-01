var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");
var mapper = require("./app/mapper");
var app = express();
var port = process.env.PORT || 8080;

app
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(function(req,res,next){
    console.log(req.method, req.url);
    next();
  })
  .use(express.static(__dirname + "/views"))
  .use("/signupVisitor",mapper.signupVisitor.typeCheck)
  .use("/loginVisitor", mapper.loginVisitor.typeCheck)
  .use("/signupEmployee", mapper.signupEmployee.typeCheck)
  .use("/loginEmployee", mapper.loginEmployee.typeCheck)
  .use("/appointments", mapper.appointments.typeCheck)
  .listen(port, function(){
    console.log("Request Passed!" + __dirname);
  });
