var user = require("./userModel");
var mapper = require("./mapper");

exports.typeCheck = function (req,res,next) {
  if(req.method != "POST")
    res.status(404).send("Invalid HTTP Method!")
  else
    mapper.signup.signup(req,res,next);
};

exports.signup = function(req,res,next) {
  console.log(req);
  if(!(req.body.userName && req.body.email && req.body.password))
    res.status(403).send("Incomplete data!");
  // else if
  //   user.findOne({"userName": req.body.userName}, function(err, result) {
  //     if(err) res.status(500).send("oops! error!");
  //     else if(result) res.send("you have already signed up!");
  //   });
  else{
    var newUser = new user ({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    });
    newUser.save(function(err,result) {
      if(err)
        res.status(500).send("Unable to signup!");
      else{
        console.log(result);
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        res.write("Thank you for signing up!");
        res.end();
      }
    });
  }
};
