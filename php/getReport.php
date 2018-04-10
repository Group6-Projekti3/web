<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		

		$sensor = $request->sensor;
		$year = $request->year;
		$week = $request->week;
		$month = $request->month;
		
		if (isset($_SESSION["user"])) {
			
			if (!is_null($week)) {
				
				$query = $conn->prepare("SELECT * FROM `sensor_data` WHERE YEAR(time) = ? AND WEEK(time) = ? AND sensor_id = ? ORDER BY time");
				$query->bind_param("iii", $year, $week, $sensor);
				
			} elseif (!is_null($month)) {
				
				$query = $conn->prepare("SELECT * FROM `sensor_data` WHERE YEAR(time) = ? AND MONTH(time) = ? AND sensor_id = ?");
				$query->bind_param("iii", $year, $month, $sensor);
				
			} else {
				$resp["code"] = 6;
			}
			
			if (!is_null($query)) {
				$query->execute();
				
				$result = $query->get_result();
				
				$data = [];
				
				while ($row = $result->fetch_assoc()) {
					
					$time = strtotime($row["time"]);
					
					$day = date('j', $time);
					
					if (isset($data[$day])) {
						
						$value = $row["plot_value"];
						
						// Min/Max
						if ($data[$day]["min"] > $value) {
							$data[$day]["min"] = $value;
						} elseif ($data[$day]["max"] < $value) {
							$data[$day]["max"] = $value;
						}
						
						$data[$day]["count"] += 1;
						$data[$day]["sum"] += $value;
						
					} else {
						$data[$day] = [
							'min' => $row["plot_value"],
							'max' => $row["plot_value"],
							'avg' => 0,
							'count' => 1,
							'sum' => $row["plot_value"]
						];
					}
					
				}
				
				foreach ($data as $key => $day) {
					$data[$key]["avg"] = $day["sum"] / (float)$day["count"];
				}
				
				$resp["code"] = 0;
				$resp["data"] = $data;
			}
			
		} else {
			$resp["code"] = 1;
		}
	} catch (Exception $e) {
		$resp = [];
		$resp["code"] = -1;
	}

	echo json_encode($resp);
?>