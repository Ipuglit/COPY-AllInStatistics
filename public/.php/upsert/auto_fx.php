<?php
    header("Access-Control-Allow-Origin: *"); //add this CORS header to enable any domain to send HTTP requests to these endpoints:
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json; charset=UTF-8");

    $conx = new mysqli("54.252.185.246:3306", "pokeradmin", "poker6789", "pokeranalytics");

    if(mysqli_connect_error()){
        echo mysqli_connect_error();
        exit();
    }

    $URL_A          = file_get_contents("https://v6.exchangerate-api.com/v6/61b370327f102d95c5f30e60/latest/USD");
    $URL_B          = file_get_contents("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_3eWhXPMnNdgcR6DMhuo2lPBiRYZXMbfp99qVbGY1");
    $URL_C          = file_get_contents("https://api.exchangeratesapi.net/v1/exchange-rates/latest?access_key=q90PT0aOUSVUf8iW");
    $URL_D          = file_get_contents("https://open.er-api.com/v6/latest/USD");

    $PROVIDER_A           = "v6.exchangerate-api.com";
    $PROVIDER_B           = "api.freecurrencyapi.com";
    $PROVIDER_C           = "api.exchangeratesapi.net";
    $PROVIDER_D           = "open.er-api.com";

    $JSON_A          = json_decode($URL_A, true);
    $JSON_B          = json_decode($URL_B, true);
    $JSON_C          = json_decode($URL_C, true);
    $JSON_D          = json_decode($URL_D, true);

    $Rates_A = json_encode($JSON_A['conversion_rates']);
    $Rates_B = json_encode($JSON_B['data']);
    $Rates_C = json_encode($JSON_C['rates']);
    $Rates_D = json_encode($JSON_D['rates']);

    $Date_A = date("m/d/Y",$JSON_A['time_last_update_unix']);
    $Date_B = date("m/d/Y");
    $Date_C = date("m/d/Y",strtotime($JSON_C['date']));
    $Date_D = date("m/d/Y",$JSON_D['time_last_update_unix']);

    if(isset($JSON_A)){
        $CHECK_A    = "SELECT * FROM fxUSD WHERE `provider`='$PROVIDER_A' AND `datestamp`='$Date_A'";
        $INSERT_A   = "INSERT INTO fxUSD (`provider`, `datestamp`, `rates`, `status`) VALUES ('$PROVIDER_A', '$Date_A', '$Rates_A', 0) ";
        try {
            $DUPLICATE_A = $conx->query($CHECK_A);
            if ($DUPLICATE_A->num_rows > 0) {
                while ($i = $DUPLICATE_A->fetch_assoc()) { $ID_A = $i["id"]; }
                $UPDATE_A = "UPDATE fxUSD SET `provider`='$PROVIDER_A',`datestamp`='$Date_A',`rates`='$Rates_A',`status`=0 WHERE `id`=$ID_A";
                if ($conx->query($UPDATE_A) === TRUE) {
                    $FEEDBACK_A = "UPDATED";
                } else {
                    $FEEDBACK_A = "ERR: UPDATE";
                }
            } else {
                if ($conx->query($INSERT_A) === TRUE) {
                    $FEEDBACK_A = "ADDED";
                } else {
                    $FEEDBACK_A = "ERR: ADD";
                }
            }
        } catch (Exception $e) {
            $FEEDBACK_A = "ERR: CATCH";
        }
    }


    if(isset($JSON_B)){
        $CHECK_B    = "SELECT * FROM fxUSD WHERE `provider`='$PROVIDER_B' AND `datestamp`='$Date_B'";
        $INSERT_B   = "INSERT INTO fxUSD (`provider`, `datestamp`, `rates`, `status`) VALUES ('$PROVIDER_B', '$Date_B', '$Rates_B', 0) ";
        try {
            $DUPLICATE_B = $conx->query($CHECK_B);
            if ($DUPLICATE_B->num_rows > 0) {
                while ($i = $DUPLICATE_B->fetch_assoc()) { $ID_B = $i["id"]; }
                $UPDATE_B = "UPDATE fxUSD SET `provider`='$PROVIDER_B',`datestamp`='$Date_B',`rates`='$Rates_B',`status`=0 WHERE `id`=$ID_B";
                if ($conx->query($UPDATE_B) === TRUE) {
                    $FEEDBACK_B = "UPDATED";
                } else {
                    $FEEDBACK_B = "ERR: UPDATE";
                }
            } else {
                if ($conx->query($INSERT_B) === TRUE) {
                    $FEEDBACK_B = "ADDED";
                } else {
                    $FEEDBACK_B = "ERR: ADD";
                }
            }
        } catch (Exception $e) {
            $FEEDBACK_B = "ERR: CATCH";
        }
    }


    if(isset($JSON_C)){
        $CHECK_C    = "SELECT * FROM fxUSD WHERE `provider`='$PROVIDER_C' AND `datestamp`='$Date_C'";
        $INSERT_C   = "INSERT INTO fxUSD (`provider`, `datestamp`, `rates`, `status`) VALUES ('$PROVIDER_C', '$Date_C', '$Rates_C', 0) ";
        try {
            $DUPLICATE_C = $conx->query($CHECK_C);
            if ($DUPLICATE_C->num_rows > 0) {
                while ($i = $DUPLICATE_C->fetch_assoc()) { $ID_C = $i["id"]; }
                $UPDATE_C = "UPDATE fxUSD SET `provider`='$PROVIDER_C',`datestamp`='$Date_C',`rates`='$Rates_C',`status`=0 WHERE `id`=$ID_C";
                if ($conx->query($UPDATE_C) === TRUE) {
                    $FEEDBACK_C = "UPDATED";
                } else {
                    $FEEDBACK_C = "ERR: UPDATE";
                }
            } else {
                if ($conx->query($INSERT_C) === TRUE) {
                    $FEEDBACK_C = "ADDED";
                } else {
                    $FEEDBACK_C = "ERR: ADD";
                }
            }
        } catch (Exception $e) {
            $FEEDBACK_C = "ERR: CATCH";
        }
    }


    if(isset($JSON_D)){
        $CHECK_D    = "SELECT * FROM fxUSD WHERE `provider`='$PROVIDER_D' AND `datestamp`='$Date_D'";
        $INSERT_D   = "INSERT INTO fxUSD (`provider`, `datestamp`, `rates`, `status`) VALUES ('$PROVIDER_D', '$Date_D', '$Rates_D', 0) ";
        try {
            $DUPLICATE_D = $conx->query($CHECK_D);
            if ($DUPLICATE_D->num_rows > 0) {
                while ($i = $DUPLICATE_D->fetch_assoc()) { $ID_D = $i["id"]; }
                $UPDATE_D = "UPDATE fxUSD SET `provider`='$PROVIDER_D',`datestamp`='$Date_D',`rates`='$Rates_D',`status`=0 WHERE `id`=$ID_D";
                if ($conx->query($UPDATE_D) === TRUE) {
                    $FEEDBACK_D = "UPDATED";
                } else {
                    $FEEDBACK_D = "ERR: UPDATE";
                }
            } else {
                if ($conx->query($INSERT_D) === TRUE) {
                    $FEEDBACK_D = "ADDED";
                } else {
                    $FEEDBACK_D = "ERR: ADD";
                }
            }
        } catch (Exception $e) {
            $FEEDBACK_D = "ERR: CATCH";
        }
    }

    echo "A: ".$FEEDBACK_A.", B: ".$FEEDBACK_B.", C: ".$FEEDBACK_C.", D: ".$FEEDBACK_D;