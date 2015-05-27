var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var mapper = require("./src/app/mapper");
var server = express();
var port = 8080;

mongoose.connect("mongodb://localhost/users");
var db = mongoose.connection;
db.once("open", function() {
  console.log("connection successful");
});

server
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(function(req,res,next){
    console.log(req.method, req.url);
    next();
  })
  .use("/signup", mapper.signup.typeCheck)
  .use("/login", mapper.login.typeCheck)
  .use("/appointments", mapper.appointments.typeCheck)
  .use("/", express.static('./src/markup'))
  .listen(port, function(){
    console.log("Request Passed!");
  });
