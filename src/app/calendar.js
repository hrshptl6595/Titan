var request = require("request");
var employee = require("./employeeModel");
var mapper = require("./mapper");
var querystring = require("querystring");
var Rrecur = require("rrecur").Rrecur;

exports.refreshAccessToken = function(events, callback) {
  var token;
  employee.findOne({"empUnique":"110004310269636919935"}, function(e, result){
    request.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + result.empAccessToken, {
      // proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/",
      proxy: null
    }, function(err, response, body){
      if(err) console.log(err);
      else {
        var json = JSON.parse(body);
        token = result.empAccessToken;
        if(json.error){
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
            if(error) console.log(error);
            else {
              result.empAccessToken = token = JSON.parse(accessJSON).access_token;
              result.save();
              mapper.calendar.getEvents(events, token, callback);
            }
          });
        }
        else
          mapper.calendar.getEvents(events, token, callback);
      }
    });
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
        result.save();
        callback();
      });
    console.log(events);
    // options.timeMax = new Date()
    // for(i=0;i<events.length;i++)
    //   if(events[i].recurrence) {
    //     request.get("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + events[i].id + "/instances?" + querystring.stringify(options), {
    //       proxy: "http://tilge%5Cinnovedge2:titan%40123@172.50.6.230:8080/"
    //       // proxy: null
    //     }, function(err, r, body){
    //       body = JSON.parse(body);
    //
    //     });
    //   }
    //
  });
};
