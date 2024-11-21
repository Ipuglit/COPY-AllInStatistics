<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =               $Got['appID'];
    $name =             $Got['appName'];
    $company =          $Got['appCompany'];
    $details =          $Got['appDetails'];
    $image =            $Got['appImage'];
    $status =           $Got['appStatus'];

    $insert = "INSERT INTO applications (name, company, details, image, status ) VALUES ('$name','$company','$details','$image',0) ";
    $check_insert = "SELECT * FROM applications WHERE name='$name' ";

    $update = "UPDATE applications SET name='$name',company='$company',details='$details',image='$image',status='$status' WHERE id='$id' ";
    $check_update = "SELECT * FROM applications WHERE name='$name' AND id!='$id' ";

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
                        $historyFor         = "APPLICATION";
                        $historyDetails     = "Name: ".$name.", Company: ".$company.", Status: ".$status;
                        include './history.php';
                } else {
                    $feedback = "Err";
                }

            }

        } catch (Exception $e) {
            $feedback = "Err";
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
                        $historyFor         = "APPLICATION";
                        $historyDetails     = "ID: ".$id.", Name: ".$name.", Company: ".$company.", Status: ".$status;
                        include './history.php';
                } else {
                    $feedback = "Err";
                }

            }

        } catch (Exception $e) {
            $feedback = "Err";
        }
    }
} else {
    $feedback = "Err";
}

echo json_encode($feedback);