app.controller("statsCtrl", function ($scope, $window, $http, $location){
	
	$scope.starttime = new Date();
	$scope.endtime = new Date();
	$scope.sensor = 0;
	$scope.errorOccurred = true;
	
	$scope.timeGetOpt = 0;
	
	$scope.hideButton = true;
	$scope.hideCanvas = true;
	$scope.hideDatepickerU = true;
	$scope.hideDatepickerL = true;
	
	// POISTA!
	$scope.debugString = "";
	
	$scope.getdata = function() {
		
		switch ($scope.timeGetOpt) {
			
			// vuorokauden alusta
			case '1':
				
			//	$scope.starttime = "2018-02-28 16:33:00";
			//	$scope.endtime = "2018-02-28 16:33:10";
				break;
				
			// viikon alusta
			case '2':
				break;
				
			// viime viikko
			case '3':
				break;
				
			// alkamispvm annettu
			case '4':
				break;
				
			// molemmat pvm annettu
			default:
				break;
		}
		
		var data = {
			'sensor' : 1,
			'sensors' : $scope.selectedSensors,
			'starttime' : $scope.starttime,
			'endtime' : $scope.endtime
		};
		
		$http.post("php/getData.php", data).then(function(response){
			if (response.data.code == 0){
				$scope.errorOccurred = true;
				$scope.hideCanvas = false;
				$scope.graphdata = response.data.data;
				
				$scope.sensorname = "Anturi" + " " + data.sensor;
				
				var ctx = document.getElementById("myChart1").getContext('2d');
				var myChart1 = new Chart(ctx, {
					type: 'line',
					data: {
						datasets: [{
							label: $scope.sensorname,
							data: $scope.graphdata,
							pointRadius: 0
						}]
					},
					options: {
						scales: {
							xAxes: [{
								type: 'time',
							}]
						}
					}
				});
			}
			else {
				$scope.errorMessage = "Virhe! Jokin tieto puuttui!";
				$scope.errorOccurred = false;
				$scope.hideCanvas = true;
			}	
			$scope.debugString = data;			
		});
	};
	
	$scope.enableButton = function() {
		var selectedValue = inputGroupSelect01.options[inputGroupSelect01.selectedIndex].value
		if (selectedValue > 0) {
			$scope.hideButton = false;
		}
		else {
			$scope.hideButton = true;
		}
		if (selectedValue == 4) {
			$scope.hideDatepickerU = false;
			$scope.hideDatepickerL = true;
		}
		
		else if (selectedValue == 5) {
			$scope.hideDatepickerU = false;
			$scope.hideDatepickerL = false;
		}
		
		else {
			$scope.hideDatepickerU = true;
			$scope.hideDatepickerL = true;
		}
	}	
	
	$http.post("php/getSensors.php").then(function(response){
		if (response.data.code == 0) {
			$scope.errorOccurred = true;
			$scope.showAikavali = false;
			$scope.sensors = response.data.sensors;
			
			$scope.selectedSensors = { ids: { } };
			for (var i = 0; i < $scope.sensors.length; i++) {
				$scope.selectedSensors.ids[$scope.sensors[i].id] = false;
			}
		}
		else {
			$scope.errorMessage = "Virhe! Tietoja ei saatu";
			$scope.errorOccurred = false;
		}			
	});
});
 