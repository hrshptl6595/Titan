angular.module("directives", ["services"])
  .directive("formatTabs", ["$q", function($q){
    return{
      templateUrl: "formatTabs.html",
      transclude: true,
      scope: {
        settings: "=",
        events: "=",
        setDeferred: "&"
      },
      controller: function($scope) {
        $scope.formatTabs = [];
        $scope.rObject = {};
        this.dated = [];
        var self=this;
        var formatTabsDef = $q.defer();
        $scope.$watch("settings.promise", thening);
        function thening(){
          $scope.settings.promise.then(function(data){
            console.log(data);
            $scope.events = data;
            $scope.rObject = recurrence({
              settings: $scope.settings,
              events: $scope.events
            });
            computeDated();
            $scope.rObject.setup(self.dated);
            formatTabsDef.resolve();
            if($scope.setDeferred) $scope.setDeferred({value: $q.defer()});
          });
        }
        function computeDated(){
          var firstDay = (new Date($scope.settings.year, $scope.settings.month, 1)).getDay();
          var num=1, x, i, j;
          for(i=0;i<6;i++) {
            self.dated[i] = [];
            for(var j=0;j<7;j++) {
              if(((i==0)&&(j<firstDay)) || num>$scope.settings.dateLimit($scope.settings.month))
                self.dated[i][j]=""
              else {
                self.dated[i][j]=num;
                num++;
              }
            }
          }
        };
        $scope.select = function(formatTab) {
          angular.forEach($scope.formatTabs, function(each){
            each.selected = false;
          })
          formatTab.selected = true;
          console.log("select");
        };
        this.selectMonth = function(){
          angular.forEach($scope.formatTabs, function(tab){
            tab.selected = false;
            if(tab.type==="Month")
            tab.selected = true;
          });
        };
        this.addFormatTab = function(formatTab) {
          if($scope.formatTabs.length === 0)
            $scope.select(formatTab);
          formatTab.directiveProps = {};
          $scope.formatTabs.push(formatTab);
          console.log("addFormatTab");
        };
        this.getObjects = function(){
          return {
            rObject: $scope.rObject,
            settings: $scope.settings,
            events: $scope.events,
            formatTabsPromise: formatTabsDef.promise
          };
        };
        $scope.previous = function() {
          angular.forEach($scope.formatTabs, function(tab){
            if(tab.type === "Month" && tab.selected === true) {
              tab.settings.month = tab.settings.month - 1;
              if(tab.settings.month===-1) {
                tab.settings.year = tab.settings.year - 1;
                tab.settings.month = 11;
              }
              computeDated();
              $scope.rObject.setup(self.dated);
              console.log("previous month");
            }
            else if(tab.type === "Week" && tab.selected === true) {
              tab.settings.date -= 6;
              if(tab.settings.date <= 0) {
                tab.settings.month -= 1;
                if(tab.settings.month===-1) {
                  tab.settings.year = tab.settings.year - 1;
                  tab.settings.month = 11;
                }
                tab.settings.date = tab.settings.dateLimit(tab.settings.month - 1) + tab.settings.date;
                computeDated();
                $scope.rObject.setup(self.dated);
              }
              console.log("previous month");
            }
            else if(tab.type === "Day" && tab.selected === true) {
              tab.settings.date -= 1;
              if(tab.settings.date <= 0) {
                tab.settings.month -= 1;
                if(tab.settings.month===-1) {
                  tab.settings.year = tab.settings.year - 1;
                  tab.settings.month = 11;
                }
                tab.settings.date = tab.settings.dateLimit(tab.settings.month);
                computeDated();
                $scope.rObject.setup(self.dated);
              }
              console.log("previous day");
            }
          });
        };
        $scope.next = function() {
          angular.forEach($scope.formatTabs, function(tab){
            if(tab.type === "Month" && tab.selected === true) {
              tab.settings.month = tab.settings.month + 1;
              if(tab.settings.month===12) {
                tab.settings.year = tab.settings.year + 1;
                tab.settings.month = 0;
              }
              computeDated();
              $scope.rObject.setup(self.dated);
              console.log("next month");
            }
            else if(tab.type === "Week" && tab.selected === true) {
              tab.settings.date += 6;
              if(tab.settings.date > tab.settings.dateLimit(tab.settings.month)) {
                tab.settings.month += 1;
                if(tab.settings.month===12) {
                  tab.settings.year = tab.settings.year + 1;
                  tab.settings.month = 0;
                }
                tab.settings.date = tab.settings.date - tab.settings.dateLimit(tab.settings.month);
                computeDated();
                $scope.rObject.setup(self.dated);
              }
              console.log("next week");
            }
            else if(tab.type === "Day" && tab.selected === true) {
              tab.settings.date += 1;
              if(tab.settings.date > tab.settings.dateLimit(tab.settings.month)) {
                tab.settings.month += 1;
                if(tab.settings.month===12) {
                  tab.settings.year = tab.settings.year + 1;
                  tab.settings.month = 0;
                }
                tab.settings.date = 1;
                computeDated();
                $scope.rObject.setup(self.dated);
              }
              console.log("next day");
            }
          });
        };
      }
    };
  }])
  .directive("calendarMonth", ["sharedPromise", "$q", function(sharedPromise, $q){
    return {
      templateUrl: "calendarMonth.html",
      require: "^formatTabs",
      scope: {
        type: "@"
      },
      link: function(scope, elem, attrs, formatTabsCtrl) {
        var formatTabsPromise = formatTabsCtrl.getObjects().formatTabsPromise;
        var rObject = {};
        scope.settings = null;
        formatTabsPromise.then(function(){
          formatTabsCtrl.addFormatTab(scope);
          scope.settings = formatTabsCtrl.getObjects().settings;
          rObject = formatTabsCtrl.getObjects().rObject;
          scope.events = formatTabsCtrl.getObjects().events;
          sharedPromise.promise.then(function(visitor){
            scope.showAlternative = true;
            formatTabsCtrl.selectMonth();
            scope.settings.sharedPromiseResolved = true;
            sharedPromise.deferred = $q.defer();
            sharedPromise.promise = sharedPromise.deferred.promise;
          });
          scope.$watchGroup(["settings.month","settings.year"], function(){
            console.log(scope);
            console.log("month calendar directive id : " + scope.$id);
            scope.directiveProps.rows = [], scope.directiveProps.cols = [], scope.directiveProps.monthlyEvents = [];
            for(i=0;i<7;i++) {
              if(i<6) scope.directiveProps.rows.push(i);
              scope.directiveProps.cols.push(i);
            }
            scope.directiveProps.dated = formatTabsCtrl.dated;
            rObject.getMonthlyEvents(scope.directiveProps.monthlyEvents, scope.directiveProps.dated);
          });
        });
      }
    };
  }])
  .directive("calendarWeek", ["$timeout", function($timeout){
    return {
      templateUrl: "calendarWeek.html",
      require: "^formatTabs",
      scope: {
        type: "@"
      },
      link: function(scope, elem, attrs, formatTabsCtrl) {
        var formatTabsPromise = formatTabsCtrl.getObjects().formatTabsPromise;
        var rObject = {};
        formatTabsPromise.then(function(){
          formatTabsCtrl.addFormatTab(scope);
          scope.settings = formatTabsCtrl.getObjects().settings;
          rObject = formatTabsCtrl.getObjects().rObject;
          scope.events = formatTabsCtrl.getObjects().events;
          scope.$watchGroup(["settings.month","settings.year","settings.date"], callback);
        });
        function callback() {
          console.log(scope);
          console.log("week calendar directive id : " + scope.$id);
          scope.settings.weekDates = [];
          var startDate = scope.settings.date - scope.settings.day();
          var endDate = scope.settings.date + 6 - scope.settings.day();
          scope.directiveProps.weeklyEvents = [];
          if(startDate < 1) {
            if((scope.settings.month-1)>=0)
              startDate = scope.settings.dateLimit(scope.settings.month - 1) + startDate;
            else
              startDate = scope.settings.dateLimit(11) + startDate;
            for(var i=0; startDate<=scope.settings.dateLimit(scope.settings.month - 1);i++,startDate++)
              scope.settings.weekDates[i] = new Date(scope.settings.year, scope.settings.month-1, startDate);
            for(var j=6;j>=i;j--, endDate--)
              scope.settings.weekDates[j] = new Date(scope.settings.year, scope.settings.month, endDate);
            scope.directiveProps.monthStart = scope.settings.months[scope.settings.month - 1];
            if((scope.settings.month-1)===-1)
              scope.directiveProps.monthStart = scope.settings.months[11];
            scope.directiveProps.monthEnd = scope.settings.months[scope.settings.month];
          }
          else if(endDate>scope.settings.dateLimit(scope.settings.month)){
            endDate -= scope.settings.dateLimit(scope.settings.month);
            for(var i=0; startDate<=scope.settings.dateLimit(scope.settings.month);i++,startDate++)
              scope.settings.weekDates[i] = new Date(scope.settings.year, scope.settings.month, startDate);
            for(var j=6;j>=i;j--, endDate--)
              scope.settings.weekDates[j] = new Date(scope.settings.year, scope.settings.month+1, endDate);
            scope.directiveProps.monthStart = scope.settings.months[scope.settings.month];
            scope.directiveProps.monthEnd = scope.settings.months[scope.settings.month + 1];
            if((scope.settings.month+1)===12)
              scope.directiveProps.monthEnd = scope.settings.months[0];
          }
          else{
            for(var i=0;i<7;i++,startDate++)
              scope.settings.weekDates[i] = new Date(scope.settings.year, scope.settings.month, startDate);
            scope.directiveProps.monthStart = scope.settings.months[scope.settings.month];
            scope.directiveProps.monthEnd = scope.settings.months[scope.settings.month];
          }
          scope.directiveProps.rows = [], scope.directiveProps.cols = [];
          for(var i=9;i<20;i++)
            scope.directiveProps.rows.push(i);
          for(i=0;i<7;i++)
           scope.directiveProps.cols.push(i);
          rObject.getWeeklyEvents(scope.directiveProps.weeklyEvents);
        }
      }
    };
  }])
  .directive("calendarDay", ["$timeout", function($timeout){
    return {
      templateUrl: "calendarDay.html",
      require: "^formatTabs",
      scope: {
        type: "@"
      },
      link: function(scope, elem, attrs, formatTabsCtrl) {
        var formatTabsPromise = formatTabsCtrl.getObjects().formatTabsPromise;
        var rObject = {};
        formatTabsPromise.then(function(){
          formatTabsCtrl.addFormatTab(scope);
          scope.settings = formatTabsCtrl.getObjects().settings;
          rObject = formatTabsCtrl.getObjects().rObject;
          scope.events = formatTabsCtrl.getObjects().events;
          scope.$watchGroup(["settings.month","settings.year","settings.date"], callback);
        });
        function callback() {
          console.log(scope);
          console.log("day calendar directive id : " + scope.$id);
          scope.directiveProps.day = scope.settings.daysOfWeek[(new Date(scope.settings.year, scope.settings.month, scope.settings.date)).getDay()];
          scope.directiveProps.rows = [];
          scope.directiveProps.dailyEvents = [];
          for(var i=9;i<20;i++)
            scope.directiveProps.rows.push(i);
          rObject.getDailyEvents(scope.directiveProps.dailyEvents);
        }
      }
    };
  }])
  .directive("visitorDetails", ["$http", "$location", "$q", "sharedPromise", function($http, $location, $q, sharedPromise){
    return {
      templateUrl: "visitorDetails.html",
      controller: function($scope){
        var visitor = {};
        $scope.alternativeDate = sharedPromise.date;
        $scope.eArray = sharedPromise.eArray;
        $scope.SA = $scope.visitor.suggestedAlternative.toString();
        $scope.update = function(){
          if($scope.visitor.approved) {
            if($scope.visitor.date.getDate() === new Date().getDate() && $scope.visitor.date.getMonth() === new Date().getMonth() && $scope.visitor.date.getFullYear() === new Date().getFullYear()) {
              visitor.visitorPicture = $scope.visitor.visitorPicture;
              visitor.visitorName = $scope.visitor.visitorName;
              visitor.visitorCompany = $scope.visitor.visitorCompany;
              visitor.visitorEmail = $scope.visitor.visitorEmail;
              visitor.visitorNumber = $scope.visitor.visitorNumber;
              visitor.visitorPurpose = $scope.visitor.visitorPurpose;
              visitor.slot = $scope.visitor.slot;
              $scope.visitorsToday.push(visitor);
            }
            $http({
              url: "http://titan-scheduler.in:8080/dashboard",
              method: "POST",
              data : {
                visitor: $scope.visitor
              }
            }).success(function(data){
              console.log(data);
              $scope.pendingReqs.splice($scope.pendingReqs.indexOf($scope.visitor), 1);
            });
          }
        };
        $scope.never = function(){
          $http({
            url: "http://titan-scheduler.in:8080/dashboard",
            method: "POST",
            data : {
              visitor: $scope.visitor
            }
          }).success(function(data){
            console.log(data);
          });
        };
        $scope.alternative = function(){
          $location.url("/dashboard/calendar");
          console.log(sharedPromise);
          sharedPromise.deferred.resolve($scope.visitor);
        };
        $scope.submit = function(slot){
          $scope.visitor.date = $scope.alternativeDate;
          $scope.visitor.slot = slot;
          $scope.visitor.approved = null;
          $scope.visitor.suggestedAlternative = true;
          $scope.SA = $scope.visitor.suggestedAlternative.toString();
          $http({
            url: "http://titan-scheduler.in:8080/dashboard",
            method: "POST",
            data : {
              visitor: $scope.visitor
            }
          }).success(function(data){
            console.log(data);
            // $scope.events.push(data);
            // $scope.pendingReqs.splice($scope.pendingReqs.indexOf($scope.visitor), 1);
          });
        }
      },
      link: function(scope, elem, attrs){
        console.log(scope);
        if(scope.visitor.isVisitorToday==null) scope.visitor.isVisitorToday = false;
        scope.visitor.date = new Date(scope.visitor.date);
      }
    }
  }])
  .directive("numCheck", function(){
    return {
      require: "^ngModel",
      link: function(scope, elem, attrs, ctrl) {
        ctrl.$validators.numCheck = function(modelValue, viewValue) {
          if(ctrl.$isEmpty(modelValue))
            return true;
          else if(angular.isNumber(parseInt(modelValue)) && modelValue.length===10)
              return true;
          else
            return false;
        };
      }
    }
  })
  .directive("employeeList", ["$http", "$q", function($http, $q){
    return {
      require: "^ngModel",
      scope: {
        list: "="
      },
      link: function(scope, elem, attrs, ctrl){
        ctrl.$asyncValidators.employeeList = function(modelValue, viewValue){
          console.log("running employeeList!");
          var def = $q.defer();
          $http.get("http://titan-scheduler.in:8080/employees?department=" + viewValue.toUpperCase())
            .then(function(data){
              console.log(data);
              scope.list = data.data;
              def.resolve();
            }, function(){
              def.reject();
            });
          return def.promise;
        };
      }
    }
  }])
  .directive("employeeCheck", ["$http", "$q", function($http, $q){
    return {
      require: "ngModel",
      scope: {
        events: "=",
        init: "="
      },
      link: function(scope, elem, attrs, ctrl){
        ctrl.$asyncValidators.employeeCheck = function(modelValue, viewValue){
          console.log("running employeeCheck!");
          var def = $q.defer();
          $http.get("http://titan-scheduler.in:8080/employees?name=" + viewValue)
            .then(function(data){
              console.log(data);
              scope.events = data.data.empEvents;
              scope.init.empUnique = data.data.empDetails.empUnique;
              scope.init.deferred.resolve(data.data.empEvents);
              scope.init.showCalendar = true;
              console.log(scope.init);
              // scope.getPromise();
              def.resolve();
            }, function(){
              def.reject();
            });
          return def.promise;
        }
      }
    };
  }])
  .directive("disablebuttons", function(){
    return {
      scope: true,
      link: function(scope, elem, attrs){
        scope.disableTimings = true;
        scope.$watch("eArray", function(){
          if(scope.eArray){
            if(new Date(scope.settings.year, scope.settings.month, scope.thatDate)<new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())){
              scope.disableTimings = true;
              console.log("wtf");
            }
            else if(new Date(scope.settings.year, scope.settings.month, scope.thatDate)>=new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
              if(scope.eArray.length===0) {
                scope.disableTimings = false;
                console.log("yo");
              }
              else {
                for(var i=0;i<scope.eArray.length;i++)
                if(scope.eArray[i].time===scope.slot || scope.eArray[i].isDate)
                scope.disableTimings = true;
                else
                scope.disableTimings = false;
              }
            }
          }
        });
      }
    };
  })
  .directive("confirm", ["$http", "$q", function($http, $q){
    return {
      require: "^ngModel",
      scope: {
        alternatives: "="
      },
      link: function(scope, elem, attrs, ctrl){
        var def = $q.defer();
        ctrl.$asyncValidators.confirm = function(modelValue, viewValue){
          console.log("running confirm");
          $http.get("http://titan-scheduler.in:8080/visitorAppointment?email=" + viewValue)
            .then(function(data){
              console.log(data);
              scope.alternatives = (data.data);
              def.resolve();
            }, function(){
              def.reject();
            });
          return def.promise;
        };
      }
    };
  }]);
