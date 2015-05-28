var mapper = require("./mapper");
var employee = require("./modelE");

exports.typeCheck = function (req,res,next) {
  if(req.method != "POST")
    res.status(404).send("Invalid HTTP Method!")
  else
    mapper.signupE.signupE(req,res,next);
};

exports.signupE = function(req,res,next) {
  console.log(req);
  if(!(req.body.userNameE && req.body.emailE && req.body.passwordE))
    res.status(403).send("Incomplete data!");
  // else if
  //   user.findOne({"userName": req.body.userName}, function(err, result) {
  //     if(err) res.status(500).send("oops! error!");
  //     else if(result) res.send("you have already signed up!");
  //   });
  else{
    var newEmployee = new employee ({
      userNameE: req.body.userNameE,
      emailE: req.body.emailE,
      passwordE: req.body.passwordE
    });
    newEmployee.save(function(err,result) {
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