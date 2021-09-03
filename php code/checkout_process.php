<?php

include "main.php";

$method = $_SERVER['REQUEST_METHOD'];

$enableSandbox = true;

$paypalConfig = [
    'email' => 'sb-4q32t5876156@business.example.com',
    'return_url' => 'https://secure.s44.ierg4210.ie.cuhk.edu.hk/',
    'cancel_url' => 'https://secure.s44.ierg4210.ie.cuhk.edu.hk/',
    'notify_url' => 'https://secure.s44.ierg4210.ie.cuhk.edu.hk/admin/checkout_process.php'
];

$paypalUrl = $enableSandbox ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'https://www.paypal.com/cgi-bin/webscr';

header('Access-Control-Allow-Origin: *');

if ($method = "POST" && isset($_POST["upload"])) {
    $upload = $_POST["upload"];
    $pid = [];
    $number = [];
    $data = [];
    $currency = "HKD";

    if (!isset($upload)) {
        echo array("status" => "failed");
    }

    $upload = json_decode($upload);

    foreach ($upload as $key => $value) {
        array_push($pid, htmlspecialchars($key));
        if ($value > 0) {
            $data[$key] = $value;
            array_push($number, htmlspecialchars($value));
        } else {
            $data[$key] = 0;
            array_push($number, 0);
        }
    }

    $db = connect();
    sort($pid);

    $sql = "SELECT price, name FROM products WHERE pid IN (";
    $sql = $sql . implode(",", $pid) . ")";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $price = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $total_price = 0;
    for ($i = 0; $i < count($pid); $i++) {
        $total_price = $total_price + $price[$i]["price"] * $number[$i];
    }

    $cookie = json_decode($_COOKIE["auth"]);
    $email = $cookie->em;
    if (!isset($email)) {
        $email = "guest";
    }

    $salt = rand(1000000, 9999999);

    $custom = hash_hmac("sha256", "($currency) | ($email) | ($salt) | ($pid) | ($price) | ($total_price) | ($number)", $salt);

    $sql = "INSERT INTO orders (custom, username, salt) VALUES (?, ?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->execute([$custom, $email, $salt]);


    $sql = "SELECT MAX(invoice) from orders";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $invoice = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < count($pid); $i++) {
        $sql = "INSERT INTO records (invoice, product_name, quantity) VALUES (?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$invoice[0]['MAX(invoice)'], $price[$i]['name'], $number[$i]]);
    }

    //$invoice[0]["MAX(invoice)"] = (int)$invoice[0]["MAX(invoice)"] + 1;

    if (isset($invoice) && isset($custom)) {
        echo json_encode(array("status" => "successful", "invoice" => $invoice[0]["MAX(invoice)"], "custom" => $custom));
    } else {
        echo json_encode(array("status" => "failed", "message" => "Failed to pay."));
    }
    exit();
}

if (!isset($_POST["txn_id"]) && !isset($_POST["txn_type"])) {
    $upload = $_POST;
    $pid = [];
    $number = [];
    $data = [];
    error_log(print_r($upload));
    if (!isset($upload)) {
        error_log("nothing failed");
    }

    $upload = json_decode($upload);

    foreach ($upload as $key => $value) {
        array_push($pid, htmlspecialchars($key));
        if ($value > 0) {
            $data[$key] = $value;
            array_push($number, htmlspecialchars($value));
        } else {
            $data[$key] = 0;
            array_push($number, 0);
        }
    }

    $db = connect();
    sort($pid);

    $sql = "SELECT price FROM products WHERE pid IN (";
    $sql = $sql . implode(",", $pid) . ")";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $price = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $total_price = 0;
    for ($i = 0; $i < count($pid); $i++) {
        $total_price = $total_price + $price[$i]["price"] * $number[$i];
    }

    $salt = rand(1000000, 9999999);

    $custom = hash_hmac("sha256", "($currency) | ($email) | ($salt) | ($pid) | ($price) | ($total_price) | ($number)", $salt);

    $sql = "SELECT MAX(invoice) from orders";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $invoice = $stmt->fetchAll(PDO::FETCH_ASSOC);
    /*if (isset($invoice) && isset($custom)) {
        echo json_encode(array("status" => "successful", "invoice" => $invoice, "custom" => $custom));
    } else {
        echo json_encode(array("status" => "failed", "message" => "Failed to pay."));
    }*/
    
    $data['business'] = $paypalConfig['email'];
    $data['return'] = stripslashes($paypalConfig['return_url']);
    $data['cancel_return'] = stripslashes($paypalConfig['cancel_url']);
    $data['notify_url'] = stripslashes($paypalConfig['notify_url']);
    $data['item_name'] = $itemName;
    $data['item_id'] = $pid;
    $data['item_price'] = $price;
    $data['total_price'] = $total_price;
    $data['amount'] = $number;
    $data['currency_code'] = "HKD";
    //$data["invoice"] = $invoice[0]["MAX(invoice)"];

    $queryString = http_build_query($data);

    //error_log(print_r($data,true));

    header('location:' . $paypalUrl . '?' . $queryString);
    exit();
} else {
    $data = [
        'item_name_1' => $_POST['item_name_1'],
        'quantity_1' => $_POST['quantity_1'],
        'item_name_2' => $_POST['item_name_2'],
        'quantity_2' => $_POST['quantity_2'],
        'payment_status' => $_POST['payment_status'],
        'payment_amount' => $_POST['mc_gross'],
        'payment_currency' => $_POST['mc_currency'],
        'txn_id' => $_POST['txn_id'],
        'receiver_email' => $_POST['receiver_email'],
        'custom' => $_POST['custom'],
        'invoice' => $_POST["invoice"],
        'txn_type' => $_POST["txn_type"],
        'item_price' => $_POST["item_price"],
        'total_price' => $_POST["total_price"],
        'amount' => $_POST["amount"]
    ];

    /*$sql = "INSERT INTO orders (txnid) VALUES (?) WHERE invoice = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$data['txn_id'], $data['invoice']]);
    
    if (verifyTransaction($_POST)) {
        error_log("verify");
    }

    error_log("verify" + print_r(verifyTransaction($_POST), true));

    if (checkTxnid($data['txn_id'])) {
        error_log("id check");
    }
    */
    error_log(print_r($data, true));

    if (verifyTransaction($_POST) && checkTxnid($data['txn_id']) && checkTxnid($data['txn_type'])) {
        if (addPayment($data) !== false) {
            die();
            //header("HTTP/1.1 200 OK");
            //header('location:' . $paypalConfig["return_url"]);
        } else {
            $sql = "UPDATE orders SET payment_status = 'failed' , createdtime = ? WHERE invoice = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([date('Y-m-d H:i:s'), $data['invoice']]);
        }
    } else {
        $sql = "UPDATE orders SET payment_status = 'failed' , createdtime = ? WHERE invoice = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([date('Y-m-d H:i:s'), $data['invoice']]);
    }
}

