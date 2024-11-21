<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if($Got['ON'] == "check"){

        $datestamped =  $Got['datestamp'];

        $check_exist = "SELECT COUNT(id) AS counted FROM fxUSD WHERE `datestamp`='$datestamped'";
        $exist = $conx->query($check_exist);

        if ($exist->num_rows > 0) {
            while ($i = $exist->fetch_assoc()) {
                $counts = $i["counted"];
            }
        } else {
                $counts = 0;
        }
        $feedback = $counts;

    } else {

            $id =                       $Got['id'];
            $provider =                 $Got['provider'];
            $datestamp =                $Got['datestamp'];
            $rates =                    json_encode($Got['rates']);
            $status =                   $Got['status'];

            $insert = "INSERT INTO fxUSD (`provider`, `datestamp`, `rates`, `status`)
                                    VALUES ('$provider', '$datestamp', '$rates', 0) ";

            $check_insert = "SELECT * FROM fxUSD WHERE `provider`='$provider' AND `datestamp`='$datestamp'";

            $update = "UPDATE fxUSD
                        SET `provider`          = '$provider',
                            `datestamp`         = '$datestamp',
                            `rates`             = '$rates',
                            `status`            = 0
                        WHERE  `id`             = $id ";

            $check_update = "SELECT * FROM fxUSD WHERE `provider`='$provider' AND `datestamp`='$datestamp' AND `id`!=$id ";

            if(empty($id) || $id == 0){
                //IF NO ID THEN INSERT
                try {
                    $duplicate_insert = $conx->query($check_insert);

                    if ($duplicate_insert->num_rows > 0) {
                            while ($i = $duplicate_insert->fetch_assoc()) {
                                    $gotID = $i["id"];
                            }
                        $feedback = "Duplicate: ".$gotID;
                    } else {

                        if ($conx->query($insert) === TRUE) {
                            $feedback = "Added";
                            $historyAction      = "ADDED";
                            $historyFor         = "FOREIGN EXCHANGE";
                            $historyDetails     = "FX ID: ".$id.",Provider: ".$provider.", Date: ".$datestamp;
                            include './history.php';
                            $feedback = "Success adding: ".$provider;
                        } else {
                            $feedback = "Err Add";
                        }

                    }

                } catch (Exception $e) {
                    $feedback = "Err Catch";
                }
            } else {
                //IF WITH ID THEN UPDATE
                try {
                    $duplicate_update = $conx->query($check_update);

                    if ($duplicate_update->num_rows > 0) {
                            while ($i = $duplicate_update->fetch_assoc()) {
                                    $gotID = $i["id"];
                            }
                        $feedback = "Duplicate: ".$gotID;
                    } else {

                        if ($conx->query($update) === TRUE) {
                            $feedback = "Updated";
                            $historyAction      = "UPDATED";
                            $historyFor         = "FOREIGN EXCHANGE";
                            $historyDetails     = "FX ID: ".$id.",Provider: ".$provider.", Date: ".$datestamp;
                            include './history.php';
                            $feedback = "Success updating: ".$provider;
                        } else {
                            $feedback = "Err Update";
                        }

                    }

                } catch (Exception $e) {
                    $feedback = "Err Catch";
                }
            }

    }

} else {
    $feedback = "Err";
}

echo json_encode($feedback);