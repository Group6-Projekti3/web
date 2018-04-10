app.controller("homeCtrl", function ($scope, $window, $http, $location){
	// Homepage Controller
	
	$scope.newMin;
	$scope.newMax;
	$scope.idToChange;
	
	function fetch() {
		$scope.latestData = [];
		
		$http.get("php/getSensors.php").then(function(response){
			if (response.data.code == 0){
				$scope.sensors = response.data.sensors;
				
				getData($scope.sensors);
				
			}
			else{
				$scope.sensors = response.data.sensors;
			}			
		});
	}
	
	function getData(sensors) {
		for (i = 0; i < sensors.length; i++) {
			
			var data = {
				'sensor' : sensors[i].id
			};
			
			$http.post("php/getLatestData.php", data).then(function(response){
				
				if (response.data.code == 0) {
					$scope.latestData.push(response.data);
				}
				
			});
		}
	}
	
	function validateMinMax() {
		return ($scope.newMin < $scope.newMax && Number($scope.newMin) === $scope.newMin && Number($scope.newMax) === $scope.newMax);
	}
	
	$scope.setMinMax = function(id, min, max) {

		$scope.newMin = min;
		$scope.newMax = max;
		$scope.idToChange = id;
		
	};
	
	$scope.saveMinMax = function() {

		if (validateMinMax()) {

			var data = {
				'sensor' : $scope.idToChange,
				'newMin' : $scope.newMin,
				'newMax' : $scope.newMax
			};
			
			$http.post("php/setMinMax.php", data).then(function(response){
				
				if (response.data.code == 0) {
					alert("Raja-arvot päivitetty!");
					fetch();
					$('#setMinMaxModal').modal('hide');
				} else {
					alert("Palvelinvirhe!");
				}
				
			});
		} else {
			alert("Tarkista arvot!");
		}
	};
	
	// --- --- ---
	
	fetch();
	
	// Get current users info
	$http.get("php/whoAmI.php").then(function(response){
		if (response.data.code == 0){
			$scope.me = response.data.user;
		}
		else{
			
		}			
	});
});
