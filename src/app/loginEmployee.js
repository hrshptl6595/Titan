var employee = require("./modelEmployee");
var jwt = require("jsonwebtoken");
var mapper = require("./mapper");
var url = require("url");
var mailer = require("nodemailer");

exports.typeCheck = function (req,res,next) {
  if(req.method == "POST")
    mapper.loginEmployee.loginEmployee(req,res,next);
  else if(req.method == "GET")
    mapper.loginEmployee.forgotPassword(req,res,next);
  else {
   res.writeHead(404); res.write("Invalid HTTP code!"); res.end();
  }
};

exports.loginEmployee = function(req,res,next) {
  employee.findOne({"userNameEmployee": req.body.userNameEmployee}, function(err, result){
    if(err) {res.writeHead(500);res.write("Server error");res.end();}
    else if(!result) {res.writeHead(403);res.write("user does not exist");res.end();}
    else{
      if(result.passwordEmployee!=req.body.passwordEmployee) {res.writeHead(403);res.write("Incorrect Password");res.end();}
      else{
        var token = jwt.sign(result, "moony wormtail padfoot prongs");
        console.log(token);
        res.json({
          "accessToken": token
        });
      }
    }
  });
};

exports.forgotPassword = function(req,res,next) {
  console.log(req);
  var userName = url.parse(req.url,true).query.userNameEmployee;
  console.log(userNameEmployee);
  if(!userNameEmployee)
    res.json({"message":"Please provide your user name!"});
  else {
    user.findOne({"userNameEmployee": userNameEmployee}, function(err, result) {
      if(err) res.status(500).send("oops! error!");
      else if(!result) res.status(404).send("Couldn't find you!");
      else{
        var smtp = mailer.createTransport("SMTP", {
          service: "Gmail",
          auth: {
            user: "cts.titancompany@gmail.com",
            pass: "titan@2014"
          }
        });
        var mailOptions = {
          from: "cts.titancompany@gmail.com",
          to: result.email,
          subject: "Password Recovery lol",
          text: "Your password is " + result.password
        };
        smtp.sendMail(mailOptions, function(error, success) {
          if(error) console.log(error);
          else console.log(success);
          res.send("Check your email!");
        });
      }
    });
  }
};
