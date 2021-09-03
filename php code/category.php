<?php
include 'main.php';

//$con = mysqli_connect($host, $user, $password, $dbname);
$db = connect();

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

if (!$db) {
	die("Connection failed: " . mysqli_connect_error());
}

switch ($method) {
	case 'GET':
		$name = htmlspecialchars($_GET["name"]);
		$sql = "SELECT name, catid FROM categories";
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (!$result) {
			print_r($stmt->errorInfo());
		}
		break;
	case 'POST':
		$action = htmlspecialchars($_POST["action"]);

		if ($action == "addCat") {
			$name = htmlspecialchars($_POST["name"]);
			if (empty($name)) {
				echo json_encode(array("status" => "failed", "message" => "Please enter the category name"));
				die();
			}

			if (!preg_match("/^[\w@#$%\^\&\*\-]+$/", $name)) {
				echo json_encode(array("status" => "failed", "message" => "The format of the category name is not correct."));
				die();
			}

			$sql = "insert into categories (name) values (?)"; //name
			$stmt = $db->prepare($sql);
			$stmt->execute([$name]);
			break;
		} else if ($action == "updateCat") {
			$name = htmlspecialchars($_POST["name"]);
			if (empty($name)) {
				echo json_encode(array("status" => "failed", "message" => "Please enter the category name"));
				die();
			}
			
			if (!preg_match("/^[\w@#$%\^\&\*\-]+$/", $name)) {
				echo json_encode(array("status" => "failed", "message" => "The format of the category name is not correct."));
				die();
			}
			
			$to_change = htmlspecialchars($_POST["toChange"]);
			if (empty($to_change) || $to_change == "default") {
				echo json_encode(array("status" => "failed", "message" => "Please select the category to be changed"));
				die();
			}

			/*if ($name == $to_change) {
				echo json_encode(array("status" => "failed", "message" => "The old category name cannot be the same as the new one."));
				die();
			}*/

			$sql = "UPDATE categories SET name = ? WHERE catid = ?";
			$stmt = $db->prepare($sql);
			$stmt->execute([$name, $to_change]);
			break;
		} else if ($action == "deleteCat") {
			$catid = htmlspecialchars($_POST["category"]);
			if (empty($catid) || $catid == "default") {
				echo json_encode(array("status" => "failed", "message" => "Please select the category to be deleted"));
				die();
			}

			$sql = "DELETE FROM products WHERE catid = ?";
			$stmt = $db->prepare($sql);
			$stmt->execute([$catid]);

			$sql = "DELETE FROM categories WHERE catid = ?";
			$stmt = $db->prepare($sql);
			$result = $stmt->execute([$catid]);

			if (!$result) {
				echo json_encode(array("status" => "failed", "message" => "Please refresh and try again."));
			}
			break;
		}
}

// run SQL statement
//$result = mysqli_query($con, $sql);
// die if SQL statement failed
if ($method == 'GET' && !$result) {
	http_response_code(404);
	die();
	//die(mysqli_error($con));
}

if ($method == 'GET') {
	$json = json_encode($result);
	echo $json;

} elseif ($method == 'POST') {
	echo json_encode(array("status" => "successful", "message" => "You submission is accepted"));
} else {
	echo mysqli_affected_rows($con);
}

