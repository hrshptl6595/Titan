var request = require("request");

describe("Server Test", function(){
  describe("GET request to server root path", function(){
    it("returns 200", function(done){
      request.get("http://localhost:8080/", function(err, res, body){
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("returns 403 with random request path", function(done){
      request.get("http://localhost:8080/bullshit", function(err, res, body){
        expect(res.statusCode).toBe(403);
        done();
      });
    });
  });

  describe("signupEmployee API", function(){
    it("returns 404 with request.method!= POST", function(done){
      request.get("http://localhost:8080/signupEmployee", function(err, res, body){
        expect(res.statusCode).toBe(404);
        done();
      });
    });
    it("returns 400 with POST request with incomplete employee data", function(done){
      request.post({
        url: "http://localhost:8080/signupEmployee",
        form: {emailEmployee: "draco@titillandus.com"}
      }, function(err, res, body){
        expect(res.statusCode).toBe(400);
        done();
      });
    });
    it("returns 403 when employee has already signed up", function(done){
      request.post({
        url: "http://localhost:8080/signupEmployee",
        form: {
          userNameEmployee: "Arthur Weasley",
          passwordEmployee: "Weasley",
          emailEmployee: "shruti.shivakumar@gmail.com"
        }
      }, function(err, res, body){
        expect(res.statusCode).toBe(403);
        done();
      });
    });
    // it("returns 200 and employee object stored in DB with legit POST", function(done){
    //   request.post({
    //     url: "http://localhost:8080/signupEmployee",
    //     form: {
    //       userNameEmployee: "Rita Skeeter",
    //       passwordEmployee: "Skeeter",
    //       emailEmployee: "shruti.shivakumar@gmail.com"
    //     }
    //   }, function(err, res, body){
    //     expect(res.statusCode).toBe(200);
    //     done();
    //   });
    // });
  });

  describe("loginEmployee API", function(){
    it("returns 400 with POST request with incomplete employee data", function(done){
      request.post({
        url: "http://localhost:8080/loginEmployee",
        form: {userNameEmployee: "Rita Skeeter"}
      }, function(err, res, body){
        expect(res.statusCode).toBe(400);
        done();
      });
    });
    it("returns 403 when employee has not signed up or has provided incorrect password", function(done){
      request.post({
        url: "http://localhost:8080/loginEmployee",
        form: {
          userNameEmployee: "Arthur Weasley",
          passwordEmployee: "bullshit"
        }
      }, function(err, res, body){
        expect(res.statusCode).toBe(403);
        done();
      });
    });
    it("returns 200 when legit employee logs in", function(done){
      request.post({
        url: "http://localhost:8080/loginEmployee",
        form: {
          userNameEmployee: "Arthur Weasley",
          passwordEmployee: "Weasley"
        }
      }, function(err, res, body){
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("returns 200 for GET request when legit employee forgets her password", function(done){
      request.get("http://localhost:8080/loginEmployee?userNameEmployee=" + "Arthur Weasley", function(err, res, body){
        expect(res.statusCode).toBe(200);
        done();
      });
    }, 10000);
  });
});
