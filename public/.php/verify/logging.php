<?php
    include '../conx.php';
    include './gadget.php';

    $Log = json_decode( file_get_contents("php://input"), true );

    date_default_timezone_set( $Log['tz'] );

    if( !empty($Log['un']) || !empty($Log['pw']) ){

        $UN     = $Log['un'];
        $PW     = $Log['pw'];
        $TZ     = $Log['tz'];
        $Time   = time();

        $feedback = [];

        $check = "SELECT
                    u.id AS Uid,
                    ur.name as Role,
                    u.role as RoleID,
                    u.nickname as Nickname,
                    CONCAT(p.path,i.file) AS Avatar,
                    u.username as Username,
                    u.email as Email,
                    u.telegram as Telegram,
                    IF(u.status = 0, 'Active', IF(u.status = 1, 'Pending', 'Inactive')) as Status
                    FROM users as u
                    LEFT JOIN user_roles AS ur ON u.role = ur.id
                    LEFT JOIN images AS i ON u.avatar = i.id
                    LEFT JOIN paths AS p ON i.type = p.type
                    WHERE u.status = 0 AND `username`='$UN' AND `password`='$PW'";

        try {
            $checking = $conx->query($check);

            if ($checking->num_rows > 0) {
                    while ($i = $checking->fetch_assoc()) {
                        $UID            = $i["Uid"];
                        $Role           = $i["Role"];
                        $RoleID         = $i["RoleID"];
                        $Nickname       = $i["Nickname"];
                        $Avatar         = $i["Avatar"];
                        $Username       = $i["Username"];
                        $Email          = $i["Email"];
                        $Telegram       = $i["Telegram"];
                        $Status         = $i["Status"];
                    }

                    $md5                = $UID.$RoleID.$Time;
                    $Token              = md5($md5);

                    $check_token    = " SELECT 1 from tokens
                                        WHERE userID='$UID' AND gadget='$userGadget' ";

                    $insert_token   = " INSERT INTO tokens (userID, gadget, token)
                                        VALUES ('$UID', '$userGadget', '$Token') ";

                    $update_token   = " UPDATE tokens
                                        SET  userID='$UID', token='$Token', gadget='$userGadget'
                                        WHERE userID='$UID' AND gadget='$userGadget' ";

                    $insert_history = " INSERT INTO history (userID,userRole,datetime,gadget,timezone,action,dash,details)
                                        VALUES ($UID,$RoleID,$Time, '$userGadget', '$TZ', 'LOGIN','LOG','$Token')";

                    $conx->query($insert_history);

                    $checking_token = $conx->query($check_token);

                    if ($checking_token->num_rows > 0) {
                        $conx->query($update_token);
                    } else {
                        $conx->query($insert_token);
                    }

                    $feedback[] = array(
                        'uid'           => $UID,
                        'role'          => $Role,
                        'roleID'        => $RoleID,
                        'nickname'      => $Nickname,
                        'avatar'        => $Avatar,
                        'username'      => $Username,
                        'email'         => $Email,
                        'telegram'      => $Telegram,
                        'status'        => $Status,
                        'token'         => $Token,
                        'gadget'        => $userGadget,
                    );

            } else {
                $feedback = "NONE";
            }

        } catch (Exception $e) {
            $feedback = "ERR";
        }
    } else {
        $feedback = "INC";
    }


echo json_encode($feedback);