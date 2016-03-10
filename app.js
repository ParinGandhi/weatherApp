// Module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// Routes
weatherApp.config(function ($routeProvider) {
   $routeProvider
    .when('/', {
       templateUrl: 'views/home.html',
       controller: 'homeCtrl'
   })
   .when('/forecast', {
       templateUrl: 'views/forecast.html',
       controller: 'forecastCtrl'
   })
   .when('/forecast/:days', {
       templateUrl: 'views/forecast.html',
       controller: 'forecastCtrl'
   })
});

// Services
weatherApp.service('cityService', function() {
   this.city = "";
});

// Home Controller
weatherApp.controller('homeCtrl', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {

    $scope.city = cityService.city;
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });

    $scope.submit = function() {
        $location.path("/forecast");
    };

}]);

// Forecast Controller
weatherApp.controller('forecastCtrl', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {

    $scope.city = cityService.city;

    $scope.days = $routeParams.days || '2';

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=13dc33037d1d34b73612dd449f5afb81", {
        callback: "JSON_CALLBACK" }, {get: {method: "JSONP" }});

    $scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt: $scope.days});

    $scope.month = $scope.weatherResult.list;

    console.log($scope.weatherResult);

    $scope.convertToF = function(degK) {
        return Math.round((1.8 * (degK -273)) + 32);
    };

    $scope.convertToDate = function(dt) {
        return new Date(dt * 1000);
    };

}]);

