var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
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
  .use("/signupV",mapper.signupV.typecheck)
  .use("/signupE", mapper.signupE.typeCheck)
  .use("/loginE", mapper.loginE.typeCheck)
  .use("/appointments", mapper.appointments.typeCheck)
  // .use("/", express.static('./src/markup'))
  .use("/", function(req,res,next) {
    res.send("Hello World!");
  })
  .listen(port, function(){
    console.log("Request Passed!");
  });
