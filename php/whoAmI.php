<?php
	session_start();
	
	$resp = [];
	
	try {
		if (isset($_SESSION["user"])) {
			
			$resp["code"] = 0;
			$resp["user"] = (object) [
				'name' => $_SESSION["user"]["username"],
				'type' => $_SESSION["user"]["type"]
			];
			
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