<?php
include '../conx.php';
include './gadget.php';

$Got = json_decode( file_get_contents("php://input"), true );

$verifyID =             $Got['A'];
$verifyToken =          $Got['B'];
$verifyGadget =         $Got['C'];

if(!empty($verifyID)){

        $sql = "SELECT * FROM tokens WHERE userID='$verifyID' AND token='$verifyToken' AND gadget='$verifyGadget' ";
            $result = $conx->query($sql);
            $data = [];

            if ($result->num_rows > 0) {
                while ($i = $result->fetch_assoc()) {

                $check_users = $conx->query("SELECT *, r.name AS roleName FROM users AS u
                                                                        LEFT JOIN default_roles as r ON u.role = r.id
                                                                        LEFT JOIN images as i ON u.avatar = i.id
                                                                        WHERE u.id='".$i['userID']."' ");
                while ($ii = $check_users->fetch_assoc()) {
                        $id =           $ii['id'];
                    $role =             $ii['role'];
                    $roleName =         $ii['roleName'];
                    $nickname=          $ii['nickname'];
                    $username =         $ii['username'];
                    $avatar =           $ii['path'];
                    $status =           $ii['status'];
                }

                if($status==0){
                    $status = "Active";
                } else if($status==1){
                    $status = "Pending";
                } else {
                    $status = "Inactive";
                }
                        $feedback = array(
                                        'id'            => $i['userID'],
                                        'role'          => $role,
                                        'rolename'      => $rolename,
                                        'gadget'        => $userGadget,
                                        'token'         => $verifyToken,
                                        'username'      => $username,
                                        'avatar'        => $avatar,
                                        'nickname'      => $nickname,
                                        'status'        => $status,
                        );
                        $feedbackx =     $id
                                        ."|".$role
                                        ."|".$roleName
                                        ."|".$userGadget
                                        ."|".$verifyToken
                                        ."|".$username
                                        ."|".$avatar
                                        ."|".$nickname
                                        ."|".$status;
                }
            } else {
                $feedback = "Err";
            }

} else {
        $feedback = "Err";
}

echo json_encode($feedback);