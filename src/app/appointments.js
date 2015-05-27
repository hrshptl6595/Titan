var jwt = require("jsonwebtoken");
var mapper = require("./mapper");

exports.typeCheck = function (req,res,next) {
  if(req.method != "POST")
    res.status(404).send("Invalid HTTP Method!")
  else
    mapper.appointments.appointments(req,res,next);
};

exports.appointments = function (req,res,next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token)
  jwt.verify(token,"moony wormtail padfoot prongs",function(err,decoded){
    if(err) res.send("Invalid Token");
    else{
      console.log(decoded);
      req.decoded=decoded;
      res.send("at appointments");
      next();
    }
  })
  else{
    res.status(403).send("No token!!");
  }
}
