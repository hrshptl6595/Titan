var employee = require("./modelE");
var jwt = require("jsonwebtoken");
var mapper = require("./mapper");
var url = require("url");
var mailer = require("nodemailer");

exports.typeCheck = function (req,res,next) {
  if(req.method == "POST")
    mapper.loginE.loginE(req,res,next);
  else if(req.method == "GET")
    mapper.loginE.forgotPassword(req,res,next);
  else
    res.status(404).send("Invalid HTTP Method!");
};

exports.loginE = function(req,res,next) {
  console.log(req);
  employee.findOne({"userNameE": req.body.userNameE}, function(err, result){
    if(err) res.send("oops! error!");
    else if(!result) res.send("user does not exist!!");
    else{
      if(result.passwordE!=req.body.passwordE) res.send("incorrect password!");
      else{
        var token = jwt.sign(result, "moony wormtail padfoot prongs", {expiresInMinutes: 1440});
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        res.write("logged in!");
        res.end();
        console.log(res);
        next();
      }
    }
  });
};

exports.forgotPassword = function(req,res,next) {
  console.log(req);
  var userName = url.parse(req.url,true).query.userName;
  console.log(userName);
  if(!userName)
    res.send("Please provide your user name!");
  else {
    user.findOne({"userName": userName}, function(err, result) {
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

// exports.login = server.post("/login", function(req,res){
//   user.findOne({"userName": req.body.userName}, function(err, user){
//     if(err) res.send("oops! error!");
//     else if(!user) res.send("user does not exist!!");
//     else{
//       if(user.password!=req.body.password) res.send("incorrect password!");
//       else{
//         var token = jwt.sign(user, server.get('secret'), {expiresInMinutes: 1440});
//         res.writehead(200, {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
//         });
//         res.write(token);
//         res.end();
//         console.log("signed in!");
//         console.log(res);
//       }
//     }
//   });
// });
