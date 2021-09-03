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
		//$name = $_GET["name"];
		$data = htmlspecialchars($_GET["pid"]);
		$category = htmlspecialchars($_GET["catName"]);
		$cart_list = $_GET["rawCartList"];
		$cart_list = json_decode($cart_list);
		//echo $category;

		if ($data > 0) {
			$sql = "SELECT * FROM products WHERE pid = ?"; //$data
			$stmt = $db->prepare($sql);
			$stmt->execute([$data]);
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (!$result) {
				print_r($stmt->errorInfo());
			}
			break;
		} else if (count($cart_list) > 0) {
			$sql = "SELECT name, price, pid FROM products WHERE pid in (";
			$arr = [];
			$arr2 = [];
			$count = 1;
			foreach ($cart_list as $item) {
				array_push($arr, $item->pid);
			}

			$sql = $sql . implode(",", $arr) . ") ORDER BY CASE pid";

			foreach ($cart_list as $item) {
				$statement = "when " . $item->pid . " then " . $count;
				$count++;
				array_push($arr2, $statement);
			}
			$sql = $sql . " " . implode(" ", $arr2) . " else 10 end;";

			//$sql = "SELECT name, price, pid FROM products WHERE pid in (?) ORDER BY CASE pid ? else 10 end";
			$stmt = $db->prepare($sql);
			$stmt->execute();
			//$stmt->execute([implode(",", $arr), implode(" ", $arr2)]);
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (!$result) {
				print_r($stmt->errorInfo());
			}
			break;
		} else {
			if ($category != NULL) {
				$sql = "SELECT products.name, products.price, products.description, products.pid, products.catid, products.image FROM products, categories WHERE categories.name = ? AND products.catid = categories.catid"; //category
				$stmt = $db->prepare($sql);
				$stmt->execute([$category]);
				$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				if (!$result) {
					print_r($stmt->errorInfo());
				}
				break;
			} else {
				$sql = "SELECT * FROM products";
				$stmt = $db->prepare($sql);
				$stmt->execute();
				$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				if (!$result) {
					print_r($stmt->errorInfo());
				}
				break;
			}
		}

	case 'POST':
		$name = htmlspecialchars($_POST["name"]);
		$description = htmlspecialchars($_POST["description"]);
		$category = htmlspecialchars($_POST["category"]);
		$action = htmlspecialchars($_POST["action"]);

		if ($action == "addProduct") {
			if (empty($category)) {
				echo json_encode(array("status" => "failed", "message" => "Please select the category name."));
				die();
			}

			if (empty($name) || $to_change == "default") {
				echo json_encode(array("status" => "failed", "message" => "Please enter the product name."));
				die();
			}

			if (!preg_match("/^[\w@#$%\^\&\*\- ]+$/", $name)) {
				echo json_encode(array("status" => "failed", "message" => "The format of the product name is not correct."));
				die();
			}

			$price = htmlspecialchars($_POST["price"]);

			if (empty($price)) {
				echo json_encode(array("status" => "failed", "message" => "Please enter the price."));
				die();
			}

			//if (!preg_match("/^([1-9][0-9]*|0)(\.[0-9]{2})?$/", $price)) {
			if (!preg_match("/^([0-9]+(\.{1})?([0-9]{0,2}))$/", $price)) {
				echo json_encode(array("status" => "failed", "message" => "The format of the price is not correct. Only numbers are allowed"));
				die();
			}

			$type = $_FILES['image']['type'];
			$data = file_get_contents($_FILES['image']['tmp_name']);

			if (empty($data)) {
				echo json_encode(array("status" => "failed", "message" => "Please insert an image."));
				die();
			}

			if ($type != "image/jpg" && $type != "image/png" && $type != "image/gif" && $type != "image/jpeg") {
				echo json_encode(array("status" => "failed", "message" => "Sorry, only JPG, PNG & GIF files are allowed."));
				die();
			}
			if ($_FILES['image']['size'] > 10000000) {
				echo json_encode(array("status" => "failed", "message" => "The file is too large!"));
				die();
			}

			$sql = "insert into products (catid, name, price, description, image) values (?, ?, ?, ?, ?)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(1, $category);
			$stmt->bindParam(2, $name);
			$stmt->bindParam(3, $price);
			$stmt->bindParam(4, $description);
			$stmt->bindParam(5, $data);
			$stmt->execute();
			break;
		} else  if ($action == "updateProduct") {
			$to_change = htmlspecialchars($_POST["toChange"]);
			if (empty($to_change) || $to_change == "default") {
				echo json_encode(array("status" => "failed", "message" => "Please select the product to be changed."));
				die();
			}

			if (empty($name)) {
				echo json_encode(array("status" => "failed", "message" => "Please enter the product name."));
				die();
			}

			if (!preg_match("/^[\w@#$%\^\&\*\-]+$/", $name)) {
				echo json_encode(array("status" => "failed", "message" => "The format of the product name is not correct."));
				die();
			}

			$price = htmlspecialchars($_POST["price"]);
			if (empty($price)) {
				echo json_encode(array("status" => "failed", "message" => "Please enter the price."));
				die();
			}

			if (!preg_match("/^([1-9][0-9]*|0)(\.[0-9]{2})?$/", $price)) {
				echo json_encode(array("status" => "failed", "message" => "The format of the price is not correct. Only numbers are allowed"));
				die();
			}

			$type = $_FILES['image']['type'];
			$data = file_get_contents($_FILES['image']['tmp_name']);

			if (empty($data)) {
				echo json_encode(array("status" => "failed", "message" => "Please insert an image."));
				die();
			}

			if ($type != "image/jpg" && $type != "image/png" && $type != "image/gif" && $type != "image/jpeg") {
				echo json_encode(array("status" => "failed", "message" => "Sorry, only JPG, PNG & GIF files are allowed."));
				die();
			}
			if ($_FILES['image']['size'] > 10000000) {
				echo json_encode(array("status" => "failed", "message" => "The file is too large!"));
				die();
			}

			$sql = "UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE pid = ?";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(1, $name);
			$stmt->bindParam(2, $price);
			$stmt->bindParam(3, $description);
			$stmt->bindParam(4, $data);
			$stmt->bindParam(5, $to_change);
			$stmt->execute();
			break;
		} else if ($action == "deleteProduct") {
			$pid = htmlspecialchars($_POST["pid"]);
			if (empty($pid) || $to_change == "default") {
				echo json_encode(array("status" => "failed", "message" => "Please select the product to be deleted."));
				die();
			}
			$sql = "DELETE FROM products WHERE pid = '$pid'";
			$stmt = $db->prepare($sql);
			$stmt->execute([$pid]);
			break;
		}
}

if ($method == 'GET' && !$result) {
	http_response_code(404);
	//die();
	die(mysqli_error($db)); //development
}

if ($method == 'GET') {
	for ($i = 0; $i < count($result); $i++) {
		$result[$i]['image'] = base64_encode($result[$i]['image']);
	}
	$json = json_encode($result);
	echo $json;
} elseif ($method == 'POST') {
	echo json_encode(array("status" => "successful", "message" => "You submission is accepted"));
} else {
	echo mysqli_affected_rows($con);
}
//$con->close();
