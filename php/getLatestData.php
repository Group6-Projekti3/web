<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		if (isset($_SESSION["user"])) {
			
			$resp = [];
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			$sensor = $request->sensor;
			
			$query = $conn->prepare("SELECT *
									FROM sensor_data
									WHERE sensor_id = ?
									ORDER BY time DESC
									LIMIT 1");
					
			$query->bind_param("i", $sensor);
			$query->execute();
			
			$result = $query->get_result();
			
			if (mysqli_num_rows($result) == 0) {
				$resp["code"] = 3;
				
			} else {
				
				$row = $result->fetch_assoc();
				
				$entry = (object) [
					'id' => $row["sensor_id"],
					'time' => $row["time"],
					'raw data' => $row["raw_data"],
					'plot_value' => $row["plot_value"],
					'plot_label' => $row["plot_label"],
					'battery' => $row["battery"],
					'signal' => $row["signal_strength"],
				];
				
				$query = $conn->prepare("SELECT name
									FROM sensor
									WHERE id = ?");
				$query->bind_param("i", $sensor);
				
				if ($query->execute()) {
					$result = $query->get_result();
					
					$row = $result->fetch_assoc();
					
					$label = (object) [
						'label' => $row["name"],
					];
				} else {
					$label = (object) [
						'label' => "Sensor name not found!",
					];
				}
				
				$resp["code"] = 0;
				$resp["sensor"] = $label;
				$resp["data"] = $entry;
			}
			
		} else {
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);

?>