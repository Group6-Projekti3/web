<?php
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			if ($_SESSION["user"]["type"] == 0) {
				
				$postdata = file_get_contents("php://input");
				$request = json_decode($postdata);
				
				$username = $request->username;
				$type = $request->type;
				$password = $request->password;
				
				$pwHash = password_hash($password, PASSWORD_BCRYPT);
				
				$query = $conn->prepare("INSERT INTO user (username, password, type)
										VALUES (?, ?, ?)");
										
				$query->bind_param("ssi", $username, $pwHash, $type);
				
				if ($query->execute()) {
					// Success
					$resp["code"] = 0;
					
				} else {
					// Error
					$resp["code"] = -1;
				}
			} else {
				$resp["code"] = 2;
			}
		} else {
			// Not logged in
			$resp["code"] = 1;
		}
	} catch (Exception $e){
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>