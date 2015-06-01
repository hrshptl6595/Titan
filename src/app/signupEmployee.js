var mapper = require("./mapper");
var employee = require("./modelEmployee");
var jwt = require("jsonwebtoken");

exports.typeCheck = function (req,res,next) {
  if(req.method != "POST") {
    res.writeHead(404); res.json({"message":"Invalid HTTP code!"});
  }
  else
    mapper.signupEmployee.signupEmployee(req,res,next);
};

exports.signupEmployee = function(req,res,next) {
  console.log(req);
  if(!(req.body.userNameEmployee && req.body.emailEmployee && req.body.passwordEmployee)) {
    res.writeHead(404); res.write("Incomplete data"); res.end();
  }
  employee.findOne({"userNameEmployee": req.body.userNameEmployee}, function(err, result) {
    if(err) {
      res.writeHead(500); res.json({"message":"Invalid HTTP code!"});
    }
    else if (result) res.json({"message":"you have already signed up!"});
    else if (!result) {
      var newEmployee = new employee ({
        userNameEmployee: req.body.userNameEmployee,
        emailEmployee: req.body.emailEmployee,
        passwordEmployee: req.body.passwordEmployee
      });
      newEmployee.save(function(err,result) {
        if(err) res.json({"message":"error"});
        else{
          console.log(result);
          // var token = jwt.sign(result, "moony wormtail padfoot prongs", {expiresInMinutes: 1440});
          res.json({
            "result": result,
            // "accessToken": token,
            // "expiresInMins": 1440
          });
        }
      });
    }
  });
};
