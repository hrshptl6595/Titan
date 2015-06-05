var empController = angular.module("empController",["ngRoute"]);

empController.controller("signupController", ["$http","$scope","$timeout", function($http,$scope,$timeout){
  $scope.fields = [
    {
      label: "User Name",
      id: "",
      type: "text"
    },
    {
      label: "Email",
      id: "",
      type: "email"
    },
    {
      label: "Password",
      id: "",
      type: "password"
    }
  ];
  $scope.submit = function() {
    $http
      .post("http://localhost:8080/signupEmployee", {
        userNameEmployee: $scope.fields[0].id,
        emailEmployee: $scope.fields[1].id,
        passwordEmployee: $scope.fields[2].id})
      .success(function (data) {
        console.log(data);
        document.getElementById("signupH1").innerHTML = "Thank you for signing up! Proceed to Login!";
        $timeout(function () {
          document.getElementById("signupH1").innerHTML = "Sign Up";
          for(var i=0;i<3;i++){$scope.fields[i].id="";}
        }, 10000);
      });
  };
}]);

empController.controller("loginController", ["$http","$route","$location","$scope","$rootScope", function($http,$route,$location,$scope,$rootScope){
  $scope.fields = [
    {
      label: "User Name",
      id: "",
      type: "text"
    },
    {
      label: "Password",
      id: "",
      type: "password"
    }
  ];

  $scope.submit = function() {
    $http
      .post("http://localhost:8080/loginEmployee", {
        userNameEmployee: $scope.fields[0].id,
        passwordEmployee: $scope.fields[1].id})
      .success(function (data) {
        console.log(data);
        for(var i=0;i<2;i++){$scope.fields[i].id="";}
        localStorage.setItem("accessTokenEmployee",data.accessToken);
        var req = {
          method: "GET",
          headers: {"Authorization" : "Bearer " + localStorage.getItem("accessTokenEmployee")},
          url: "http://localhost:8080/appointments"
        };
        $http(req)
          .success(function (data) {
            console.log(data);
            $rootScope.scheduleData = data;
            $location.path("/schedule");
        });
    });
  };
  $scope.forgotPassword = function() {
    if($scope.fields[0].id)
      $http
        .get("http://localhost:8080/loginEmployee?userNameEmployee=" + $scope.fields[0].id)
        .success(function() {
          document.getElementById("loginH1").innerHTML = "Your password has been emailed to you!";
        });
    else
      document.getElementById("loginH1").innerHTML = "Please provide your user name!";
  }
}]);

empController.controller("scheduleController",function($scope){
  $scope.message="Hello World!";
});
