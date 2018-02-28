<?php
	
	session_start();
	session_unset();

	try {
		
		include("db.inc");

		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		$username = $request->username;
		$pw = $request->password;
		
		$resp = [];

		if ($username != "" && $pw != "") {
			$query = $conn->prepare("SELECT * 
									FROM user
									WHERE username = BINARY ?");
			$query->bind_param("s", $username);
			
			if ($query->execute()) {
				
				$result = $query->get_result();
				$row = $result->fetch_assoc();
				
				$id = $row["id"];
				$pwfromdb = $row["password"];
				$type = $row["type"];
				
				if (password_verify($pw, $pwfromdb)) {
					
					$_SESSION["user"] = [
						"id" => $id,
						"username" => $username,
						"type" => $type
					];
					
					$resp["code"] = 0;
					$resp["username"] = $username;
					$resp["type"] = $type;
					
				} else {
					$resp["code"] = 1;
				}
				
			} else {
				$resp["code"] = -2;
			}
		}
		
	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}

	echo json_encode($resp);

?>
