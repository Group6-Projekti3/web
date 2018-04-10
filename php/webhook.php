<?php

	try {
		
		include("db.inc");
		
		$postdata = file_get_contents("php://input");
		
		$query = $conn->prepare("INSERT INTO webhook (time, message)
										VALUES (now(), ?)");
		$query->bind_param("s", $postdata);
		$query->execute();
		
		$content = json_decode($postdata);
		
		$messages = $content->sensorMessages;
		
		if (!is_null($messages)) {
			
			foreach ($messages as $message) {
						
				$query = $conn->prepare("SELECT name FROM sensor WHERE id = ?;");
				$query->bind_param("i", $message->sensorID);
				$query->execute();
				$result2 = $query->get_result();
				
				if ($result2->num_rows == 0) {
					$query = $conn->prepare("INSERT INTO sensor (id, name) VALUES (?, ?)");
					$query->bind_param("is", $message->sensorID, $message->sensorName);
					$query->execute();
					echo "Sensor inserted";
				}
				
				$query = $conn->prepare("INSERT IGNORE INTO sensor_data VALUES (?, ?, ?, ?, ?, ?, ?);");
				$query->bind_param("isddsii", $message->sensorID, $message->messageDate, $message->rawData, $message->plotValues, $message->plotLabels, $message->batteryLevel, $message->signalStrength);
				$query->execute();
				
				echo "Message received!\n";
			}
		}
		
	} catch (Exception $e) {
		echo -1;
	}
	
?>