function verifyTransaction($data)
{
    $paypalUrl = "https://www.sandbox.paypal.com/cgi-bin/webscr";

    $req = 'cmd=_notify-validate';
    foreach ($data as $key => $value) {
        $value = urlencode(stripslashes($value));
        $value = preg_replace('/(.*[^%^0^D])(%0A)(.*)/i', '${1}%0D%0A${3}', $value); // IPN fix
        $req .= "&$key=$value";
    }

    $ch = curl_init($paypalUrl);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
    curl_setopt($ch, CURLOPT_SSLVERSION, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));
    $res = curl_exec($ch);

    if (!$res) {
        $errno = curl_errno($ch);
        $errstr = curl_error($ch);
        curl_close($ch);
        throw new Exception("cURL error: [$errno] $errstr");
    }

    $info = curl_getinfo($ch);

    // Check the http response
    $httpCode = $info['http_code'];
    if ($httpCode != 200) {
        throw new Exception("PayPal responded with http code $httpCode");
    }

    curl_close($ch);

    return $res === 'VERIFIED';
}

function checkTxnid($txnid)
{
    $db = connect();

    $sql = "SELECT * from orders WHERE txnid = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$txnid]);
    error_log($txnid);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    /*
    $txnid = $db->real_escape_string($txnid);
    $results = $db->query('SELECT * FROM orders WHERE txnid = \'' . $txnid . '\'');
    */
    return $result ? false : true;
    //return !$result->num_rows;
}

function checkTxntype($txntype) {
    $txntype !== "cart" ? false : true;
}

