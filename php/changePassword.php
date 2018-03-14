<?php
	
	session_start();

	try {
		
		include("db.inc");

		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		$old = $request->old;
		$newPw = $request->newPw;
		
		$resp = [];

		if ($old != "" && strlen($newPw) > 4) {
			$query = $conn->prepare("SELECT password 
									FROM user
									WHERE id = ?");
			$query->bind_param("i", $_SESSION["user"]["id"]);
			
			if ($query->execute()) {
				
				$result = $query->get_result();
				$row = $result->fetch_assoc();
				
				$pwfromdb = $row["password"];
				
				if (password_verify($old, $pwfromdb)) {
					
					$pwHash = password_hash($newPw, PASSWORD_BCRYPT);
					
					$query = $conn->prepare("UPDATE user
											SET password = ?
											WHERE id = ?");
					$query->bind_param("si", $pwHash, $_SESSION["user"]["id"]);
					
					if ($query->execute()) {
						$resp["code"] = 0;
					} else {
						$resp["code"] = -2;
					}
					
				} else {
					$resp["code"] = 4;
				}
				
			} else {
				$resp["code"] = -2;
			}
		} else {
			$resp["code"] = 5;
		}
		
	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}

	echo json_encode($resp);

?>
