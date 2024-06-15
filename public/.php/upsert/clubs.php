<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =               $Got['id'];
    $idd =              $Got['idd'];
    $name =             $Got['name'];
    $image =            $Got['imageID'];
    $appID =            $Got['appID'];
    $details =          $Got['details'];
    $type =             $Got['type'];
    $union =            $Got['unionID'];
    $percentType =      "CLUB";
    $percent =          $Got['percent'];
    $status =           $Got['status'];

    $insert = "INSERT INTO clubs (`idd`, `name`, `image`, `appID`, `details`, `type`, `unionID`, `status`)
                      VALUES ($idd, '$name', $image, $appID, '$details', '$type', $union,$status) ";

    $check_insert = "SELECT * FROM clubs WHERE (`name`='$name' OR `idd`=$idd) OR `id`=$id ";

    $update = "UPDATE `clubs`
                SET `idd`       = $idd,
                    `name`      = '$name',
                    `image`     = $image,
                    `appID`     = $appID,
                    `details`   = '$details',
                    `type`      = '$type',
                    `unionID`     = $union,
                    `status`    = $status
                WHERE  `id`     = $id";

    $check_update = "SELECT * FROM clubs WHERE (`name`='$name' OR `idd`=$idd) AND `id`!=$id ";

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
                        $last_id            = mysqli_insert_id($conx);
                        $feedback           = "Added New (".$last_id.")";
                        $historyAction      = "ADDED";
                        $historyFor         = "CLUB";
                        $historyDetails     = "ID: ".$idd.", Name: ".$name.", Application ID: ".$appID.", Status: ".$status;
                        include './history.php';
                        include './percentages.php';

                } else {
                    $feedback = "Err Add";
                }

            }
        } catch (Exception $e) {
            $feedback = "Err Catch: Duplicate ".$e;
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
                        $historyFor         = "CLUB";
                        $historyDetails     = "ID: ".$idd.", Name: ".$name.", Application ID: ".$appID.", Status: ".$status;
                        include './history.php';
                        include './percentages.php';
                } else {
                    $feedback = "Err Update";
                }

            }
        } catch (Exception $e) {
            $feedback = "Err Catch: Duplicate ".$e;
        }
    }

} else {
    $feedback = "NOTFOUND";
}

echo json_encode($feedback);