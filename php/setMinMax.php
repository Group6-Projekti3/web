<?php
	
	session_start();

	try {
		
		include("db.inc");

		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		$sensor = $request->sensor;
		$min = $request->newMin;
		$max = $request->newMax;
		
		$resp = [];

		if (isset($_SESSION["user"])) {
			if ($_SESSION["user"]["type"] < 2) {
				$query = $conn->prepare("UPDATE sensor
										SET min = ?, max = ?
										WHERE id = ?");
				$query->bind_param("iii", $min, $max, $sensor);
				
				if ($query->execute()) {
					$resp["code"] = 0;
				} else {
					$resp["code"] = -2;
				}
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
