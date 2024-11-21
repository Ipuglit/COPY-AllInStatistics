<?php
include '../conx.php';
include './gadget.php';

        $Data = json_decode(file_get_contents("php://input"), true);
        date_default_timezone_set( $Data['timezone'] );

        $datetime =                     gmdate(time());
        $username =                     $Data['username'];
        $password =                     $Data['password'];
        $timezone =                     $Data['timezone'];
        $feedback =                     "";

        if($username != "" and $password != ""){
                $qry = " SELECT * FROM users WHERE username='$username' AND password='$password' AND status=0 ";
                $GET_LOGIN = mysqli_query($conx, $qry);
                if(mysqli_num_rows($GET_LOGIN) != 0){
                        $row = mysqli_fetch_array($GET_LOGIN);

                        $qry2 = "SELECT name FROM default_roles WHERE id='".$row['role']."' ";
                        $check_role = $conx->query($qry2);
                        while ($ii = $check_role->fetch_assoc()) {
                                $userRolename = $ii['name'];
                        }

                        $qry3 = "SELECT file FROM images WHERE id='".$row['avatar']."' ";
                        $check_avatar = $conx->query($qry3);
                        while ($iii = $check_avatar->fetch_assoc()) {
                                $gotAvatar = $iii['file'];
                        }


                        $userID =           $row['id'];
                        $md5 =              $userID.$row['role'].$datetime;
                        $userToken =        md5($md5);

                        include './token.php';

                        mysqli_query($conx, "INSERT INTO history (userID,userRole,datetime,gadget,timezone,action)
                                             VALUES ('".$row['id']."', '".$row['role']."', '$datetime', '$userGadget','$timezone', 'Logged in')");

                        $feedback =     $row['id']
                                        ."|".$row['role']
                                        ."|".$userRolename
                                        ."|".$userGadget
                                        ."|".$userToken
                                        ."|".$row['username']
                                        ."|".$gotAvatar
                                        ."|".$row['nickname']
                                        ."|".$row['status']
                                        ."|".$row['email']
                                        ."|".$row['telegram'];

                } else {
                        $feedback = "None";
                }
        } else {
                $feedback = "Incomplete";
        };

        $response[] = array($feedback);
        echo json_encode($response);