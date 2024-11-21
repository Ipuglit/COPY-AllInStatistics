<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $id =               $Got['newuserID'];
    $app =              $Got['newuserApp'];
    $role =             $Got['newuserRole'];
    $nickname =         $Got['newuserNickname'];
    $avatar =           $Got['newuserAvatar'];
    $username =         $Got['newuserUsername'];
    $password =         $Got['newuserPassword'];
    $email =            $Got['newuserEmail'];
    $telegram =         $Got['newuserTelegram'];
    $status =           $Got['newuserStatus'];

    $insert = "INSERT INTO users (`role`, `nickname`, `avatar`, `username`, `password`, `email`, `telegram`, `status`)
                            VALUES ($role, '$nickname', '$avatar', '$username', '$password', '$email', '$telegram', '$status') ";

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
                            $gotID = $i["id"];
                    }
                $feedback = "Duplicate: ".$gotID;
            } else {

                if ($conx->query($insert) === TRUE) {
                    $feedback = "Added";
                    $historyAction      = "ADDED";
                    $historyFor         = "USER";
                    $historyDetails     = "Nickname: ".$nickname.", Role ID: ".$role.", Username:".$username.", Status: ".$status;
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

                if ($conx->query($update) === TRUE) {
                        $feedback = "Updated";
                        $historyAction      = "UPDATED";
                        $historyFor         = "USER";
                        $historyDetails     = "ID: ".$id.", Nickname: ".$nickname.", Role ID: ".$role.", Username:".$username.", Status: ".$status;
                        include './history.php';
                } else {
                    $feedback = "Err Add";
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