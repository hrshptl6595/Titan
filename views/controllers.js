angular.module("controllers", ["ngCookies", "services"])
  .controller("employeeController", ["$route", "$scope", function($route, $scope){
    $scope.$on("$routeChangeSuccess", function(e){
      console.log($route.current);
      if($route.current.action && $route.current.action==="employeeLogin")
        $scope.view = "employeeLogin";
      else if($route.current.action && ($route.current.action==="dashboard" || $route.current.action==="dashboard.calendar"|| $route.current.action==="dashboard.createAppointment"|| $route.current.action==="dashboard.visitors"))
        $scope.view = "dashboard";
    });
  }])
  .controller("loginController", ["$scope", "$http", function($scope, $http){
    var request = {
      method: "GET",
      url: "http://titan-scheduler.in:8080/employeeLogin",
      headers: {
        "x-googleauth": "exists"
      }
    };
    $http(request).success(function(data){
      $scope.googleAuth = data.encodedURI;
    });
  }])
  .controller("dashboardController", ["$scope", "employee", "$http", "$cookies", "$location", function($scope, employee, $http, $cookies, $location){
    $http({
      url: "http://titan-scheduler.in:8080/dashboard",
      method: "GET",
      headers: {
        "x-employee": "exists"
      }
    }).then(function(data){
      console.log(data);
      if(typeof(data.data)==="object"){
        $scope.name = data.data.empDetails.empName.toUpperCase();
        $scope.email = data.data.empDetails.empEmail;
        $scope.pendingReqs = data.data.pendingReqsArray;
        $scope.visitorsToday = data.data.visitorsTodayArray;
        employee.empDetails = data.data.empDetails;
      }
      else if(typeof(data.data)==="string")
      $location.url("/employeeLogin");
    });
    $scope.tabs = [
      {
        href: "/dashboard",
        tab: "Home"
      },
      {
        href: "/dashboard/calendar",
        tab: "Calendar"
      },
      {
        href: "/dashboard/createAppointment",
        tab: "Create Appointment"
      },
      {
        href: "/dashboard/visitors",
        tab: "Visitors"
      }
    ];
  }])
  .controller("calendarController", ["$scope", "$q", "sharedPromise", "$location", "$http", "employee", "$cookies", function($scope, $q, sharedPromise, $location, $http, employee, $cookies){
    var deferred = $q.defer();
    $http({
      url: "http://titan-scheduler.in:8080/dashboard",
      method: "GET",
      headers: {
        "x-calendar": "exists"
      }
    }).then(function(data){
      console.log(data);
      if(typeof(data.data)==="object"){
        $scope.events = data.data.empEvents;
        employee.empEvents = $scope.events;
        deferred.resolve($scope.events);
      }
      else if(typeof(data.data)==="string")
      $location.url("/employeeLogin");
    });
    $scope.settings = {
      months: ["Jan","Feb","March","April","May","June","July","August","Sep","Oct","Nov","Dec"],
      daysOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      date: 1,
      month: (new Date()).getMonth(),
      year: (new Date()).getFullYear(),
      monthName: function(){
        return this.months[this.month];
      },
      day: function(){
        return (new Date(this.year, this.month, this.date)).getDay();
      },
      dateLimit: function(Month){
        if(Month<7) {
          if((Month === 1) && (($scope.settings.year%4) !== 0 ))
            return 28;
          else if((Month === 1) && (($scope.settings.year%4) === 0) && (($scope.settings.year%100) === 0) && (($scope.settings.year%400) !== 0))
            return 28;
          else if((Month === 1) && (($scope.settings.year%4) === 0) && (($scope.settings.year%100) === 0) && (($scope.settings.year%400) === 0))
            return 29;
          else if((Month === 1) && (($scope.settings.year%4) === 0) && (($scope.settings.year%100) !== 0))
            return 29;

          if(Month%2===0)
            return 31;
          else
            return 30;
        }
        else {
          if(Month%2 === 0)
            return 30;
          else
            return 31;
        }
      },
      noEvents: false,
      promise: deferred.promise,
      sharedPromiseResolved: false,
      getEmptySlots: function(eArray, date) {
        if($scope.settings.sharedPromiseResolved){
          sharedPromise.date = new Date($scope.settings.year, $scope.settings.month, date);
          sharedPromise.eArray = eArray;
          console.log(sharedPromise.date);
          console.log(sharedPromise.eArray);
          $location.url("/dashboard");
        }
      }
    };
  }])
  .controller("visitorController", ["$scope", "$q", "$http", function($scope, $q, $http){
    $scope.profilePic = "profile.jpg";
    $scope.init = {
      deferred: $q.defer(),
      showCalendar: false,
      empUnique: null,
      showTimings: false
    };
    $scope.depts = [
      "MD OFFICE",
      "FINANCE",
      "CORPORATE GENERAL",
      "MARKETING",
      "HUMAN RESOURCES",
      "DESIGN",
      "SYSTEMS",
      "RETAILING",
      "COO'S OFFICE-WATCH DIVISION",
      "CENTRAL TECHNOLOGY SERVICES",
      "SALES",
      "PURCHASE",
      "SUPPLY CHAIN MANAGEMENT",
      "CUSTOMER SERVICE",
      "INTERNATIONAL OPERATIONS - TPD",
      "TRADE WATCHES",
      "MERCHANDISING",
      "GENERAL",
      "CORPORATE SALES",
      "FRAGNANCES",
      "ADMINISTRATION",
      "INTERNAL AUDIT",
      "JEWELLERY",
      "E-COMMERCE",
      "COMMERCIAL",
      "AFTER SALES SERVICE",
      "ECB",
      "INTEGRATED RETAIL SERVICES"
    ]
    $scope.list = [];
    $scope.events = [];
    $scope.settings = {
      months: ["Jan","Feb","March","April","May","June","July","August","Sep","Oct","Nov","Dec"],
      daysOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      date: 1,
      month: (new Date()).getMonth(),
      year: (new Date()).getFullYear(),
      monthName: function(){
        return this.months[this.month];
      },
      day: function(){
        return (new Date(this.year, this.month, this.date)).getDay();
      },
      dateLimit: function(Month){
        if(Month<7) {
          if((Month === 1) && (($scope.settings.year%4) !== 0 ))
            return 28;
          else if((Month === 1) && (($scope.settings.year%4) === 0) && (($scope.settings.year%100) === 0) && (($scope.settings.year%400) !== 0))
            return 28;
          else if((Month === 1) && (($scope.settings.year%4) === 0) && (($scope.settings.year%100) === 0) && (($scope.settings.year%400) === 0))
            return 29;
          else if((Month === 1) && (($scope.settings.year%4) === 0) && (($scope.settings.year%100) !== 0))
            return 29;

          if(Month%2===0)
            return 31;
          else
            return 30;
        }
        else {
          if(Month%2 === 0)
            return 30;
          else
            return 31;
        }
      },
      noEvents: true,
      getEmptySlots: function(eArray, date){
        $scope.init.showTimings = true;
        $scope.eArray = eArray;
        $scope.thatDate = date;
        console.log(eArray, date);
        console.log($scope.settings);
        console.log(new Date($scope.settings.year, $scope.settings.month, $scope.thatDate));
        console.log(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
      },
      promise: $scope.init.deferred.promise
    };
    $scope.setDeferred = function(value){
      $scope.init.deferred = value;
      $scope.settings.promise = $scope.init.deferred.promise;
    };
    $scope.uploadPhoto = function(){
      FB.login(function(response) {
        if(response.status === "connected") {
          FB.api('/me/picture', function(response) {
            console.log(response);
            $scope.$apply(function(){
              $scope.profilePic = response.data.url;
            });
          });
        }
        else if(response.status === "not_authorized")
          console.log("not authorized!");
        else if(response.status === "unknown")
          console.log("unknown!");
      }, {scope: 'public_profile,email'});
    };
    $scope.submit = function(slot){
      console.log($scope.form);
      $scope.submitted = true;
      if($scope.form.$valid)
        $http({
          url: "http://titan-scheduler.in:8080/visitorAppointment",
          method: "POST",
          data: {
            visitorPicture: $scope.profilePic,
            visitorName: $scope.name,
            visitorEmail: $scope.email,
            visitorNumber: $scope.contactNumber,
            visitorCompany: $scope.company,
            visitorPurpose: $scope.purpose,
            empUnique: $scope.init.empUnique,
            date: new Date($scope.settings.year, $scope.settings.month, $scope.thatDate),
            slot: slot
          }
        });
    };
  }])
  .controller("confirmController", ["$scope", "$http", function($scope, $http){
    $scope.alternatives = {};
    $scope.okay = function(visitor){
      visitor.approved = true;
      visitor.suggestedAlternative = false;
      $http({
        url: "http://titan-scheduler.in:8080/dashboard",
        method: "POST",
        data : {
          visitor: visitor
        }
      }).success(function(data){
        console.log(data);
      });
    };
    $scope.reject = function(visitor){
      visitor.approved = false;
      visitor.suggestedAlternative = false;
      $http({
        url: "http://titan-scheduler.in:8080/dashboard",
        method: "POST",
        data : {
          visitor: visitor
        }
      }).success(function(data){
        console.log(data);
      });
    }
  }]);
