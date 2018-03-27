app.controller("statsCtrl", function ($scope, $window, $http, $location){
	
	$scope.starttime = new Date();
	$scope.starttime.setDate($scope.starttime.getDate() - 1);
	$scope.starttime.setDate($scope.starttime.getDate() - $scope.starttime.getDay() + 1);
	$scope.starttime.setHours(0);
	$scope.starttime.setMinutes(0);
	$scope.starttime.setSeconds(0);
	$scope.starttime.setMilliseconds(0);
	
	$scope.endtime = new Date();
	$scope.endtime.setSeconds(0);
	$scope.endtime.setMilliseconds(0);
	
	$scope.errorOccurred = true;
	$scope.timespanSelection = 0;
	$scope.sensorsSelected = false;

	$scope.sensorData = [];
	$scope.charts = [];
	
	/* --- function definitions --- */
	
	function findIndex(label) {
		for (var i = 0; i < $scope.sensorData.length; i++) {
			if ($scope.sensorData[i].label.label == label) {
				return i;
			}
		}
		
		return -1;
	}
	
	$scope.setDates = function() {
		
		switch(parseInt($scope.timespanSelection)) {
			
			
			// Today
			case 1:
				alert("tänää");
				// Start
				$scope.starttime = new Date();
				$scope.starttime.setHours(0);
				$scope.starttime.setMinutes(0);
				$scope.starttime.setSeconds(0);
				$scope.starttime.setMilliseconds(0);
				
				// End
				$scope.endtime = new Date();
				$scope.endtime.setSeconds(0);
				$scope.endtime.setMilliseconds(0);
				
				break;
			
			// This week
			case 2:
			alert("täl viikol");
				// Start
				$scope.starttime = new Date();
				$scope.starttime.setDate($scope.starttime.getDate() - 1);
				$scope.starttime.setDate($scope.starttime.getDate() - $scope.starttime.getDay() + 1);
				$scope.starttime.setHours(0);
				$scope.starttime.setMinutes(0);
				$scope.starttime.setSeconds(0);
				$scope.starttime.setMilliseconds(0);
				
				// End
				$scope.endtime = new Date();
				$scope.endtime.setSeconds(0);
				$scope.endtime.setMilliseconds(0);
				
				break;
			
			// Last week
			case 3:
			alert("viime viikol");
				// Start
				$scope.starttime = new Date();
				$scope.starttime.setDate($scope.starttime.getDate() - 8);
				$scope.starttime.setDate($scope.starttime.getDate() - $scope.starttime.getDay() + 1);
				$scope.starttime.setHours(0);
				$scope.starttime.setMinutes(0);
				$scope.starttime.setSeconds(0);
				$scope.starttime.setMilliseconds(0);
				
				// End
				$scope.endtime = new Date();
				$scope.endtime.setDate($scope.endtime.getDate() - 1);
				$scope.endtime.setDate($scope.endtime.getDate() - $scope.starttime.getDay() + 1);
				$scope.endtime.setHours(0);
				$scope.endtime.setMinutes(0);
				$scope.endtime.setSeconds(0);
				$scope.endtime.setMilliseconds(0);
				
				break;
			
			// Since
			case 4:
				alert("since");
				// End
				$scope.endtime = new Date();
				$scope.endtime.setSeconds(0);
				$scope.endtime.setMilliseconds(0);
				
				break;
		}
	}
	
	$scope.getData = function() {
		
		for (var i = 0; i < $scope.sensors.length; i++) {
			
			$scope.sensorData = [];
			
			if ($scope.sensors[i].selected) {
				
				var sensor = $scope.sensors[i];
				
				var data = {
					'sensor' : sensor.id,
					'starttime' : Math.floor($scope.starttime.getTime() / 1000),
					'endtime' : Math.floor($scope.endtime.getTime() / 1000)
				};
				
				$http.post("php/getData.php", data).then(function(response){
					if (response.data.code == 0) {
						
						var entry = {
							'label' : response.data.label,
							'data' : response.data.data,
							'drawn' : false
						};
						
						$scope.sensorData.push(entry);
					}
				});
			}
		}
	};
	
	$scope.drawCharts = function() {
		
		$scope.charts = [];
		
		var canvases = document.getElementsByClassName("chartCanvas");
		
		for (var i = 0; i < $scope.sensorData.length; i++) {
			
			var data = $scope.sensorData[i];
			
			var ctx = canvases[i].getContext('2d');
			var myChart1 = new Chart(ctx, {
				type: 'line',
				data: {
					datasets: [{
						
						fill: false,
						borderColor: 'rgba(0, 0, 255, 0.5)',
						backgroundColor: 'rgba(0, 0, 255, 0.5)',
						label: data.label.label,
						data: data.data,
						pointRadius: 1,
						lineTension: 0
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
			
			$scope.charts.push(myChart1);
		}
	}
	
	$scope.drawChart = function(x) {
		x.drawn = true;
		
		var canvases = document.getElementsByClassName("chartCanvas");
		
		var index = findIndex(x.label.label);
		
		if (index != -1) {
			
			var ctx = canvases[index].getContext('2d');
			var myChart1 = new Chart(ctx, {
				type: 'line',
				data: {
					datasets: [{
						
						fill: false,
						borderColor: 'rgba(0, 0, 255, 0.5)',
						backgroundColor: 'rgba(0, 0, 255, 0.5)',
						label: x.label.label,
						data: x.data,
						pointRadius: 1,
						lineTension: 0
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
			
			$scope.charts.push(myChart1);
		}
	}
	
	/*
	
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
	
	*/
	// ---- ---- ---- //
	
	// Check if user has selected any sensors
	$scope.checkSelectedSensors = function() {
		$scope.sensorsSelected = false;
		
		for (var i = 0; i < $scope.sensors.length; i++) {
			if ($scope.sensors[i]["selected"] == true) {
				$scope.sensorsSelected = true;
			}
		}
	};
	
	// --- Instructions to be executed on load: ---
	
	// Get list of sensors in DB
	$http.post("php/getSensors.php").then(function(response){
		if (response.data.code == 0) {
			$scope.errorOccurred = true;
			$scope.showAikavali = false;
			$scope.sensors = response.data.sensors;
			
			for (var i = 0; i < $scope.sensors.length; i++) {
				$scope.sensors[i]["selected"] = false;
			}
			
		}
		else {
			$scope.errorMessage = "Virhe! Tietoja ei saatu";
			$scope.errorOccurred = false;
		}			
	});
	

});