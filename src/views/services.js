angular.module("services", [])
  .factory("empService", ["$http", function($http){
    var service = {};
    var request = {
      method: "GET",
      headers: {
        "x-employee": "exists"
      },
      url: "http://localhost:8080/dashboard"
    };
    return $http(request);
  }]);
