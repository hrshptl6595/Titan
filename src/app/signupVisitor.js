var visitor = require("./modelVisitor");
var mapper = require("./mapper");
var jwt = require("jsonwebtoken");

exports.typeCheck = function(req,res,next) {
  if(req.method !="POST"){
    res.writeHead(404); res.write("Invalid HTTP code!"); res.end();
  }
  else
    mapper.signupVisitor.signupVisitor(req,res,next);
};

exports.signupVisitor = function(req,res,next) {
  if(!(req.body.nameVisitor && req.body.emailVisitor && req.body.companyVisitor && req.body.mobnumVisitor)) {
    res.writeHead(403); res.write("Incomplete data"); res.end();
  } // duplicate signup check!!!
  else {
    var newVisitor = new visitor ({
      nameVisitor: req.body.nameVisitor,
      emailVisitor: req.body.emailVisitor,
      companyVisitor: req.body.companyVisitor,
      mobnumVisitor: req.body.mobnumVisitor
    });
    newVisitor.save(function(err,result) {
      if(err) {
        res.writeHead(500); res.write("Unable to signup!"); res.end();
      }
      else{
        console.log(result);
        var token = jwt.sign(result, "moony wormtail padfoot prongs");
        res.json({
          "accessToken": token
        });
      }
    });
  }
};
