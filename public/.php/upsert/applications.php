<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =               $Got['id'];
    $name =             $Got['name'];
    $company =          $Got['companyID'];
    $details =          $Got['details'];
    $image =            $Got['imageID'];
    $status =           $Got['status'];

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
                            $gotID      = $i["id"];
                            $gotName    = $i["name"];
                    }
                    $feedback = "Already taken! ID: ".$gotID." (".$gotName.")";
            } else {

                if ($conx->query($insert) === TRUE) {
                        $last_id            = mysqli_insert_id($conx);
                        $feedback           = "Added New (".$last_id.")";
                        $historyAction      = "ADDED";
                        $historyFor         = "APPLICATION";
                        $historyDetails     = "Name: ".$name.", Company: ".$company.", Status: ".$status;
                        include './history.php';
                } else {
                    $feedback = "Err Add";
                }

            }

        } catch (Exception $e) {
            $feedback = "Err Catch: Add ".$e;
        }
    } else {
        //IF WITH ID THEN UPDATE
        try {
            $duplicate_update = $conx->query($check_update);

            if ($duplicate_update->num_rows > 0) {
                    while ($i = $duplicate_insert->fetch_assoc()) {
                            $gotID      = $i["id"];
                            $gotName    = $i["name"];
                    }
                    $feedback = "Already taken! ID: ".$gotID." (".$gotName.")";
            } else {

                if ($conx->query($update) === TRUE) {
                        $feedback           = "Updated";
                        $historyAction      = "UPDATED";
                        $historyFor         = "APPLICATION";
                        $historyDetails     = "ID: ".$id.", Name: ".$name.", Company: ".$company.", Status: ".$status;
                        include './history.php';
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