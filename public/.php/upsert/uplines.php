<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =               $Got['id'];
    $clubID =           $Got['clubID'];
    $downlineID =       $Got['downlineID'];
    $uplineID =         $Got['uplineID'];
    $percentage =       $Got['percentage'];
    $status =           $Got['status'];
    $request =          $Got['request'];

    $dateTime =         new DateTime('now', new DateTimeZone('UTC'));
    $stated =           $dateTime->getTimestamp();

    $check_insert = "SELECT * FROM uplines
                        WHERE `clubID`=$clubID
                            AND `downlineID`=$downlineID
                            AND ( `status`= 0 OR `status`= 1 ) ";

    $insert = "INSERT INTO uplines (`clubID`, `downlineID`, `uplineID`, `percentage`, `status`, `stated`)
                VALUES ($clubID, $downlineID, $uplineID, $percentage, $status, $stated) ";

    $check_update = "SELECT * FROM uplines
                        WHERE clubID='$clubID'
                            AND downlineID='$downlineID'
                            AND ( `status`=0 OR `status`=1 )
                            AND id!='$id' ";

    $check_changes = "SELECT * FROM uplines
                        WHERE `clubID`='$clubID'
                            AND `downlineID`='$downlineID'
                            AND `uplineID`=$uplineID
                            AND `percentage`=$percentage
                            AND `status`=$status
                            AND id='$id' ";

    $update = "UPDATE uplines SET `status` = 2 WHERE `id`=$id ";

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
                    $new_ID             = mysqli_insert_id($conx);
                    $feedback           = "Added";
                    $historyAction      = "ADDED";
                    $historyFor         = "UPLINE";
                    $historyDetails     = "ID: ".$new_ID.", Club ID: ".$clubID.", Downline ID: ".$downlineID.", Upline ID:".$uplineID.", Percentage: ".$percentage.", Status: ".$status;
                    include './history.php';
                } else {
                    $feedback = "Err Add";
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

                $duplicate_changes = $conx->query($check_changes);

                if ($duplicate_changes->num_rows == 0) {

                    if ($conx->query($update) === TRUE) {

                        $duplicate_insert = $conx->query($check_insert);

                        if ($duplicate_insert->num_rows > 0) {
                                while ($i = $duplicate_insert->fetch_assoc()) {
                                        $gotID = $i["id"];
                                }
                            $feedback = "Duplicate: ".$gotID;
                        } else {
                            if ($conx->query($update) === TRUE) {

                                if ($conx->query($insert) === TRUE) {

                                    $new_ID             = mysqli_insert_id($conx);
                                    $feedback           = "Updated";
                                    $historyAction      = "REPLACED";
                                    $historyFor         = "UPLINE";
                                    $historyDetails     = "ID: ".$new_ID.", Club ID: ".$clubID.", Downline ID: ".$downlineID.", Upline ID:".$uplineID.", Percentage: ".$percentage.", Status: ".$status;
                                    include './history.php';

                                } else {
                                    $feedback = "Err Add2";
                                }

                            } else {
                                $feedback = "Err Repl";
                            }
                        }

                    } else {
                        $feedback = "Err Add";
                    }
                } else {
                    $feedback = "Updated";
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

//PROCESS:
//Check if with ID
// If NO ID, then check for duplicates, if no duplicate then proceed to ADDING else return ID
// If WITH ID, then check for duplicates not equal to ID, if no duplicate then check if there are changes to existing, if there is then proceed to REPLACING
//(Update existing data status to disabled then ADD new data)