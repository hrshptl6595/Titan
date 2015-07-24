angular.module("employeeApp", ["ngRoute", "controllers", "directives", "services", "ngCookies"])
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider
      .when("/employeeLogin", {
        action: "employeeLogin"
      })
      .when("/dashboard", {
        action: "dashboard",
        templateUrl: "partials/myDashboard.html"
      })
      .when("/dashboard/calendar", {
        action: "dashboard.calendar",
        templateUrl: "partials/calendar.html",
      })
      .when("/dashboard/createAppointment", {
        action: "dashboard.createAppointment",
        templateUrl: "partials/createAppointment.html"
      })
      .when("/dashboard/visitors", {
        action: "dashboard.visitors",
        templateUrl: "partials/visitors.html"
      });
      $locationProvider.html5Mode(true);
  }])
