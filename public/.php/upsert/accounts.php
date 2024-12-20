<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =                   $Got['id'];
    $appID =                $Got['appID'];
    $userID =               $Got['userID'];
    $accountID =            $Got['accountID'];
    $accountNickname =      $Got['accountNickname'];
    $accountRole =          $Got['accountRoleID'];
    $status =               $Got['status'];


    $insert = "INSERT INTO accounts (`accountID`, `accountRole`, `accountNickname`, `userID`, `appID`, `status`)
                            VALUES ($accountID, $accountRole, '$accountNickname', $userID, $appID, $status) ";

    $check_insert = "SELECT * FROM accounts WHERE `accountID`=$accountID OR (`appID`=$appID AND `accountNickname`='$accountNickname') ";

    $update = "UPDATE accounts
                SET `accountID`         = $accountID,
                    `accountRole`       = $accountRole,
                    `accountNickname`   ='$accountNickname',
                    `userID`            = $userID,
                    `appID`             = $appID,
                    `status`            = $status
                WHERE  `id`             = $id ";

    $check_update = "SELECT * FROM accounts WHERE (`accountID`=$accountID OR (`appID`=$appID AND `accountNickname`='$accountNickname')) AND `id`!=$id ";

    if(empty($id) || $id == 0){
        //IF NO ID THEN INSERT
        try {
            $duplicate_insert = $conx->query($check_insert);

            if ($duplicate_insert->num_rows > 0) {

                    while ($i = $duplicate_insert->fetch_assoc()) {
                            $gotID          = $i["accountID"];
                            $gotNickname    = $i["accountNickname"];
                    }
                    $feedback = "Already taken! ".$gotID." (".$gotNickname.")";

            } else {

                if ($conx->query($insert) === TRUE) {
                    $last_id = mysqli_insert_id($conx);
                    $feedback = "Added New (".$last_id.")";
                    $historyAction      = "ADDED";
                    $historyFor         = "ACCOUNT";
                    $historyDetails     = "Account ID: ".$accountID.", Account Role: ".$accountRole.", User ID: ".$userID.", App ID: ".$appID.", Status: ".$status;
                    include './history.php';
                } else {
                    $feedback = "Err Add";
                }

            }

        } catch (Exception $e) {
            $feedback = "Err Catch: Adding id ".$id.", appID".$appID.", userID".$userID.", accountID".$accountID.", accountNickname".$accountNickname.", accountRole".$accountRole.", status".$status;
        }
    } else {
        //IF WITH ID THEN UPDATE
        try {
            $duplicate_update = $conx->query($check_update);

            if ($duplicate_update->num_rows > 0) {
                    while ($i = $duplicate_update->fetch_assoc()) {
                            $gotID          = $i["accountID"];
                            $gotNickname    = $i["accountNickname"];
                    }
                    $feedback = "Already taken! ID: ".$gotID." (".$gotNickname.")";
            } else {

                if ($conx->query($update) === TRUE) {
                    $feedback = "Updated";
                    $historyAction      = "UPDATED";
                    $historyFor         = "ACCOUNT";
                    $historyDetails     = "ID: ".$id.", Account ID: ".$accountID.", Account Role: ".$accountRole.", User ID: ".$userID.", App ID: ".$appID.", Status: ".$status;
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

echo $feedback;