var recurrence = function(params) {
  var recurObject = {}, prevIns = {}, mInstance = [];
  var e = params.events;
  function recurStrParse(e) {
    var recurStr = e.recurrence[0];
    recurStr = recurStr.substr(6);
    var arr = recurStr.split(";");
    var array = [], i;
    for(i=0;i<arr.length;i++) {
      array = arr[i].split("=");
      recurObject[array[0]] = array[1];
    }

    if(!recurObject.INTERVAL)
      recurObject.INTERVAL = 1;

    if(recurObject.UNTIL) {
      recurObject.UNTIL = new Date(recurObject.UNTIL.substr(0,4), recurObject.UNTIL.substr(4,2), recurObject.UNTIL.substr(6,2));
    }
    else if(!recurObject.UNTIL)
      recurObject.UNTIL = new Date(2100, 1, 1);

    if(recurObject.COUNT) {
      var until = {}, j=1;
      if(recurObject.FREQ === "MONTHLY") {
        until.date = e.startsOn.getDate();
        until.month = e.startsOn.getMonth() + parseInt(recurObject.COUNT);
        while(until.month>11) {
          until.month = until.month - 12;
          until.year = e.startsOn.getFullYear() + j;
          j++;
        }
        recurObject.UNTIL = new Date(until.year, until.month, until.date);
      }
    }
    console.log(recurObject);
  }
  function init(mEvents, dated) {
    if(e) {
      for(var i=0;i<e.length;i++) {
        if(!e[i].extendedProperties) {
          e[i].extendedProperties = {
            "private": {
              visitorAppointment: true
            }
          };
        }
        if(e[i].start.dateTime) {
          e[i].startsOn = new Date(e[i].start.dateTime);
          e[i].endsOn = new Date(e[i].end.dateTime);
          e[i].isDate = false;
        }
        else {
          e[i].startsOn = new Date(e[i].start.date);
          e[i].endsOn = new Date(e[i].end.date);
          e[i].startsOn.setHours(0,0);
          e[i].endsOn.setHours(0,0);
          e[i].isDate = true;
        }
      }
      if(!prevIns.hasOwnProperty("weekArr")){
        prevIns.weekArr = [];
        for(var i=0;i<e.length;i++) {
          prevIns.weekArr[i] = [];
        }
      }
      if(!prevIns.hasOwnProperty("week")){
        prevIns.week = [];
      }
      if(!prevIns.hasOwnProperty("date")){
        prevIns.date = [];
      }
    }
  }
  function whichDay() {
    var dayMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    var arr = []
    if(recurObject.BYDAY)
      for(var i=0;i<dayMap.length;i++)
        if(dayMap[i]===recurObject.BYDAY.substr(-2) && recurObject.BYDAY.indexOf(",")<0)
          return i;
        else if(recurObject.BYDAY.indexOf(",")>0) {
          for(var j=0;j<recurObject.BYDAY.split(",").length;j++)
          if(dayMap[i] === recurObject.BYDAY.split(",")[j])
          arr.push(i);
        }
    if(arr) return arr;
  }
  return {
    setup: function(dated) {
      var i,j,k,x,c;
      mInstance = [];
      console.log(mInstance.length);
      console.log("mInstance reinitialised");
      console.log(params.settings);
      init(dated);
      if(e)
      for(i=0;i<e.length;i++) {
        if(!e[i].recurrence && e[i].startsOn.getFullYear()===params.settings.year) {
          c=0;
          for(j=0;j<dated.length;j++)
          for(k=0;k<dated[j].length;k++)
          if(
            (!e[i].isDate && e[i].startsOn.getDate()===dated[j][k] && e[i].startsOn.getMonth()===params.settings.month) ||
            (e[i].isDate &&
              e[i].startsOn.getDate()+c<e[i].endsOn.getDate() &&
              e[i].startsOn.getDate()+c===dated[j][k] &&
              e[i].startsOn.getMonth()===e[i].endsOn.getMonth() &&
              e[i].startsOn.getMonth()===params.settings.month &&
              e[i].startsOn.getFullYear()===e[i].endsOn.getFullYear()) ||
            (e[i].isDate &&
              e[i].startsOn.getMonth()-e[i].endsOn.getMonth()===-1 &&
              ((e[i].startsOn.getDate()+c<=params.settings.dateLimit(params.settings.month) && e[i].startsOn.getDate()+c===dated[j][k] && e[i].startsOn.getMonth()===params.settings.month) ||
              (dated[j][k]<=e[i].endsOn.getDate() && dated[j][k] && params.settings.month===e[i].endsOn.getMonth())))
            ) {
            // mEvents[j][k].push(e[i].summary);
            mInstance.push({
              startsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].startsOn.getHours()),
              endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
              summary: e[i].summary,
              visitorDetails: e[i].extendedProperties.private,
              isDate: e[i].isDate
            });
            if(e[i].isDate) c++;
          }
        }
        if(e[i].recurrence) {
          recurObject = {};
          recurStrParse(e[i]);
          if(recurObject.FREQ === "MONTHLY") {
            if(!recurObject.BYDAY &&
               (
                 (
                   Math.abs(e[i].startsOn.getMonth()-params.settings.month)%parseInt(recurObject.INTERVAL)===0 &&
                   e[i].startsOn.getFullYear()===params.settings.year
                 ) ||
                 (
                   e[i].startsOn.getFullYear()-params.settings.year===-1 &&
                  (12-e[i].startsOn.getMonth()+params.settings.month)%parseInt(recurObject.INTERVAL)===0
                  ) ||
                 (
                   e[i].startsOn.getFullYear()-params.settings.year===1 &&
                  (12+e[i].startsOn.getMonth()-params.settings.month)%parseInt(recurObject.INTERVAL)===0
                  )
                )
              ) {
              if(params.settings.year<recurObject.UNTIL.getFullYear() || (params.settings.year===recurObject.UNTIL.getFullYear() && params.settings.month<=recurObject.UNTIL.getMonth())) {
                c=0;
                for(j=0;j<dated.length;j++)
                for(k=0;k<dated[j].length;k++)
                if(
                  (!e[i].isDate && e[i].startsOn.getDate()===dated[j][k]) ||
                  (e[i].isDate && e[i].startsOn.getDate()+c<e[i].endsOn.getDate() && e[i].startsOn.getDate()+c===dated[j][k])
                  ) {
                  // mEvents[j][k].push(e[i].summary);
                  mInstance.push({
                    startsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].startsOn.getHours()),
                    endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                    summary: e[i].summary,
                    visitorDetails: e[i].extendedProperties.private,
                    isDate: e[i].isDate
                  });
                  if(e[i].isDate) c++;
                }
              }
            }
            else if(recurObject.BYDAY &&
               (
                 (
                   Math.abs(e[i].startsOn.getMonth()-params.settings.month)%parseInt(recurObject.INTERVAL)===0 &&
                   e[i].startsOn.getFullYear()===params.settings.year
                 ) ||
                 (
                   e[i].startsOn.getFullYear()-params.settings.year===-1 &&
                  (12-e[i].startsOn.getMonth()+params.settings.month)%parseInt(recurObject.INTERVAL)===0
                  ) ||
                 (
                   e[i].startsOn.getFullYear()-params.settings.year===1 &&
                  (12+e[i].startsOn.getMonth()-params.settings.month)%parseInt(recurObject.INTERVAL)===0
                  )
                )
              ) {
              if(params.settings.year<recurObject.UNTIL.getFullYear() || (params.settings.year===recurObject.UNTIL.getFullYear() && params.settings.month<=recurObject.UNTIL.getMonth())) {
                if(!isNaN(recurObject.BYDAY.substr(0,1))) {
                  x=parseInt(recurObject.BYDAY.substr(0,1));
                  if(x>0 && dated[x-1][whichDay()] && dated[0][whichDay()]) x--;
                }
                else if(!isNaN(recurObject.BYDAY.substr(0,2))) {
                  x=parseInt(recurObject.BYDAY.substr(0,2));
                  j=1;
                  while(dated[dated.length-j][whichDay()]==="")
                    j++;
                  x=dated.length-j;
                }
                // mEvents[x][whichDay()].push(e[i].summary);
                mInstance.push({
                  startsOn: new Date(params.settings.year, params.settings.month, dated[x][whichDay()], e[i].startsOn.getHours()),
                  endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                  summary: e[i].summary,
                  visitorDetails: e[i].extendedProperties.private,
                  isDate: e[i].isDate
                });
              }
            }
          }
          else if(recurObject.FREQ === "WEEKLY") {
            for(j=0;j<dated.length;j++) {
              if(typeof(whichDay())==="number")
                if(params.settings.year<recurObject.UNTIL.getFullYear() || (params.settings.year===recurObject.UNTIL.getFullYear() && params.settings.month<=recurObject.UNTIL.getMonth())){
                  if(prevIns.week[i]==undefined) prevIns.week[i]=e[i].startsOn;
                  if(params.settings.month === prevIns.week[i].getMonth() && dated[j][whichDay()] && (dated[j][whichDay()]-prevIns.week[i].getDate())%(7*recurObject.INTERVAL)===0) {
                    // mEvents[j][whichDay()].push(e[i].summary);
                    mInstance.push({
                      startsOn: new Date(params.settings.year, params.settings.month, dated[j][whichDay()], e[i].startsOn.getHours()),
                      endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                      summary: e[i].summary,
                      visitorDetails: e[i].extendedProperties.private,
                      isDate: e[i].isDate
                    });
                    prevIns.week[i] = new Date(params.settings.year, params.settings.month, dated[j][whichDay()]);
                  }
                  else if(params.settings.month - prevIns.week[i].getMonth() === 1 || params.settings.month - prevIns.week[i].getMonth() === -11) {
                    if(dated[j][whichDay()]===(prevIns.week[i].getDate() + (7*recurObject.INTERVAL) - params.settings.dateLimit(prevIns.week[i].getMonth()))) {
                      // mEvents[j][whichDay()].push(e[i].summary);
                      mInstance.push({
                        startsOn: new Date(params.settings.year, params.settings.month, dated[j][whichDay()], e[i].startsOn.getHours()),
                        endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                        summary: e[i].summary,
                        visitorDetails: e[i].extendedProperties.private,
                        isDate: e[i].isDate
                      });
                      prevIns.week[i] = new Date(params.settings.year, params.settings.month, dated[j][whichDay()])
                    }
                  }
                  else if(params.settings.month - prevIns.week[i].getMonth() === -1 || params.settings.month - prevIns.week[i].getMonth() === 11) {
                    var n=1;
                    if(params.settings.month - prevIns.week[i].getMonth() === -1)
                    x=params.settings.dateLimit(prevIns.week[i].getMonth() - 1);
                    else if(params.settings.month - prevIns.week[i].getMonth() === 11)
                    x=params.settings.dateLimit(11);
                    while((prevIns.week[i].getDate() - (7*n*recurObject.INTERVAL) + x)>0) {
                      n++;
                    }
                    n--;
                    if(dated[j][whichDay()]===(prevIns.week[i].getDate() - (7*n*recurObject.INTERVAL) + x)) {
                      // mEvents[j][whichDay()].push(e[i].summary);
                      mInstance.push({
                        startsOn: new Date(params.settings.year, params.settings.month, dated[j][whichDay()], e[i].startsOn.getHours()),
                        endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                        summary: e[i].summary,
                        visitorDetails: e[i].extendedProperties.private,
                        isDate: e[i].isDate
                      });
                      prevIns.week[i] = new Date(params.settings.year, params.settings.month, dated[j][whichDay()]);
                    }
                  }
                }
              else if(typeof(whichDay()) === "object")
                if(params.settings.year<recurObject.UNTIL.getFullYear() || (params.settings.year===recurObject.UNTIL.getFullYear() && params.settings.month<=recurObject.UNTIL.getMonth())){
                  var arr = whichDay();
                  if(prevIns.weekArr[i].length===0) {
                    for(k=0;k<arr.length;k++) {
                      prevIns.weekArr[i][k] = e[i].startsOn;
                      if(arr[k]!=prevIns.weekArr[i][k].getDay()) {
                        x = prevIns.weekArr[i][k].getDate() - (prevIns.weekArr[i][k].getDay() - arr[k]);
                        if(x<=0)
                        prevIns.weekArr[i][k] = new Date(prevIns.weekArr[i][k].getFullYear(), prevIns.weekArr[i][k].getMonth() - 1, params.settings.dateLimit(prevIns.weekArr[i][k].getMonth() - 1) + x);
                        else if(x>params.settings.dateLimit(prevIns.weekArr[i][k].getMonth()))
                        prevIns.weekArr[i][k] = new Date(prevIns.weekArr[i][k].getFullYear(), prevIns.weekArr[i][k].getMonth() + 1, x - params.settings.dateLimit(prevIns.weekArr[i][k].getMonth()));
                      }
                    }
                  }
                  for(k=0;k<arr.length;k++) {
                    if(params.settings.month === prevIns.weekArr[i][k].getMonth() && dated[j][arr[k]] && (dated[j][arr[k]]-prevIns.weekArr[i][k].getDate())%(7*recurObject.INTERVAL)===0) {
                      // mEvents[j][arr[k]].push(e[i].summary);
                      mInstance.push({
                        startsOn: new Date(params.settings.year, params.settings.month, dated[j][arr[k]], e[i].startsOn.getHours()),
                        endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                        summary: e[i].summary,
                        visitorDetails: e[i].extendedProperties.private,
                        isDate: e[i].isDate
                      });
                      prevIns.weekArr[i][k] = new Date(params.settings.year, params.settings.month, dated[j][arr[k]]);
                    }
                    else if(params.settings.month - prevIns.weekArr[i][k].getMonth() === 1 || params.settings.month - prevIns.weekArr[i][k].getMonth() === -11) {
                      if(dated[j][arr[k]]===(prevIns.weekArr[i][k].getDate() + (7*recurObject.INTERVAL) - params.settings.dateLimit(prevIns.weekArr[i][k].getMonth()))) {
                        // mEvents[j][arr[k]].push(e[i].summary);
                        mInstance.push({
                          startsOn: new Date(params.settings.year, params.settings.month, dated[j][arr[k]], e[i].startsOn.getHours()),
                          endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                          summary: e[i].summary,
                          visitorDetails: e[i].extendedProperties.private,
                          isDate: e[i].isDate
                        });
                        prevIns.weekArr[i][k] = new Date(params.settings.year, params.settings.month, dated[j][arr[k]]);
                      }
                    }
                    else if(params.settings.month - prevIns.weekArr[i][k].getMonth() === -1 || params.settings.month - prevIns.weekArr[i][k].getMonth() === 11) {
                      var n=1;
                      if(params.settings.month - prevIns.weekArr[i][k].getMonth() === -1)
                      x=params.settings.dateLimit(prevIns.weekArr[i][k].getMonth() - 1);
                      else if(params.settings.month - prevIns.weekArr[i][k].getMonth() === 11)
                      x=params.settings.dateLimit(11);
                      while((prevIns.weekArr[i][k].getDate() - (7*n*recurObject.INTERVAL) + x)>0) {
                        n++;
                      }
                      n--;
                      if(dated[j][arr[k]]===(prevIns.weekArr[i][k].getDate() - (7*n*recurObject.INTERVAL) + x)) {
                        // mEvents[j][arr[k]].push(e[i].summary);
                        mInstance.push({
                          startsOn: new Date(params.settings.year, params.settings.month, dated[j][arr[k]], e[i].startsOn.getHours()),
                          endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                          summary: e[i].summary,
                          visitorDetails: e[i].extendedProperties.private,
                          isDate: e[i].isDate
                        });
                        prevIns.weekArr[i][k] = new Date(params.settings.year, params.settings.month, dated[j][arr[k]]);
                      }
                    }
                  }
                }
            }
          }
          else if(recurObject.FREQ === "DAILY") {
            if(params.settings.year<recurObject.UNTIL.getFullYear() || (params.settings.year===recurObject.UNTIL.getFullYear() && params.settings.month<=recurObject.UNTIL.getMonth())) {
              for(j=0;j<dated.length;j++)
              for(k=0;k<dated[j].length;k++) {
                if(prevIns.date[i]==undefined) prevIns.date[i] = e[i].startsOn;
                if(params.settings.month === prevIns.date[i].getMonth() && dated[j][k] && (dated[j][k]-prevIns.date[i].getDate())%recurObject.INTERVAL===0) {
                  // mEvents[j][k].push(e[i].summary);
                  mInstance.push({
                    startsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].startsOn.getHours()),
                    endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                    summary: e[i].summary,
                    visitorDetails: e[i].extendedProperties.private,
                    isDate: e[i].isDate
                  });
                  prevIns.date[i] = new Date(params.settings.year, params.settings.month, dated[j][k]);
                }
                else if(params.settings.month - prevIns.date[i].getMonth() === 1 || params.settings.month - prevIns.date[i].getMonth() === -11) {
                  x = prevIns.date[i].getDate() + parseInt(recurObject.INTERVAL) - params.settings.dateLimit(prevIns.date[i].getMonth());
                  if(dated[j][k]===x) {
                    // mEvents[j][k].push(e[i].summary);
                    mInstance.push({
                      startsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].startsOn.getHours()),
                      endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                      summary: e[i].summary,
                      visitorDetails: e[i].extendedProperties.private,
                      isDate: e[i].isDate
                    });
                    prevIns.date[i] = new Date(params.settings.year, params.settings.month, dated[j][k]);
                  }
                }
                else if(params.settings.month - prevIns.date[i].getMonth() === -1 || params.settings.month - prevIns.date[i].getMonth() === 11) {
                  var n=1;
                  if(params.settings.month - prevIns.date[i].getMonth() === -1)
                  x=params.settings.dateLimit(prevIns.date[i].getMonth() - 1);
                  else if(params.settings.month - prevIns.date[i].getMonth() === 11)
                  x=params.settings.dateLimit(11);
                  while((prevIns.date[i].getDate() - (n*recurObject.INTERVAL) + x)>0) {
                    n++;
                  }
                  n--;
                  if(dated[j][k]===(prevIns.date[i].getDate() - (n*recurObject.INTERVAL) + x)) {
                    // mEvents[j][k].push(e[i].summary);
                    mInstance.push({
                      startsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].startsOn.getHours()),
                      endsOn: new Date(params.settings.year, params.settings.month, dated[j][k], e[i].endsOn.getHours()),
                      summary: e[i].summary,
                      visitorDetails: e[i].extendedProperties.private,
                      isDate: e[i].isDate
                    });
                    prevIns.date[i] = new Date(params.settings.year, params.settings.month, dated[j][k]);
                  }
                }
              }
            }
          }
        }
      }
    },
    getMonthlyEvents: function(mEvents, dated) {
      var i,j,k,x,c;
      for(i=0;i<6;i++) {
        mEvents[i] = [];
        for(j=0;j<7;j++)
        mEvents[i][j] = [];
      }
      console.log(mInstance);
      for(i=0;i<6;i++)
      for(j=0;j<7;j++)
      for(k=0;k<mInstance.length;k++)
      if(dated[i][j]===mInstance[k].startsOn.getDate())
      mEvents[i][j].push({
        summary: mInstance[k].summary,
        time: mInstance[k].startsOn.getHours(),
        visitorDetails: mInstance[k].visitorDetails,
        isDate: mInstance[k].isDate
      });
    },
    getWeeklyEvents: function(wEvents) {
      var i,j,k,x,matrix=[];
      for(i=0;i<24;i++){
        wEvents[i] = [];
        for(j=0;j<7;j++)
          wEvents[i][j] = [];
      }
      for(i=0;i<7;i++)
      for(j=0;j<mInstance.length;j++) {
        if(params.settings.weekDates[i].getDate()===mInstance[j].startsOn.getDate() && params.settings.weekDates[i].getMonth()===mInstance[j].startsOn.getMonth() && params.settings.weekDates[i].getFullYear()===mInstance[j].startsOn.getFullYear()) {
          k = mInstance[j].startsOn.getHours();
          while(k<mInstance[j].endsOn.getHours()){
            wEvents[k][i].push({
              summary: mInstance[j].summary,
              visitorDetails: mInstance[j].visitorDetails
            });
            k++;
          }
        }
      }
    },
    getDailyEvents: function(dEvents) {
      var i,j,k,x;
      for(i=0;i<24;i++)
        dEvents[i] = [];
      for(j=0;j<mInstance.length;j++) {
        if(params.settings.date===mInstance[j].startsOn.getDate() && params.settings.month===mInstance[j].startsOn.getMonth() && params.settings.year===mInstance[j].startsOn.getFullYear()) {
          k = mInstance[j].startsOn.getHours();
          while(k<mInstance[j].endsOn.getHours()){
            dEvents[k].push({
              summary: mInstance[j].summary,
              visitorDetails: mInstance[j].visitorDetails
            });
            k++;
          }
        }
      }
    }
  };
}
