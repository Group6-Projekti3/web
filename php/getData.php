<?php
	session_start();
	
	try {
		
		include("db.inc");
		
		if (isset($_SESSION["user"])) {
			
			$resp = [];
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			$sensor = $request->sensor;
			$start = $request->starttime;
			$end = $request->endtime;
			
			$query = $conn->prepare("SELECT *
									FROM sensor_data
									WHERE sensor_id = ? AND time BETWEEN FROM_UNIXTIME(?) AND FROM_UNIXTIME(?)");
					
			$query->bind_param("iss", $sensor, $start, $end);
			$query->execute();
			
			$result = $query->get_result();
			
			if (mysqli_num_rows($result) == 0) {
				$resp["code"] = 3;
				
			} else {
				
				$data = [];
				
				while ($row = $result->fetch_assoc()) {
					$entry = (object) [
						'x' => $row["time"],
						'y' => $row["plot_value"],
					];
					
					array_push($data, $entry);
				}
				
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
				$resp["label"] = $label;
				$resp["data"] = $data;
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