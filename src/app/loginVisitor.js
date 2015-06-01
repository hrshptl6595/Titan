var mapper = require("./mapper");
var jwt = require("jsonwebtoken");
var visitor = require("./modelVisitor");

exports.typeCheck = function (req,res,next) {
  if(req.method == "POST")
    mapper.loginVisitor.loginVisitor(req,res,next);
  else {
    res.writeHead(404); res.write("Invalid HTTP code!"); res.end();
  }
};

exports.loginVisitor = function(req,res,next) {
  console.log(req);
  var token = req.get("Authorization").slice(7);
  if(token)
    jwt.verify(token, "moony wormtail padfoot prongs", function(err, decoded) {
      if(err) res.json({"message": "error"});
      else
        visitor.findOne({"nameVisitor":decoded.nameVisitor}, function(err, result) {
          if(err) res.json({"message":"error"});
          else {
            result.empName = req.body.empName;
            result.Time = req.body.Time;
            result.place = req.body.place;
            result.save(function(err,r){
              if(err) res.json({"message":"error"});
              else res.json(r);
            });
          }
        });
    });
};
