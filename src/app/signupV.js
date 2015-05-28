var visitor = require("./modelV");
var mapper = require("./mapper");

exports.typecheck = function(req,res,next) {
  if(req.method !="POST"){
    res.writeHead(404); res.write("Invalid HTTP code!"); res.end();
  }
  else
    mapper.signupV.signupV(req,res,next);
};

exports.signupV = function(req,res,next) {
  if(!(req.body.nameV && req.body.emailV && req.body.companyV && req.body.mobnumV)) {
    res.writeHead(403); res.write("Incomplete data"); res.end();
  } // duplicate signup check!!!
  else {
    var newVisitor = new visitor ({
      nameV: req.body.nameV,
      emailV: req.body.emailV,
      companyV: req.body.companyV,
      mobnumV: req.body.mobnumV
    });
    newVisitor.save(function(err,result) {
      if(err) {
        res.writeHead(500); res.write("Unable to signup!"); res.end();
      }
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
