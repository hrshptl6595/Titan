var employeeApp = angular.module("employeeApp", ["ngRoute","empController"]);

employeeApp.directive('myTabs', function(){
  return{
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope) {
      var panes = $scope.panes = [];
      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };
      this.addPane = function(pane) {
        if (panes.length === 0)
          $scope.select(pane);
        panes.push(pane);
      };
    },
    templateUrl: "signupLoginTabsEmployee.html"
  };
})
.directive('myPane', function(){
  return{
    require: '^myTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl){
      tabsCtrl.addPane(scope);
    },
    templateUrl: "panesEmployee.html"
  };
});

employeeApp.config(["$routeProvider","$locationProvider","$logProvider", function($routeProvider,$locationProvider,$logProvider){
  $routeProvider
    .when("/employeeAccount", {
      templateUrl: "partials/employeeAccount.html",
    })
    .when("/schedule", {
      templateUrl: "partials/schedule.html",
      controller: "scheduleController",
    });
  $locationProvider.html5Mode(true);
  $logProvider.debugEnabled(true);
}]);
