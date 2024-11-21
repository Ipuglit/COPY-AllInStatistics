<?php
    include '../conx.php';
    include '../verify/verify.php';

    if($Verified == "FOUND"){

        $upline = [2,3,4];
        $uppers = [5,6,7,8];

        if ( in_array($verifyRole, $upline) ){
            if($Got['FOR']=="ALL"){
                $sql = "SELECT *
                        FROM notification
                        WHERE requestedTo=$verifyID
                        GROUP BY id
                        ORDER BY status AND requestTime";
            } else if($Got['FOR']=="PENDING"){
                $sql = "SELECT *
                        FROM notification
                        WHERE requestedTo=$verifyID AND status=1
                        GROUP BY id
                        ORDER BY status AND requestTime";
            }
        } else if ( in_array($verifyRole, $uppers) ){
            if($Got['FOR']=="ALL"){
                $sql = "SELECT *
                        FROM notification
                        GROUP BY id
                        ORDER BY status AND requestTime";
            } else if($Got['FOR']=="PENDING"){
                $sql = "SELECT *
                        FROM notification
                        WHERE status=1
                        GROUP BY id
                        ORDER BY status AND requestTime";
            }
        }

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $check_requestedby = $conx->query("SELECT *, r.name AS roleName FROM users AS u
                                                    LEFT JOIN default_roles as r ON u.role = r.id
                                                    WHERE u.id='".$i['requestedBy']."' ");
                while ($ii = $check_requestedby->fetch_assoc()) {
                    $requestedByRole =      $ii['roleName'];
                    $requestedByNickname =  $ii['nickname'];
                }

                $check_requestedto = $conx->query("SELECT *, r.name AS roleName FROM users AS u
                                                    LEFT JOIN default_roles as r ON u.role = r.id
                                                    WHERE u.id='".$i['requestedTo']."' ");
                while ($ii = $check_requestedto->fetch_assoc()) {
                    $requestedToRole =      $ii['roleName'];
                    $requestedToNickname =  $ii['nickname'];
                }

                $check_approvedby = $conx->query("SELECT *, r.name AS roleName FROM users AS u
                                                    LEFT JOIN default_roles as r ON u.role = r.id
                                                    WHERE u.id='".$i['approvedBy']."' ");
                while ($ii = $check_approvedby->fetch_assoc()) {
                    $approvedByRole =       $ii['roleName'];
                    $approvedByNickname =   $ii['nickname'];
                }

                if($i['status']==0){
                    $status = "Approved";
                } else if($i['status']==1){
                    $status = "Pending";
                } else if($i['status']==2){
                    $status = "Disapproved";
                } else {
                    $status = "Inactive";
                }

                $data[] = array(
                    'id' =>                     $i['id'],
                    'title' =>                  $i['title'],
                    'details' =>                $i['details'],
                    'type' =>                   $i['type'],
                    'requestedBy' =>            $i['requestedBy'],
                    'requestedByRole' =>        $requestedByRole,
                    'requestedByNickname' =>    $requestedByNickname,
                    'requestedTo' =>            $i['requestedTo'],
                    'requestedToRole' =>        $requestedToRole,
                    'requestedToNickname' =>    $requestedToNickname,
                    'requestTime' =>            $i['requestTime'],
                    'approvedBy' =>             $i['approvedBy'],
                    'approvedByRole' =>         $approvedByRole,
                    'approvedByNickname' =>     $approvedByNickname,
                    'approvedTime' =>           $i['approvedTime'],
                    'approvedMessage' =>        $i['approvedMessage'],
                    'status' =>                 $status,
                    );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("Err");
}

?>