function addPayment($data)
{
    $db = connect();
    error_log("start");

    /*$c = $data['payment_currency'];
    $email = $data["receiver_email"];

    $sql = "SELECT salt FROM orders WHERE invoice = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$data["invoice"]]);
    $salt = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $salt = $salt[0]["salt"];

    $pid = $data["item_id"];
    $price = $data["item_price"];
    $total_price = $data["total_price"];
    $number = $data["amount"];

    $new_custom = hash_hmac("sha256", "($c) | ($email) | ($salt) | ($pid) | ($price) | ($total_price) | ($number)", $salt);

    $sql = "SELECT custom FROM orders WHERE invoice = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$data["invoice"]]);
    $old_custom = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $old_custom = $old_custom[0]["custom"];

    error_log($new_custom);
    if ($new_custom == $old_custom) {
        if ($data) {
            $sql = "UPDATE orders SET txnid = ?, payment_status = ?, payment_amount = ?, createdtime = ? WHERE invoice = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$data['txn_id'], $data['payment_status'], $data["payment_amount"], date('Y-m-d H:i:s'), $data['invoice']]);
            if (!$stmt) {
                error_log(print_r($db->errorInfo()));
            }
            $stmt->execute();
            error_log("ok");
            return $db->insert_id;
        }
    }
    */
    if ($data) {
        $sql = "UPDATE orders SET txnid = ?, payment_status = ?, payment_amount = ?, createdtime = ? WHERE invoice = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$data['txn_id'], $data['payment_status'], $data["payment_amount"], date('Y-m-d H:i:s'), $data['invoice']]);
        if (!$stmt) {
            error_log(print_r($db->errorInfo()));
        }
        $stmt->execute();
        error_log("ok");
        return $db->insert_id;
    }
    return false;
}
/*
if (!isset($_POST["txn_id"]) && !isset($_POST["txn_type"])) {
    $currency = "HKD";
    $email = "sb-4q32t5876156@business.example.com";
    $data = $_POST["upload"];
    $pid = [];
    $number = [];

    if (!isset($data)) {
        echo array("status" => "failed");
    }

    $data = json_decode($data);
    foreach ($data as $key => $value) {
        array_push($pid, htmlspecialchars($key));
        if ($value > 0) {
            array_push($number, htmlspecialchars($value));
        } else {
            array_push($number, 0);
        }
    }

    $db = connect();

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    sort($pid);

    $sql = "SELECT price FROM products WHERE pid IN (";
    $sql = $sql . implode(",", $pid) . ")";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $price = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //print_r($price);

    if (!$price) {
        echo json_encode(array("status" => "failed", "message" => "Failed to get price"));
        die();
    }

    $total_price = 0;
    for ($i = 0; $i < count($pid); $i++) {
        $total_price = $total_price + $price[$i]["price"] * $number[$i];
    }
    //echo $total_price;

    $salt = rand(1000000, 9999999);
    // $invoice = sha256("($currency) | ($email) | ($salt) | ($pid) | ($price) | ($total_price)");

    $custom = hash_hmac("sha256", "($currency) | ($email) | ($salt) | ($pid) | ($price) | ($total_price) | ($number)", $salt);

    $cookie = json_decode($_COOKIE["auth"]);
    $email = $cookie->em;

    if (!isset($email)) {
        $email = "guest";
    }

    $sql = "INSERT INTO orders (username, custom) VALUES (?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email, $custom]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!isset($result)) {
        echo json_encode(array("status" => "failed", "message" => "Failed to add."));
        die();
    }

    $sql = "SELECT LAST_INSERT_ID()";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $invoice = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (isset($invoice) && isset($custom)) {
        echo json_encode(array("status" => "successful", "invoice" => $invoice, "custom" => $custom));
    } else {
        echo json_encode(array("status" => "failed", "message" => "Failed to pay."));
    }

} else {
    $db = connect();
    error_log(print_r($_POST,true));
    $data = [
        'item_name' => $_POST['item_name'],
        'item_number' => $_POST['item_number'],
        'payment_status' => $_POST['payment_status'],
        'payment_amount' => $_POST['mc_gross'],
        'payment_currency' => $_POST['mc_currency'],
        'txn_id' => $_POST['txn_id'],
        'receiver_email' => $_POST['receiver_email'],
        'payer_email' => $_POST['payer_email'],
        'custom' => $_POST['custom'],
    ];
    foreach ($data as $d) {
        echo $d;
    }
    if (verifyTransaction($_POST) && checkTxnid($data['txn_id'])) {
        if (addPayment($data) !== false) {
            // Payment successfully added.
        }
    }
}

function verifyTransaction($data) {
    $paypalUrl = "https://www.sandbox.paypal.com/cgi-bin/webscr";

    $req = 'cmd=_notify-validate';
    foreach ($data as $key => $value) {
        $value = urlencode(stripslashes($value));
        $value = preg_replace('/(.*[^%^0^D])(%0A)(.*)/i', '${1}%0D%0A${3}', $value); // IPN fix
        $req .= "&$key=$value";
    }

    $ch = curl_init($paypalUrl);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
    curl_setopt($ch, CURLOPT_SSLVERSION, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));
    $res = curl_exec($ch);

    if (!$res) {
        $errno = curl_errno($ch);
        $errstr = curl_error($ch);
        curl_close($ch);
        throw new Exception("cURL error: [$errno] $errstr");
    }

    $info = curl_getinfo($ch);

    // Check the http response
    $httpCode = $info['http_code'];
    if ($httpCode != 200) {
        throw new Exception("PayPal responded with http code $httpCode");
    }

    curl_close($ch);

    return $res === 'VERIFIED';
}

function checkTxnid($txnid) {
    $db = connect();

    $txnid = $db->real_escape_string($txnid);
    $results = $db->query('SELECT * FROM orders WHERE txnid = \'' . $txnid . '\'');

    /*$sql = "SELECT * FROM `payments` WHERE txnid = \''?\'";
    $stmt = $db->prepare($sql);
    $stmt->execute([$txnid]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    return ! $results->num_rows;
}

function addPayment($data) {
    $db = connect();$db = connect();

    if (is_array($data)) {
        $stmt = $db->prepare('INSERT INTO (txnid, payment_amount, payment_status, itemid, createdtime) VALUES(?, ?, ?, ?, ?)');
        $stmt->bind_param(
            'sdsss',
            $data['txn_id'],
            $data['payment_amount'],
            $data['payment_status'],
            $data['item_number'],
            date('Y-m-d H:i:s')
        );
        $stmt->execute();
        $stmt->close();

        return $db->insert_id;
    }

    return false;
}
*/