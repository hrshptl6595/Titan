angular.module("visitorApp", ["ngRoute", "ngCookies", "controllers", "directives", "services"])
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider
      .when("/visitorAppointment", {
        templateUrl: "partials/appointment.html",
        controller: "visitorController"
      })
      .when("/visitorAppointment/confirm", {
        templateUrl: "partials/confirm.html",
        controller: "confirmController"
      });
    $locationProvider.html5Mode(true);
  }]);
