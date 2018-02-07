app.controller("loginCtrl", function ($scope, $window, $http){
	
	$scope.username = "";
	$scope.password = "";
	$scope.errorOccurred = true;
	
	$scope.login = function() {

		var data = {
			'username' : $scope.username,
			'password' : $scope.password
		};

		$http.post("php/login.php", data).then(function(response){
			if (response.data.code == 0){
				$window.location.href = "#/home";
			}
			else{
				$scope.errorMessage = "Virheellinen kirjautuminen";
				$scope.errorOccurred = false;
			}			
		});
	};
});
 
