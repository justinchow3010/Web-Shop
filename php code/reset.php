<?php

include "main.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "POST") {
    $email = htmlspecialchars($_POST["email"]);
    $old_password = htmlspecialchars($_POST["oldPassword"]);
    $new_password = htmlspecialchars($_POST["newPassword"]);

    if (empty($email) || empty($old_password) || empty($new_password)) {
        echo json_encode(array("status" => "failed", "message" => "Please enter your email or password"));
        die();
    }

    if (!preg_match("/^[\w\-\/][\w\'\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$/", $email)) {
        echo json_encode(array("status" => "failed", "message" => "The format of your email is not correct."));
        die();
    }

    if (!preg_match("/^[\w@#$%\^\&\*\-]+$/", $old_password)) {
        echo json_encode(array("status" => "failed", "message" => "The format of your old password is not correct."));
        die();
    }

    if (!preg_match("/^[\w@#$%\^\&\*\-]+$/", $new_password)) {
        echo json_encode(array("status" => "failed", "message" => "The format of your new password is not correct."));
        die();
    }

    if ($old_password == $new_password) {
        echo json_encode(array("status" => "failed", "message" => "The new password cannot be the same as the old password."));
        die();
    }

    $db = connect();

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT password, salt FROM user WHERE email = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $salt = 0;
    $check = 0;

    if (!$result) {
        echo json_encode(array("status" => "failed", "message" => "Your email does not exist."));
        die();
    }

    foreach ($result as $a) {
        $salt = $a["salt"];
        $check = $a['password'];
    }

    $hash = hash_hmac("sha256", $old_password, $salt);

    if ($hash === $check) {
        //session_start();
        $to_be_uploaded = hash_hmac("sha256", $new_password, $salt);
        $sql = "UPDATE user SET password = ? WHERE email = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$to_be_uploaded, $email]);
        //$_SESSION['login'] = $token;
        echo json_encode(array("status" => "successful", "message" => "Your password is reset."));
    } else {
        echo json_encode(array("status" => "failed", "message" => "Your old password is not correct."));
    }
}
