<?php
    header("Access-Control-Allow-Origin: *"); //add this CORS header to enable any domain to send HTTP requests to these endpoints:
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json; charset=UTF-8");

    session_start();
    $conx = new mysqli("54.252.185.246:3306", "pokeradmin", "poker6789", "pokeranalytics");

    if(mysqli_connect_error()){
        echo mysqli_connect_error();
        exit();
    }

?>