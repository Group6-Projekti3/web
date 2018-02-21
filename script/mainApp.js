var app = angular.module("mainApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html",
		controller : "loginCtrl"
    })
	.when("/home", {
        templateUrl : "home.html",
	    controller : "homeCtrl"
    })
	.when("/stats", {
        templateUrl : "stats.html",
	    controller : "statsCtrl"
    });
});
