<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =               $Got['id'];
    $role =             $Got['roleID'];
    $nickname =         $Got['nickname'];
    $avatar =           $Got['avatarID'];
    $username =         $Got['username'];
    $password =         $Got['password'];
    $email =            $Got['email'];
    $telegram =         $Got['telegram'];
    $status =           $Got['status'];

    $insert = "INSERT INTO users (`role`, `nickname`, `avatar`, `username`, `password`, `email`, `telegram`, `status`)
                            VALUES ($role, '$nickname', '6', '$username', '$password', '$email', '$telegram', '$status') ";

    $check_insert = "SELECT * FROM users WHERE `nickname`='$nickname'";

    $update = "UPDATE users
                SET `role`      =$role,
                    `nickname`  ='$nickname',
                    `avatar`    ='$avatar',
                    `username`  ='$username',
                    `password`  ='$password',
                    `email`     ='$email',
                    `telegram`  ='$telegram',
                    `status`    =$status
                WHERE  `id`     =$id ";

    $check_update = "SELECT * FROM users WHERE `nickname`='$nickname' AND `id`!=$id ";

    if(empty($id) || $id == 0){
        //IF NO ID THEN INSERT
        try {
            $duplicate_insert = $conx->query($check_insert);

            if ($duplicate_insert->num_rows > 0) {
                    while ($i = $duplicate_insert->fetch_assoc()) {
                        $gotID              = $i["id"];
                        $gotNickname        = $i["nickname"];
                    }
                    $feedback = "Already taken! ".$gotID." (".$gotNickname.")";
            } else {

                if ($conx->query($insert) === TRUE) {
                    $last_id            = mysqli_insert_id($conx);
                    $feedback           = "Added New (".$last_id.")";
                    $historyAction      = "ADDED";
                    $historyFor         = "USER";
                    $historyDetails     = "Nickname: ".$nickname.", Role ID: ".$role.", Username:".$username.", Status: ".$status;
                    include './history.php';
                } else {
                    $feedback = "Err Adding!";
                }

            }

        } catch (Exception $e) {
            $feedback = "Catched Err Adding!";
        }
    } else {
        //IF WITH ID THEN UPDATE
        try {
            $duplicate_update = $conx->query($check_update);

            if ($duplicate_update->num_rows > 0) {
                    while ($i = $duplicate_update->fetch_assoc()) {
                            $gotID              = $i["id"];
                            $gotNickname        = $i["nickname"];
                    }
                    $feedback = "Already taken! ".$gotID." (".$gotNickname.")";
            } else {

                if ($conx->query($update) === TRUE) {
                        $feedback = "Updated";
                        $historyAction      = "UPDATED";
                        $historyFor         = "USER";
                        $historyDetails     = "ID: ".$id.", Nickname: ".$nickname.", Role ID: ".$role.", Username:".$username.", Status: ".$status;
                        include './history.php';
                } else {
                    $feedback = "Err Updating!";
                }

            }

        } catch (Exception $e) {
            $feedback = "Catched Err Updating!";
        }
    }

} else {
    $feedback = "NOTFOUND";
}

echo json_encode($feedback);
