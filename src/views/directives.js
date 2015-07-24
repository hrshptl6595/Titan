angular.module("directives", [])
  .directive("formatTabs", function(){
    return{
      templateUrl: "formatTabs.html",
      transclude: true,
      scope: {
        settings: "=",
        events: "="
      },
      controller: function($scope) {
        $scope.formatTabs = [];
        $scope.rObject = {};
        this.dated = [];
        var self=this;
        $scope.settings.promise.then(function(data){
          $scope.events = data;
          $scope.rObject = recurrence({
            settings: $scope.settings,
            events: $scope.events
          });
          computeDated();
          $scope.rObject.setup(self.dated);
        });
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
            events: $scope.events
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
  })
  .directive("calendarMonth", function(){
    return {
      templateUrl: "calendarMonth.html",
      require: "^formatTabs",
      scope: {
        type: "@"
      },
      link: function(scope, elem, attrs, formatTabsCtrl) {
        scope.settings = formatTabsCtrl.getObjects().settings;
        var rObject = {};
        scope.settings.promise.then(function(){
          formatTabsCtrl.addFormatTab(scope);
          rObject = formatTabsCtrl.getObjects().rObject;
          scope.events = formatTabsCtrl.getObjects().events;
          scope.$watchGroup(["settings.month","settings.year","settings.date"], callback);
        });
        function callback() {
          console.log(scope);
          console.log("month calendar directive id : " + scope.$id);
          scope.directiveProps.rows = [], scope.directiveProps.cols = [], scope.directiveProps.monthlyEvents = [];
          for(i=0;i<7;i++) {
            if(i<6) scope.directiveProps.rows.push(i);
            scope.directiveProps.cols.push(i);
          }
          scope.directiveProps.dated = formatTabsCtrl.dated;
          rObject.getMonthlyEvents(scope.directiveProps.monthlyEvents, scope.directiveProps.dated);
        }
      }
    };
  })
  .directive("calendarWeek", ["$timeout", function($timeout){
    return {
      templateUrl: "calendarWeek.html",
      require: "^formatTabs",
      scope: {
        type: "@"
      },
      link: function(scope, elem, attrs, formatTabsCtrl) {
        scope.settings = formatTabsCtrl.getObjects().settings;
        var rObject = {};
        scope.settings.promise.then(function(){
          formatTabsCtrl.addFormatTab(scope);
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
          for(var i=0;i<24;i++) {
            if(i<=6) scope.directiveProps.cols.push(i);
            scope.directiveProps.rows.push(i);
          }
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
        scope.settings = formatTabsCtrl.getObjects().settings;
        var rObject = {};
        scope.settings.promise.then(function(){
          formatTabsCtrl.addFormatTab(scope);
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
          for(var i=0;i<24;i++)
            scope.directiveProps.rows.push(i);
            rObject.getDailyEvents(scope.directiveProps.dailyEvents);
        }
      }
    };
  }])
  .directive("numCheck", function(){
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl){
        ctrl.$validators.numCheck = function(modelValue, viewValue){
          if(ctrl.$isEmpty(modelValue))
            return true;
          else if(viewValue.length === 10)
            return true;
          else
            return false;
        };
      }
    };
  })
  .directive("employeeCheck", ["$http", "$q", "$timeout", function($http, $q, $timeout){
    return {
      require: "ngModel",
      scope: {
        events: "=",
        init: "="
      },
      link: function(scope, elem, attrs, ctrl){
        ctrl.$asyncValidators.employeeCheck = function(modelValue, viewValue){
          console.log("running!");
          var def = $q.defer();
          $timeout(function(){
            $http.get("http://localhost:8080/employees?name=" + viewValue)
            .then(function(data){
              console.log(data);
              scope.events = data.data.empEvents;
              scope.init.deferred.resolve(data.data.empEvents);
              scope.init.showCalendar = true;
              def.resolve();
            }, function(){
              def.reject();
            })
          }, 5000);
          return def.promise;
        }
      }
    };
  }])
  .directive("visitorCheck", ["$http", function($http){
    return{
      require: "ngModel",
      link: function(scope, elem, attrs, ctrl){
        ctrl.$validators.visitorCheck = function(modelValue, viewValue){
          if(ctrl.$isEmpty(modelValue))
            return true;
          else
            $http.post("http://localhost:8080/visitorAppointment",{
              visitorName: viewValue
            })
            .success(function(result){
              if (result) {
                scope.company = result.visitorCompany;
                scope.email = result.visitorEmail;
                scope.contactNumber = result.visitorNumber;
                return true;
              }
              else
                return false;
            });
        };
      }
    };
  }]);