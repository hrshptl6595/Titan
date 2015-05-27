var user = require("./userModel");
var jwt = require("jsonwebtoken");
var mapper = require("./mapper");

exports.typeCheck = function (req,res,next) {
  if(req.method != "POST")
    res.status(404).send("Invalid HTTP Method!")
  else
    mapper.login.login(req,res,next);
};

exports.login = function(req,res,next) {
  console.log(req);
  user.findOne({"userName": req.body.userName}, function(err, user){
    if(err) res.send("oops! error!");
    else if(!user) res.send("user does not exist!!");
    else{
      if(user.password!=req.body.password) res.send("incorrect password!");
      else{
        var token = jwt.sign(user, "moony wormtail padfoot prongs", {expiresInMinutes: 1440});
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        res.write(token);
        res.end();
        console.log("signed in!");
        console.log(res);
        next();
      }
    }
  });
};

// exports.login = server.post("/login", function(req,res){
//   user.findOne({"userName": req.body.userName}, function(err, user){
//     if(err) res.send("oops! error!");
//     else if(!user) res.send("user does not exist!!");
//     else{
//       if(user.password!=req.body.password) res.send("incorrect password!");
//       else{
//         var token = jwt.sign(user, server.get('secret'), {expiresInMinutes: 1440});
//         res.writehead(200, {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
//         });
//         res.write(token);
//         res.end();
//         console.log("signed in!");
//         console.log(res);
//       }
//     }
//   });
// });
