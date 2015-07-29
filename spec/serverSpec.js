var request = require("request");

describe("Server Test", function(){
  describe("visitorAppointment API", function(){
    it("returns 200 and visitor object stored in DB with legit POST", function(done){
      request.post({
        url: "http://localhost:8080/visitorAppointment",
        form: {
          visitorPicture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c86.27.335.335/s50x50/295627_1377866762425331_389060703_n.jpg?oh=1c60d0c4ef5623b2a224175082cd812d&oe=56572EA7&__gda__=1444953404_64e7656d37448983abac40f9461bd39a",
          visitorName: "James Potter",
          visitorEmail: "james.potter@hogwarts.com",
          visitorNumber: "1234567891",
          visitorCompany: "Gryffindor",
          empUnique: "110004310269636919935",
          date: new Date(2015, 6, 12),
          slot: 1500
        }
      }, function(err, res, body){
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});
  // describe("http get request", function(){
    // it("returns 200", function(done){
    //   var agent = new HttpsProxyAgent({
    //     proxyHost: "172.50.6.230",
    //     proxyPort: "8080"
    //   });
    //   var req = https.request({host: "medium.com", method: "GET", path: "/", agent: agent}, function(res){
    //     var output = ""
    //     res.on('data', function(d) {
    //       output += d;
    //     });
    //     res.on("end", function(){
    //       console.log(output);
    //       expect(res.statusCode).toBe(200);
    //     });
    //   });
    //   req.end();
    //   done();
    // }, 20000);
  //   request.get("http://rve.org.uk/dumprequest", function(err, res){
  //     expect(res.statusCode).toBe(200);
  //     done();
  //   });
  // });
  // function callback() {
  //   employee.findOne({"empUnique":"110004310269636919935"}, function(e, result){
  //     request.post("https://www.googleapis.com/oauth2/v3/token", {
  //       proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
  //       form: {
  //         refresh_token: result.empRefreshToken,
  //         client_id: "831835373457-78b2j3qbmj0mo2af1l243qjt8bked26l.apps.googleusercontent.com",
  //         client_secret: "LQ6VmO-xP1iLte8o_KkYkCc_",
  //         grant_type: "refresh_token"
  //       }
  //     }, function(err, accessJSON){
  //       if(err) console.log(err);
  //       else {
  //         result.empAccess.access_token = JSON.parse(accessJSON).access_token;
  //         result.save();
  //       }
  //     });
  //   });
  // }
  // console.log("access_token will be updated every 60 mins");
  // callback();
  // .use(function(req, res, next){
  //   function callback() {
  //     employee.findOne({"empUnique":"110004310269636919935"}, function(e, result){
  //       request.post("https://www.googleapis.com/oauth2/v3/token", {
  //         proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
  //         form: {
  //           refresh_token: result.empRefreshToken,
  //           client_id: "831835373457-78b2j3qbmj0mo2af1l243qjt8bked26l.apps.googleusercontent.com",
  //           client_secret: "LQ6VmO-xP1iLte8o_KkYkCc_",
  //           grant_type: "refresh_token"
  //         }
  //       }, function(err, accessJSON){
  //         if(err) console.log(err);
  //         else {
  //           result.empAccess.access_token = JSON.parse(accessJSON).access_token;
  //           result.save();
  //         }
  //       });
  //     });
  //   }
  //   console.log("access_token will be updated every 60 mins");
  //   setInterval(callback, 3600000);
  //   next();
  // })
//   describe("GET request to server root path", function(){
//     it("returns 200", function(done){
//       request.get("http://localhost:8080/", function(err, res, body){
//         expect(res.statusCode).toBe(200);
//         done();
//       });
//     });
//     it("returns 403 with random request path", function(done){
//       request.get("http://localhost:8080/bullshit", function(err, res, body){
//         expect(res.statusCode).toBe(403);
//         done();
//       });
//     });
//   });
//
//   describe("signupEmployee API", function(){
//     it("returns 404 with request.method!= POST", function(done){
//       request.get("http://localhost:8080/signupEmployee", function(err, res, body){
//         expect(res.statusCode).toBe(404);
//         done();
//       });
//     });
//     it("returns 400 with POST request with incomplete employee data", function(done){
//       request.post({
//         url: "http://localhost:8080/signupEmployee",
//         form: {emailEmployee: "draco@titillandus.com"}
//       }, function(err, res, body){
//         expect(res.statusCode).toBe(400);
//         done();
//       });
//     });
//     it("returns 403 when employee has already signed up", function(done){
//       request.post({
//         url: "http://localhost:8080/signupEmployee",
//         form: {
//           userNameEmployee: "Arthur Weasley",
//           passwordEmployee: "Weasley",
//           emailEmployee: "shruti.shivakumar@gmail.com"
//         }
//       }, function(err, res, body){
//         expect(res.statusCode).toBe(403);
//         done();
//       });
//     });
//     // it("returns 200 and employee object stored in DB with legit POST", function(done){
//     //   request.post({
//     //     url: "http://localhost:8080/signupEmployee",
//     //     form: {
//     //       userNameEmployee: "Rita Skeeter",
//     //       passwordEmployee: "Skeeter",
//     //       emailEmployee: "shruti.shivakumar@gmail.com"
//     //     }
//     //   }, function(err, res, body){
//     //     expect(res.statusCode).toBe(200);
//     //     done();
//     //   });
//     // });
//   });
//
//   describe("loginEmployee API", function(){
//     it("returns 400 with POST request with incomplete employee data", function(done){
//       request.post({
//         url: "http://localhost:8080/loginEmployee",
//         form: {userNameEmployee: "Rita Skeeter"}
//       }, function(err, res, body){
//         expect(res.statusCode).toBe(400);
//         done();
//       });
//     });
//     it("returns 403 when employee has not signed up or has provided incorrect password", function(done){
//       request.post({
//         url: "http://localhost:8080/loginEmployee",
//         form: {
//           userNameEmployee: "Arthur Weasley",
//           passwordEmployee: "bullshit"
//         }
//       }, function(err, res, body){
//         expect(res.statusCode).toBe(403);
//         done();
//       });
//     });
//     it("returns 200 when legit employee logs in", function(done){
//       request.post({
//         url: "http://localhost:8080/loginEmployee",
//         form: {
//           userNameEmployee: "Arthur Weasley",
//           passwordEmployee: "Weasley"
//         }
//       }, function(err, res, body){
//         expect(res.statusCode).toBe(200);
//         done();
//       });
//     });
//     it("returns 200 for GET request when legit employee forgets her password", function(done){
//       request.get("http://localhost:8080/loginEmployee?userNameEmployee=" + "Arthur Weasley", function(err, res, body){
//         expect(res.statusCode).toBe(200);
//         done();
//       });
//     }, 10000);
//   });
// });
