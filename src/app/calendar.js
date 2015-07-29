var request = require("request");
var employee = require("./employeeModel");
var mapper = require("./mapper");
var querystring = require("querystring");
var fs = require("fs");

exports.refreshToken = function(result, events, callback) {
  var token;
  request.post("https://www.googleapis.com/oauth2/v3/token", {
    // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
    proxy: null,
    form: {
      refresh_token: result.empRefreshToken,
      client_id: "831835373457-78b2j3qbmj0mo2af1l243qjt8bked26l.apps.googleusercontent.com",
      client_secret: "LQ6VmO-xP1iLte8o_KkYkCc_",
      grant_type: "refresh_token"
    }
  }, function(error, response, accessJSON){
    console.log(accessJSON);
    if(error) console.log(error);
    else {
      console.log("token obtained : " + JSON.parse(accessJSON).access_token);
      token = JSON.parse(accessJSON).access_token;
      result.empAccessToken = token;
      result.save();
      if(events.length===0)
        mapper.calendar.getEvents(events, token, callback);
      else if(events.approved===true)
        mapper.calendar.insertEvent(events, token, callback);
      else if(events.approved===false)
        mapper.calendar.deleteEvent(events, token, callback);
    }
  });
};

exports.getEvents = function(events, token, callback) {
  var options = {
    access_token: token
  };
  var getUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events?" + querystring.stringify(options);
  request.get(getUrl, {
    // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/"
    proxy: null
  }, function(err, r, body){
    body = JSON.parse(body);
    var nextPageToken = body.nextPageToken;
    for(var i=0; i<body.items.length; i++)
      if(body.items[i].status === "confirmed" || body.items[i].status === "tentative")
        events.push(body.items[i]);
    while(nextPageToken) {
      request.get(getUrl + "&nextPageToken=" + body.nextPageToken, {
        // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/"
        proxy: null
      }, function(err,r,body){
        nextPageToken = body.nextPageToken;
        for(var i=0; i<body.items.length; i++)
          if(body.items[i].status === "confirmed" || body.items[i].status === "tentative")
            events.push(body.items[i]);
      });
    }
    if(!nextPageToken)
      employee.findOne({"empAccessToken":token}, function(e, result){
        result.nextSyncToken = body.nextSyncToken;
        result.save(function(){
          // fs.writeFile("rawCalendarEvents.txt", events, callback);
          callback();
        });
        // console.log(events);
      });
  });
};

exports.insertEvent = function(visitor, token, callback){
  var options = {
    access_token: token
  };
  visitor.date = new Date(visitor.date);
  var postUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events?" + querystring.stringify(options);
  request.post(postUrl, {
    // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
    proxy: null,
    json: {
      "start": {
        "dateTime": new Date(visitor.date.getFullYear(), visitor.date.getMonth(), visitor.date.getDate(), visitor.slot).toISOString(),
        "timeZone": "Asia/Calcutta"
      },
      "end": {
        "dateTime": new Date(visitor.date.getFullYear(), visitor.date.getMonth(), visitor.date.getDate(), visitor.slot + 1).toISOString(),
        "timeZone": "Asia/Calcutta"
      },
      "reminders": {
        "useDefault": false,
        "overrrides": [{
          "method":"popup",
          "minutes":30
        },
        {
          "method":"email",
          "minutes":30
        }]
      },
      "status": "confirmed",
      "summary": visitor.visitorPurpose,
      "extendedProperties": {
        "private": {
          "visitorAppointment": true,
          "visitorName":visitor.visitorName,
          "visitorEmail":visitor.visitorEmail,
          "visitorCompany":visitor.visitorCompany,
          "visitorNumber":visitor.visitorNumber
        }
      }
    }
  }, function(err, response, body){
    console.log(body);
    mapper.visitorAppointment.sendConfMailer(visitor);
    callback(body);
  })
};

exports.deleteEvent = function(visitor, token, callback) {
  var options = {
    access_token: token
  };
  var deleteUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + visitor.calendarID + "?" + querystring.stringify(options);
  request.del(deleteUrl, {
    // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/"
    proxy: null,
  }, function(err, response, body){
    callback(null);
  })
};
