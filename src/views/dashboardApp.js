angular.module("dashboardApp", ["ngRoute", "controllers", "directives"])
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider
      .when("/dashboard", {
        templateUrl: "partials/myDashboard.html"
      })
      .when("/dashboard/calendar", {
        templateUrl: "partials/calendar.html",
        controller: "calendarController"
      })
      .when("/dashboard/createAppointment", {
        templateUrl: "partials/createAppointment.html"
      })
      .when("/dashboard/visitors", {
        templateUrl: "partials/visitors.html"
      });
    $locationProvider.html5Mode(true);
  }]);
