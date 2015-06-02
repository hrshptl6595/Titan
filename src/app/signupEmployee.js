var mapper = require("./mapper");
var employee = require("./modelEmployee");
var jwt = require("jsonwebtoken");

exports.typeCheck = function (req,res,next) {
  if(req.method != "POST") {
    res.writeHead(404); res.write("Invalid HTTP code!"); res.end();
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
      res.writeHead(500); res.write("oops! Db error!"); res.end();
    }
    else if (result) {res.writeHead(200);res.write("you have already signed up!");res.end();}
    else if (!result) {
      var newEmployee = new employee ({
        userNameEmployee: req.body.userNameEmployee,
        emailEmployee: req.body.emailEmployee,
        passwordEmployee: req.body.passwordEmployee
      });
      newEmployee.save(function(err,result) {
        if(err) {res.writeHead(500);res.write("Server error");res.end();}
        else{
          console.log(result);
          res.json(result);
        }
      });
    }
  });
};
