<?php

include "main.php";

$method = $_SERVER['REQUEST_METHOD'];


if ($method == "GET" && isset($_GET["username"])) {
    $username = htmlspecialchars($_GET["username"]);

    $db = connect();

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT invoice FROM orders WHERE username = ? ORDER BY invoice DESC LIMIT 5";
    $stmt = $db->prepare($sql);
    $stmt->execute([$username]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode(array("status" => "failed"));
        die();
    } else {
        echo json_encode(array("status" => "successful", "invoice" => $result));
    }
} else if ($method == "GET" && isset($_GET["id"])) {
    $invoice = htmlspecialchars($_GET["id"]);

    $db = connect();

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT product_name, quantity FROM records WHERE invoice = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$invoice]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //print_r($result);

    $tmp = [];
    $name = [];

    foreach ($result as $r) {
        array_push($name, $r["product_name"]);
        array_push($tmp, $r);
    }

    for ($x = 0; $x < count($name); $x++) {
        $name[$x] = '"' . $name[$x] . '"';
    }

    $sql = "SELECT price FROM products WHERE name IN (";
    $sql = $sql . implode(",", $name) . ")";
    $stmt = $db->prepare($sql);
    $stmt->execute([]);
    $price = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT payment_status FROM orders WHERE invoice = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$invoice]);
    $payment_status = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($x = 0; $x < count($name); $x++) {
        $tmp[$x]["price"] =  $price[$x]["price"];
        $tmp[$x]["payment_status"] =  $payment_status[0]["payment_status"];
    }

    if (!$result) {
        echo json_encode(array("status" => "failed"));
        die();
    } else {
        echo json_encode(array("status" => "successful", "message" => $tmp));
    }
} else {
    $db = connect();

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM orders ORDER BY invoice DESC LIMIT 5";
    $stmt = $db->prepare($sql);
    $stmt->execute([]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode(array("status" => "failed"));
        die();
    } else {
        echo json_encode(array("status" => "successful", "message" => $result));
    }
}
