<?php
	/*
	session_start();
	session_unset();

	try {
		
		include("db.inc");

		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		$kt = $request->kt;
		$pw = $request->salasana;

		$success = false;

		if ($kt != "" && $pw != "") {
			$query = $conn->prepare("SELECT * 
									FROM admin
									WHERE username=?");
			$query->bind_param("s", $kt);
			$query->execute();
			
			$result = $query->get_result();
			
			if (mysqli_num_rows($result) != 1) {
				echo "Väärä määrä rivejä!";
			} else {
				$row = $result->fetch_assoc();
				
				$id = $row["id"];
				$domain = $row["domain_id"];
				$pwfromdb = $row["password"];
				
				if ($pwfromdb == $pw) {
					
					$_SESSION["user"] = [
						"id" => $id,
						"username" => $kt,
						"domain" => $domain
					];
					
					$success = true;
				}
			}
		}

		$resp = [];

		if ($success) {

			$resp["code"] = 0;
			$resp["domain"] = $domain;
			$resp["username"] = $kt;
			
		} else {
			
			$resp["code"] = 1;
			
		}

	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}

	echo json_encode($resp);
	*/
	$resp = [];
	$resp["code"] = 0;
	echo json_encode($resp);
?>
