angular.module("controllers", [])
  .controller("dashboardController", ["$scope", "$http", function($scope, $http){
    var request = {
      method: "GET",
      headers: {
        authorization: "Bearer " + "110004310269636919935"
      },
      url: "http://localhost:8080/dashboard"
    };
    $http(request).success(function(data){
      $scope.name = data.empDetails.empName.toUpperCase();
      $scope.email = data.empDetails.empEmail;
      $scope.events = data.empEvents;
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
  .controller("calendarController", ["$scope", function($scope){
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
      }
    };
  }])
  .controller("visitorController", ["$scope", function($scope){
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
      }
    };
    $scope.events = null;
    $scope.getEmptySlots = function(dated){
      
    }
  }]);
