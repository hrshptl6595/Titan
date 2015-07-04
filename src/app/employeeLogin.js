var mapper = require("./mapper");
var url = require("url");
var request = require("request");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var employee = require("./employeeModel");

exports.fileRead = function(res, credentials, callback, req) {
  request.get("https://accounts.google.com/.well-known/openid-configuration", {
    // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/"
    proxy: null
  }, function(err, response, body){
    if(err) {
      console.log(err);
      res.writeHead(500); res.write("Server Error"); res.end();
    }
    else {
      credentials = (JSON.parse(body) || body);
      credentials.client_id = "831835373457-78b2j3qbmj0mo2af1l243qjt8bked26l.apps.googleusercontent.com";
      credentials.client_secret = "LQ6VmO-xP1iLte8o_KkYkCc_";
      credentials.redirect_uris = ["http://localhost:8080/employeeLogin"];
      credentials.state = jwt.sign({client_id: credentials.client_id}, "moony wormtail padfoot prongs");
      callback(res, credentials, req);
    }
  });
};

exports.getAuthUrl = function(res, credentials) {
  var authRequest = {
    client_id: credentials.client_id,
    redirect_uri: credentials.redirect_uris[0],
    response_type: "code",
    scope: "openid profile email https://www.googleapis.com/auth/calendar",
    state: credentials.state,
    access_type: "offline",
    include_granted_scopes: true
  };
  var authUrl = "https://accounts.google.com/o/oauth2/v2/auth" + '?';
  for(key in authRequest)
    authUrl += key + "=" + authRequest[key] + "&";
  authUrl = authUrl.substr(0, authUrl.length -1);
  credentials.authUrl = encodeURI(authUrl);
  res.json({
    encodedURI: credentials.authUrl
  });
};

exports.getAccessToken = function(res, credentials, req) {
  if(credentials.client_id === (jwt.verify(req.query.state, "moony wormtail padfoot prongs")).client_id) {
    request.post(credentials.token_endpoint, {
      // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
      proxy: null,
      form: {
        code: req.query.code,
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        redirect_uri: credentials.redirect_uris[0],
        grant_type: "authorization_code"
      }
    }, function(err, response, accessJSON){
      if(err) console.log(err);
      else
        request.get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + JSON.parse(accessJSON).access_token, {
          // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/"
          proxy: null
        }, function(e,r, userInfo) {
          if(e) console.log(e);
          else
            employee.findOne({"empUnique": JSON.parse(userInfo).sub}, function(error, result){
              if(error) console.log(error);
              else if(!result) {
                var newEmployee = new employee({
                  empIDToken: JSON.parse(accessJSON).id_token,
                  empAccessToken: JSON.parse(accessJSON).access_token,
                  empRefreshToken: JSON.parse(accessJSON).refresh_token,
                  empName: JSON.parse(userInfo).name,
                  empEmail: JSON.parse(userInfo).email,
                  empPicture: JSON.parse(userInfo).picture,
                  empUnique: JSON.parse(userInfo).sub
                });
                newEmployee.save(function(E, newEmp){
                  if(E) console.log(E);
                });
              }
              else if(result) {
                result.empAccess = JSON.parse(accessJSON);
                result.empAccessToken = JSON.parse(accessJSON).access_token;
                result.save();
              }
            });
        });
    });
  }
};

exports.typeCheck = function(req, res, next){
  if(req.method === "GET" && !req.headers["x-googleauth"] && !req.query.code)
    res.render("login");
  else if(req.method === "GET" && req.headers["x-googleauth"]) {
    var credentials;
    mapper.employeeLogin.fileRead(res, credentials, mapper.employeeLogin.getAuthUrl);
  }
  else if(req.method === "GET" && req.query.code) {
    res.writeHead(301, {Location: "http://localhost:8080/barney"});
    res.end("draco dormiens nunquam titillandus", callback);
    function callback(){
      var credentials;
      mapper.employeeLogin.fileRead(res, credentials, mapper.employeeLogin.getAccessToken, req);
    }
  }
};
