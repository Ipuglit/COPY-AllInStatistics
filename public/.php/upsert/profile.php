<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $nickname =         $Got['nickname'];
    $avatar =           $Got['avatar'];
    $email =            $Got['email'];
    $telegram =         $Got['telegram'];
    $username =         $Got['username'];
    $password =         $Got['password'];
    $newpassword =      $Got['newpassword'];

    $check_password = "SELECT * FROM users WHERE `password`='$password' AND `id`=$verifyID ";


    if(!empty($newpassword)){
        $setpassword = $newpassword;
    } else {
        $setpassword = $password;
    }

    $update = "UPDATE users
                SET `nickname`  ='$nickname',
                    `avatar`    ='$avatar',
                    `username`  ='$username',
                    `password`  ='$setpassword',
                    `email`     ='$email',
                    `telegram`  ='$telegram'
                WHERE  `id`     =$verifyID ";



        $check_username = "SELECT * FROM users WHERE `username`='$username' AND `id`!=$verifyID ";
        $check_nickname = "SELECT * FROM users WHERE `nickname`='$nickname' AND `id`!=$verifyID ";


    $wrong_password = $conx->query($check_password);

    if ($wrong_password->num_rows === 0) {

        $feedback = "Wrong Password";

    } else {
        //IF WITH ID THEN UPDATE
        try {
                $duplicate_username = $conx->query($check_username);
                $duplicate_nickname = $conx->query($check_nickname);

            if ($duplicate_username->num_rows > 0) {
                    while ($i = $duplicate_username->fetch_assoc()) {
                            $gotIDU = $i["id"];
                    }
                $feedback = "Duplicate Username : ".$gotIDU;
            } else if ($duplicate_nickname->num_rows > 0) {
                    while ($i = $duplicate_nickname->fetch_assoc()) {
                            $gotIDN = $i["id"];
                    }
                $feedback = "Duplicate Nickname : ".$gotIDN;
            } else {

                if ($conx->query($update) === TRUE) {
                        $feedback = "Updated";
                        $historyAction      = "UPDATED";
                        $historyFor         = "PROFILE";
                        $historyDetails     = "ID: ".$verifyID.", Nickname: ".$nickname.", Email:".$email.", Telegram:".$telegram.",  Username:".$username;
                        include './history.php';
                } else {
                    $feedback = "Err Up";
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
