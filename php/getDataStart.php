<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		
		$sensor = $request->sensor;
		
		if (isset($_SESSION["user"])) {
			
			$query = $conn->prepare("SELECT time FROM sensor_data
									WHERE sensor_id = ?
									ORDER BY time
									LIMIT 1;");
			$query->bind_param("i", $sensor);
			
			$query->execute();
			
			$result = $query->get_result();
			
			if (mysqli_num_rows($result) == 1) {
				
				$row = $result->fetch_assoc();
				
				$date = strtotime($row["time"]);
				
				$week = date('W', $date );
				$month = date('n', $date );
				$year = date('Y', $date );
				
				$resp["code"] = 0;
				
				$resp["start"] = (object) [
					'week' => $week,
					'month' => $month,
					'year' => $year
				];
				
			} else {
				$resp["code"] = -2;
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