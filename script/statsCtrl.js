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
	// POISTA!
	
	$scope.getdata = function() {
		
		switch ($scope.timeGetOpt) {
			
			// graafin piirto (POISTA!)
			case '0':
				var sTime = new Date().setTime(1519828380);
				$scope.starttime = sTime;
				var eTime = new Date().setTime(1519828390);
				$scope.endtime = eTime;
				break;
			// ---- POISTA YLÄPUOLELTA ----
				
			// vuorokauden alusta
			case '1':
				var sTime = new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0)).getTime();
				
				sTime = Math.floor(sTime / 1000);
				
				var eTime = Math.floor(new Date().getTime() / 1000);
				break;
				
			// viikon alusta
			case '2':
				var dayNum = new Date().getDay() - 1;
				var dateNum = new Date().getDate();
				var theDate = dateNum - dayNum;
				
				var sTime = new Date(new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0)).setDate(theDate)).getTime();
				sTime = Math.floor(sTime / 1000);
				
				var eTime = Math.floor(new Date().getTime() / 1000);
				break;
				
			// viime viikko
			case '3':
				var dayNum = new Date().getDay() - 1;
				var dateNum = new Date().getDate();
				var theDate = dateNum - dayNum;
				
				var eTime = new Date(new Date(new Date(new Date(new Date().setHours(23)).setMinutes(59)).setSeconds(59)).setDate(theDate - 1)).getTime();
				eTime = Math.floor(eTime / 1000);
				
				dayNum = dayNum + 7 
				theDate = dateNum - dayNum;
				var sTime = new Date(new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0)).setDate(theDate)).getTime();
				sTime = Math.floor(sTime / 1000);
				break;
				
			// alkamispvm annettu
			case '4':				
				var sTime = new Date($scope.starttime);
				
				sTime = Math.floor(sTime / 1000);
				
				var eTime = new Date();
				eTime = Math.floor($scope.endtime / 1000);
				break;
				
			// molemmat pvm annettu
			default:
				var sTime = new Date($scope.starttime);
				sTime = Math.floor(sTime / 1000);
				
				var eTime = new Date($scope.endtime);
				eTime = Math.floor(eTime / 1000);				
				break;
		}
		
		if (selectedSensorNum() == 0) {
			$scope.errorMessage = "Virhe! Valitse ainakin yksi anturi!";
			$scope.errorOccurred = false;
			$scope.hideCanvas = true;
		}
		
		else if (selectedSensorNum() == 1) {
			
			for (var i = 0; i < Object.keys($scope.selectedSensors.ids).length; i++) {
				if ($scope.selectedSensors.ids[i] == true) {
					var sensorNum = i;
				}
			}
			
			var data = {
					'sensor' : sensorNum,
					'starttime' : sTime,
					'endtime' : eTime
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
					$scope.errorMessage = "Virhe! Tietoja ei löytynyt.";
					$scope.errorOccurred = false;
					$scope.hideCanvas = true;
				}	
				
			});
		}
		
		else {
		
			for (var i = 0; i < $scope.selectedSensors.ids.length; i++) {
				if ($scope.selectedSensors.ids[i] == true) {
					var data = {
						'sensor' : (i + 1),
						'sensors' : $scope.selectedSensors,
						'starttime' : sTime,
						'endtime' : eTime
					};	
				}
			
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
			}
		}
		resetDate();
	};
	
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
	
	function resetDate() {
		var reset = new Date();
	}
	
	function selectedSensorNum() {
		var num = 0;
		for (var i = 0; i < Object.keys($scope.selectedSensors.ids).length; i++) {
			if ($scope.selectedSensors.ids[i] == true) { 
				num++;
			}
		}
		return num;
	}
	
	$scope.enableButton = function() {
		var selectedValue = inputGroupSelect01.options[inputGroupSelect01.selectedIndex].value
		if (selectedValue > -1) {
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
});