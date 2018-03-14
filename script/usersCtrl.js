app.controller("usersCtrl", function ($scope, $window, $http, $location){
	// Users page Controller
	
	$scope.initVar = function() {
		$scope.oldPassword = ""
		$scope.newPassword = "";
		$scope.confirmPassword = "";
		
		$scope.errorMsg = "";
		
		$scope.newUsername = "";
		$scope.newUserType = 2;
		$scope.newUsersPassword = "";
		$scope.confirmNewUsersPassword = "";
	};
	
	$scope.getType = function(id) {

		var type = null;
		
		try {
			for (var i = 0; i < $scope.types.length; i++) {
				if ($scope.types[i].id == id) {
					type = $scope.types[i].name;
					i = $scope.types.length;
				}
			}
		} catch(err) {
			
		}
		
		return type;
	};
	
	$scope.changePw = function() {
		
		var data = {
			'old' : $scope.oldPassword,
			'newPw' : $scope.newPassword
		};
		
		$http.post("php/changePassword.php", data).then(function(response){
			if (response.data.code == 0){
				$scope.errorMsg = "";
				alert("Salasanasi on vaihdettu!\nSinut kirjataan ulos automaattisesti, kirjaudu takaisin sisään uudella salasanalla.");
				document.location.href = "https://kallio.dtdns.net/p3";
			}
			else if (response.data.code == 4) {
				$scope.errorMsg = "Vanha salasana on väärin!";
			}
			else if (response.data.code == 5) {
				$scope.errorMsg = "Uusi salasana on liian lyhyt!";
			}
			else {
				$scope.errorMsg = "Virhe!";
			}
		});
	};
	
	$scope.addUser = function() {
		
		if ($scope.newUsersPassword == $scope.confirmNewUsersPassword && $scope.newUsersPassword.length > 4 && $scope.newUsername.length > 2) {
			
			var data = {
				'username' : $scope.newUsername,
				'type' : $scope.newUserType,
				'password' : $scope.newUsersPassword
			};
			
			$http.post("php/addUser.php", data).then(function(response) {
				if (response.data.code == 0) {
					alert("Käyttäjä on lisätty!");
					location.reload();
				} else {
					alert("Virhe!");
				}				
			});
			
		} else {
			$scope.errorMsg = "Tiedot eivät ole kelvollisia!";
		}
	}
	
	/* --- --- --- --- --- */
	
	$scope.initVar();
	
	// Get all user types
	$http.get("php/getUserTypes.php").then(function(response){
		if (response.data.code == 0){
			$scope.types = response.data.types;
		}
		else{
			
		}			
	});
	
	// Get current users info
	$http.get("php/whoAmI.php").then(function(response){
		if (response.data.code == 0){
			$scope.me = response.data.user;
		}
		else{
			
		}			
	});
	
	// Get all users
	$http.get("php/getUsers.php").then(function(response){
		if (response.data.code == 0){
			$scope.users = response.data.users;
		}
		else{
			
		}			
	});
});
