angular.module("controllers", ["services"])
  .controller("dashboardController", ["$scope", "empService", function($scope, empService){
    empService.then(function(data){
      $scope.name = data.data.empDetails.empName.toUpperCase();
      $scope.email = data.data.empDetails.empEmail;
      $scope.events = data.data.empEvents;
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
  .controller("calendarController", ["$scope", "$q", function($scope, $q){
    var deferred = $q.defer();
    if($scope.events)
      deferred.resolve($scope.events);
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
      promise: deferred.promise
    };
  }])
  .controller("visitorController", ["$scope", "$q", "$http", function($scope, $q, $http){
    $scope.init = {
      deferred: $q.defer(),
      showCalendar: false,
    };
    // $scope.showCalendar = false;
    // empService.then(function(data){
    //   console.log(data);
    //   $scope.events = data.data.empEvents;
    //   if($scope.events)
    //     deferred.resolve($scope.events);
    // }, function(data){
    //   console.log(data);
    // });
    $scope.events = [];
    $scope.profilePic = "profile.png";
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
        $scope.timings=true;
        $scope.slots = [];
        $scope.date = date;
        var flag=0;
        for(var i=9;i<=18;i++){
          flag=0;
          for(var j=0;j<eArray.length;j++)
          if(i===eArray[j].time)
          flag=1;
          if(flag===0)
          $scope.slots.push(i);
        }
      },
      promise: $scope.init.deferred.promise
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
    }
    $scope.getEmployeesList = function(department){
      $http.get("http://localhost:8080/employees?department=" + department);
    }
  }]);
