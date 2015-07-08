var visitor = require("./visitorModel");
var mapper = require("./mapper");

exports.typeCheck = function(req,res,next) {
  if(req.method == "GET")
    res.render("visitorAppointment");
  else if (req.method == "POST" && req.get("x-visitorCheck"))
    mapper.visitorAppointment.visitorCheck(req,res,next);
  else if(req.method === "POST")
    mapper.visitorAppointment.insertAppointment(req, res, next);
  else{
    res.writeHead(404); res.write("Invalid HTTP code"); res.end();
  }
};

exports.insertAppointment = function(req, res, next) {
  visitor.findOne({"visitorEmail": req.body.visitorEmail}, function(e, result){
    if(!result){

    }
  });
}

exports.visitorCheck = function(req,res,next) {
  if(!(req.body.visitorName)){
    res.writeHead(400); res.write("Incomplete data"); res.end();
  }
  else {
    visitor.findOne({"visitorName": req.body.visitorName}, function(err, result){
      if(err) {res.writeHead(500); res.write("Server Error"); res.end();}
      else {
        console.log(result);
        res.json(result);
      }
    });
  }
  // if(!(req.body.nameVisitor && req.body.emailVisitor && req.body.companyVisitor && req.body.mobnumVisitor)) {
  //   res.writeHead(403); res.write("Incomplete data"); res.end();
  // } // duplicate signup check!!!
  // else {
  //   var newVisitor = new visitor ({
  //     nameVisitor: req.body.nameVisitor,
  //     emailVisitor: req.body.emailVisitor,
  //     companyVisitor: req.body.companyVisitor,
  //     mobnumVisitor: req.body.mobnumVisitor
  //   });
  //   newVisitor.save(function(err,result) {
  //     if(err) {
  //       res.writeHead(500); res.write("Unable to signup!"); res.end();
  //     }
  //     else{
  //       console.log(result);
  //       var token = jwt.sign(result, "moony wormtail padfoot prongs");
  //       res.json({
  //         "accessToken": token
  //       });
  //     }
  //   });
  // }
};
