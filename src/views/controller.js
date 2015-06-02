var empController = angular.module("empController",["ngRoute"]);

empController.controller("empSignupC", ["$http", function($http){
  this.fields = [
    {
      label: "User Name",
      id: ""
    },
    {
      label: "Email",
      id: ""
    },
    {
      label: "Password",
      id: ""
    }
  ];
  this.submit = function() {
    $http
      .post("http://localhost:8080/signupEmployee", {
        userNameEmployee: this.fields[0].id,
        emailEmployee: this.fields[1].id,
        passwordEmployee: this.fields[2].id})
      .success(function (data) {
        alert(data);
    });
  };
}]);

empController.controller("empLoginC", ["$http","$route","$location", function($http,$route,$location){
  this.fields = [
    {
      label: "User Name",
      id: ""
    },
    {
      label: "Password",
      id: ""
    }
  ];
  this.submit = function() {
    $http
      .post("http://localhost:8080/loginEmployee", {
        userNameEmployee: this.fields[0].id,
        passwordEmployee: this.fields[1].id})
      .success(function (data) {
        console.log(data);
        alert(data.accessToken + "\nLogged in!");
        localStorage.setItem("accessTokenEmployee",data.accessToken);
        var req = {
          method: "GET",
          headers: {"Authorization" : "Bearer " + localStorage.getItem("accessTokenEmployee")},
          url: "http://localhost:8080/appointments"
        };
        $http(req)
          .success(function (data) {
            console.log(data);
            // $http.get("http://localhost:8080/schedule").success(function(){console.log("at appointments truly!");});
            $location.path("/schedule");
        });
    });
  };
  this.forgotPassword = function() {
    $http
      .get("http://localhost:8080/forgotPassword?userNameEmployee=" + this.fields[0].id)
      .success(function() {
        alert("yay!");
    });
  };
}]);
