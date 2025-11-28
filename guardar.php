<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$input = file_get_contents("php://input");
$data  = json_decode($input, true);

if(!$data){
    echo json_encode(["estado" => "error", "mensaje" => "JSON inválido"]);
    exit;
}

$path = __DIR__ . "/variables.json";
file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["estado" => "ok", "mensaje" => "Variables actualizadas"]);
