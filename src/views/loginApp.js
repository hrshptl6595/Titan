angular.module("loginApp", [])
  .controller("loginController", ["$scope", "$http", function($scope, $http){
    var request = {
      method: "GET",
      url: "http://localhost:8080/employeeLogin",
      headers: {
        "x-googleauth": "exists"
      }
    };
    $http(request).success(function(data){
      $scope.googleAuth = data.encodedURI;
    });
  }]);
