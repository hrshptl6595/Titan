var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var uriUtil = require("mongodb-uri");
var mapper = require("./src/app/mapper");
var server = express();
var port = process.env.PORT || 8080;

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
var mongoLabUri = "mongodb://heroku_app37234002:sur5lnj2in6matlr1s9jp7gkpj@ds031892.mongolab.com:31892/heroku_app37234002";
var mongooseUri = uriUtil.formatMongoose(mongoLabUri);
// var mongooseUri = "mongodb://localhost/users";

mongoose.connect(mongooseUri,options);
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
  // .use("/", express.static('./src/markup'))
  .use("/", function(req,res,next) {
    res.send("Hello World!");
  })
  .listen(port, function(){
    console.log("Request Passed!");
  });
