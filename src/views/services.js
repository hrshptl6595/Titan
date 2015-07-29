angular.module("services", ["ngCookies"])
  .factory("employee", ["$http", "$cookies", function($http, $cookies){
    var service = {};
    return service; 
  }])
  .factory("sharedPromise", ["$q", function($q){
    var service = {};
    service.deferred = $q.defer();
    service.promise = service.deferred.promise;
    service.date = null;
    service.eArray = null;
    return service;
  }]);
