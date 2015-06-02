var employeeApp = angular.module("employeeApp", ["ngRoute","empController"]);

employeeApp.config(["$routeProvider","$locationProvider", function($routeProvider,$locationProvider){
  $routeProvider
    .when("/employeeSignup", {
      templateUrl: "partials/employeeSignup.html",
      controller: "empSignupC",
      controllerAs: "empSignup"
    })
    .when("/schedule", {
      templateUrl: "partials/schedule.html",
    });
  $locationProvider.html5Mode(true);
}]);
