var empLanding = angular.module("empLanding", []);

empLanding.controller("empSignupC", ["$http", function($http){
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
      .success(function () {
        alert("yay!");
    });
  };
}]);

empLanding.controller("empLoginC", ["$http", function($http){
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
        passwordEmployee: this.fields[2].id})
      .success(function () {
        alert("yay!");
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
