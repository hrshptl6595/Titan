var jwt = require("jsonwebtoken");
var mapper = require("./mapper");

exports.typeCheck = function (req,res,next) {
  if(req.method != "GET"){
    res.writeHead(404); res.write("Invalid HTTP code!"); res.end();
  }
  else
    mapper.appointments.appointments(req,res,next);
};

exports.appointments = function (req,res,next){
  var token = req.get("Authorization").slice(7);
  if(token)
  jwt.verify(token,"moony wormtail padfoot prongs",function(err,decoded){
    if(err) {res.writeHead(403); res.write("Invalid token!"); res.end();}
    else{
      console.log(decoded);
      res.json(decoded);
    }
  });
  else{
    res.writeHead(403); res.write("No token!"); res.end();
  }

}
