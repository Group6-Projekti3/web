<?php
	session_start();
	
	$resp = [];
	
	try {
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			if ($_SESSION["user"]["type"] == 0) {
				$query = $conn->prepare("SELECT *
						FROM user
						WHERE NOT id=? ;");
				$query->bind_param("i", $_SESSION["user"]["id"]);
				$query->execute();
				
				$result = $query->get_result();
				
				$arr = [];
				
				while ($row = $result->fetch_assoc()) {
					$id = $row["id"];
					$name = $row["username"];
					$type = $row["type"];

					$a = array (
						"id" => $id,
						"name" => $name,
						"type" => $type
					);
					
					array_push($arr, $a);
				}
				
				$resp["code"] = 0;
				$resp["users"] = $arr;
			} else {
				$resp["code"] = 2;
			}
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