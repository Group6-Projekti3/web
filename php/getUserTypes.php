<?php
	session_start();
	
	$resp = [];
	
	try {
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$query = $conn->prepare("SELECT *
					FROM user_type;");

			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {
				$id = $row["id"];
				$name = $row["name"];

				$a = array (
					"id" => $id,
					"name" => $name,
				);
				
				array_push($arr, $a);
			}
			
			$resp["code"] = 0;
			$resp["types"] = $arr;
			
		} else {
			$resp["code"] = 1;
			
		}
	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>