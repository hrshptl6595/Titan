var visitor = require("./visitorModel");
var employee = require("./employeeModel");
var mapper = require("./mapper");
var request = require("request");
var fs = require("fs");
var nodemailer = require("nodemailer");
var url = require("url");
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "cts.titancompany@gmail.com",
    pass: "titan@2014"
  }
});

exports.typeCheck = function(req, res, next) {
  var query = url.parse(req.url, true).query;
  if(req.method === "GET" && query.email){
    var emp = [];
    visitor.find({"visitorEmail": query.email, "suggestedAlternative": true}, function(err, result){
      for(var i=0;i<result.length;i++)
        employee.findOne({"empUnique": result[i].empUnique}, function(e, record){
          callback(emp.push(record));
        });
      function callback(len){
        if(len===result.length)
          res.json({
            visitor: result,
            employee: emp
          });
      }
    });
  }
  else if(req.method === "GET")
    res.render("visitorAppointment");
  else if(req.method === "POST")
    mapper.visitorAppointment.insertAppointment(req, res, next);
};

exports.insertAppointment = function(req, res, next) {
  console.log("in insertAppointment");
  console.log(req.body);
  var newVisitor = new visitor({
    visitorName: req.body.visitorName,
    visitorEmail: req.body.visitorEmail,
    visitorCompany: req.body.visitorCompany,
    visitorNumber: req.body.visitorNumber,
    visitorPurpose: req.body.visitorPurpose,
    empUnique: req.body.empUnique,
    date: req.body.date,
    slot: req.body.slot,
    approved: null,
    suggestedAlternative: false
  });
  if(req.body.visitorPicture)
    request.get(req.body.visitorPicture, {
      // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
      proxy: null,
      encoding: null
    }, function(err, res, body){
      console.log(res.statusCode);
      console.log(res.headers["content-type"]);
      // fs.writeFile("visitorPicture.jpg", body);
      // newVisitor.visitorPicture.contentType = res.headers["content-type"];
      newVisitor.visitorPicture = new Buffer(body).toString("base64");
      newVisitor.save(function(err, r){
        console.log(err);
        console.log(r);
      });
    })
  else {
    newVisitor.visitorPicture = null;
    newVisitor.save();
  }
  res.send("saved");
};

exports.sendConfMailer = function(visitor){
  transporter.sendMail({
    from: "cts.titancompany@gmail.com",
    to: visitor.visitorEmail,
    subject: "Appointment Confirmation",
    text: "Your appointment has been confirmed! See ya!"
  }, function(error, info){
    if(error) console.log(error);
    console.log(info);
  });
};

exports.sendAlternativeMailer = function(employee, visitor){
  console.log(visitor);
  console.log(employee);
  var str = employee.empName + " is unable to schedule the meeting to the said date and time due to unavoidable circumstances. To view the suggested alternative and approve, follow the link : " + "http://localhost:8080/visitorAppointment/confirm";
  transporter.sendMail({
    from: "cts.titancompany@gmail.com",
    to: visitor.visitorEmail,
    subject: "Appointment Re-Scheduling",
    text: str
  }, function(err, info){
    console.log(err, info);
  });
};
