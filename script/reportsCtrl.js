app.controller("reportsCtrl", function ($scope, $window, $http, $location){

	$scope.starttime = new Date();
	
	$scope.timeGetOpt = 0;
	
	$scope.sensor = 0;
	$scope.year = 2018;
	$scope.month = "null";
	$scope.week = "null";
	$scope.sensorName = "";
	
	$scope.errorOccurred = true;
	
	$scope.hideButton = true;
	$scope.hideCanvas = true;
	$scope.hideDatepicker = true;
	
	$scope.getdata = function() {
		
		$scope.starttime.setHours(0);
		$scope.starttime.setMinutes(0);
		$scope.starttime.setSeconds(0);
		$scope.starttime.setMilliseconds(0);
		$scope.endtime = $scope.starttime.getTime() + 86400000;
		
		if ($scope.timeGetOpt == 1) {
			
			var data = {
				'sensor' : $scope.sensor,
				'starttime' : Math.floor($scope.starttime.getTime() / 1000),
				'endtime' : Math.floor($scope.endtime / 1000)
			};
			
			$http.post("php/getData.php", data).then(function(response){
			if (response.data.code == 0){
				$scope.errorOccurred = true;
				$scope.hideCanvas = false;
				$scope.graphdata = response.data.data;
				$scope.sensorLabel = response.data.label.label;
				
				var min = 0;
				var avg = 0;
				var max = 0;
				var pts = 0;
				
				for (var i = 0; i < $scope.graphdata.length; i++) {
					if ($scope.graphdata[i].y < min || min == 0) {
						min = $scope.graphdata[i].y;
					}
					if ($scope.graphdata[i].y > max) {
						max = $scope.graphdata[i].y;
					}
					avg = avg + $scope.graphdata[i].y;
					pts++;
				}
				
				avg = avg / pts;
				
				var ctx = document.getElementById("myChart1").getContext('2d');
				var myChart1 = new Chart(ctx, {
					type: 'bubble',
					data: {
						datasets: [{
							label: $scope.sensorLabel,
							data: [{
								y: min,
								x: 0,
								r: 5
								
							}, {
								y: max,
								x: 0,
								r: 5
							}, {
								y: avg,
								x: 0,
								r: 10
							}],
							backgroundColor: 'rgba(0, 0, 0, 1)'
					
						}],
						
					}

				});
			}
			else {
				$scope.errorMessage = "Tietoja ei löytynyt.";
				$scope.errorOccurred = false;
				$scope.hideCanvas = true;
			}	
		});
		resetDate();
		}
		
		else {
			if ($scope.timeGetOpt == 2) {
				var data = {
					'sensor' : $scope.sensor,
					'week' : $scope.week,
					'year' : $scope.year,
					'month' : null
				};
			}
		
			else if ($scope.timeGetOpt == 3) {
				var data = {
					'sensor' : $scope.sensor,
					'month' : $scope.month,
					'year' : $scope.year,
					'week' : null
				};
			}
			
			$http.post("php/getReport.php", data).then(function(response){
			if (response.data.code == 0){
				$scope.errorOccurred = true;
				$scope.hideCanvas = false;
				$scope.graphdata = response.data.data;
				
				var dataForGraph = new Array();
				
				for (var i in $scope.graphdata) {
					var min = new Object({x: i, y: $scope.graphdata[i].min, r: 5});
					dataForGraph.push(min);
					
					
					var max = new Object({x: i, y: $scope.graphdata[i].max, r: 5});
					dataForGraph.push(max);
					
					var avg = new Object({x: i, y: $scope.graphdata[i].avg, r: 10});
					dataForGraph.push(avg);
				}
				
				var ctx = document.getElementById("myChart1").getContext('2d');
				var myChart1 = new Chart(ctx, {
					type: 'bubble',
					data: {
						datasets: [{
							label: $scope.sensorName,
							data: dataForGraph,
							backgroundColor: 'rgba(0, 0, 0, 1)'
						}],
						options: {
							scales: {
								xAxes: [{
									beginAtZero: true,
									stepSize: 0.5,
									maxTicksLimit: 5
								}]
							}
						}
						
					}

				});
			}
			else {
				$scope.errorMessage = "Tietoja ei löytynyt.";
				$scope.errorOccurred = false;
				$scope.hideCanvas = true;
			}	
		});
			
		}
	};
	
	$http.post("php/getSensors.php").then(function(response){
		if (response.data.code == 0) {
			$scope.errorOccurred = true;
			$scope.sensors = response.data.sensors;
		}
		else {
			$scope.errorMessage = "Virhe! Tietoja ei saatu";
			$scope.errorOccurred = false;
		}			
	});
	
	function resetDate() {
		var reset = new Date();
	}
	
	$scope.enableButton = function() {
		var selectedValue = inputGroupSelect01.options[inputGroupSelect01.selectedIndex].value
		if (selectedValue > -1) {
			$scope.hideButton = false;
		}
	}	
});
