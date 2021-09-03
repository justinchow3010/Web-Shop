<?php

include "main.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "POST") {
    $email = htmlspecialchars($_POST["email"]);
    $password = htmlspecialchars($_POST["password"]);

    if (empty($email) || empty($password)) {
        echo json_encode(array("status" => "failed", "message" => "Please enter your email or password"));
        die();
    }

    if (!preg_match("/^[\w\-\/][\w\'\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$/", $email)) {
        echo json_encode(array("status" => "failed", "message" => "The format of your email is not correct."));
        die();
    }

    if (!preg_match("/^[\w@#$%\^\&\*\-]+$/", $password)) {
        echo json_encode(array("status" => "failed", "message" => "The format of your password is not correct."));
        die();
    }

    $db = connect();

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT password, salt, flag FROM user WHERE email = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode(array("status" => "failed", "message" => "Your email does not exist."));
        die();
    }

    $salt = 0;
    $check = 0;
    $flag = 0;

    foreach ($result as $a) {
        $salt = $a["salt"];
        $check = $a['password'];
        $flag = $a['flag'];
    }

    $hash = hash_hmac("sha256", $password, $salt);
    if ($hash === $check) {
        //session_start();
        $exp = time() + 3600 * 24 * 3;
        $token = array(
            "em" => $email,
            "exp" => $exp,
            "k" => hash_hmac("sha256", $password, $salt),
            "f" => hash_hmac("sha256", $flag, $salt)
        );
        setcookie('auth', json_encode($token), $exp, "", "", true, true);
        //$_SESSION['auth'] = $token;
        echo json_encode(array("status" => "successful", "flag" => $flag));
    } else {
        echo json_encode(array("status" => "failed", "message" => "Your password is incorrect."));
    }
} else if ($method == "GET") {
    if (isset($_GET["userName"])) {

        $db = connect();

        if (!$db) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $cookie = json_decode($_COOKIE["auth"]);
        $email = $cookie->em;
        $key = $cookie->k;

        $sql = "SELECT salt FROM user WHERE email = ? AND password = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$email, $key]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $salt = 0;

        foreach ($result as $a) {
            $salt = $a["salt"];
        }

        $flag = 0;
        //echo hash_hmac("sha256", 1, $salt); 
        if (hash_hmac("sha256", 0, $salt) == $cookie->f) {
            $flag = "0";
        } else if (hash_hmac("sha256", 1, $salt) == $cookie->f) {
            $flag = "1";
        }

        echo json_encode(array($email, $flag));
        //echo $cookie->f;
    } else if (!isset($_COOKIE["auth"])) {
        echo json_encode(array("notLoggedIn", -1));
    } else if (isset($_GET["logout"])) {
        if (setcookie("auth", "", time() - 3600)) {
            echo "successful";
        } else {
            echo "failed";
        }
    } else {
        $cookie = json_decode($_COOKIE["auth"]);
        $email = $cookie->em;
        $key = $cookie->k;

        $db = connect();

        if (!$db) {
            die("Connection failed: " . mysqli_connect_error());
        }
        $sql = "SELECT salt FROM user WHERE email = ? AND password = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$email, $key]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $salt = 0;

        foreach ($result as $a) {
            $salt = $a["salt"];
        }

        $flag = "0";
        //echo hash_hmac("sha256", 1, $salt); 
        if (hash_hmac("sha256", 0, $salt) == $cookie->f) {
            $flag = "0";
        } else if (hash_hmac("sha256", 1, $salt) == $cookie->f) {
            $flag = "1";
        }

        echo json_encode(array("auth", $flag));
    }
}
