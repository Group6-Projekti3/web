<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$query = $conn->prepare("SELECT *
					FROM sensor;");

			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {
				$id = $row["id"];
				$name = $row["name"];
				$min = $row["min"];
				$max = $row["max"];

				$a = array (
					"id" => $id,
					"name" => $name,
					"min" => $min,
					"max" => $max
				);
				
				array_push($arr, $a);
			}
			
			$resp["code"] = 0;
			$resp["sensors"] = $arr;
			
		} else {
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);

?>