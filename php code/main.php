<?php

function connect() {
    $host = "localhost";
    $user = "root";
    $password = "ak47-m16";
    $dbname = "backend";
    $dsn = 'mysql:host=' . $host . ';dbname=' . $dbname;
    $pdo = new PDO($dsn, $user, $password);
    
    return $pdo;
}
