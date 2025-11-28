<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$path = __DIR__ . "/variables.json";

if(file_exists($path)){
    echo file_get_contents($path);
} else {
    echo json_encode(["error" => "No se encontró variables.json"]);
}
