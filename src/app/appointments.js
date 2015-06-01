var jwt = require("jsonwebtoken");
var mapper = require("./mapper");

exports.typeCheck = function (req,res,next) {
  if(req.method != "GET"){
    res.writeHead(404); res.json({"message":"Invalid HTTP code!"});
  }
  else
    mapper.appointments.appointments(req,res,next);
};

exports.appointments = function (req,res,next){
  var token = req.get("Authorization").slice(7);  
  if(token)
  jwt.verify(token,"moony wormtail padfoot prongs",function(err,decoded){
    if(err) res.send("Invalid Token");
    else{
      console.log(decoded);
      // req.decoded=decoded;
      res.send(decoded);
      next();
    }
  });
  else{
    res.status(403).send("No token!!");
  }
}
