<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if       ( $Got['FOR'] == "ALL" ){
            $Extend = " WHERE a.status=0 ";
            $Midlane = " ";
    } else if( $Got['FOR'] == "APP" ){
            $Extend = " WHERE a.status=0 AND app.id = ".$Got['WHAT'];
            $Midlane = " ";
    } else if( $Got['FOR'] == "CLUB" ){
            $Extend = " WHERE a.status=0 AND c.idd = ".$Got['WHAT'];
            $Midlane = " ";
    } else if( $Got['FOR'] == "PLAYER" ){
            $Extend = " WHERE a.status=0 AND app.id = ".$Got['WHAT'];
            if(!empty($Got['WHAT2'])){
                $Midlane = " AND a.accountID = up.downlineID AND up.clubID = ".$Got['WHAT2'];
            } else {
                $Midlane = " AND a.accountID = up.downlineID AND up.clubID = 0 ";
            }
    } else if( $Got['FOR'] == "UPLINE" ){
            $Extend = " WHERE app.id = ".$Got['WHAT']." AND a.accountID != ".$Got['WHAT3'];
            if(!empty($Got['WHAT2'])){
                $Midlane = " AND a.accountID = up.uplineID AND up.clubID = ".$Got['WHAT2'];
            } else {
                $Midlane = " AND a.accountID = up.uplineID AND up.clubID = 0 ";
            }
    } else {
            $Extend = " WHERE a.status=0 ";
            $Midlane = " ";
    }

    $sql = "SELECT DISTINCT     app.id AS appID,
                                app.name AS appName,
                                c.idd AS clubIDD,
                                c.name AS clubName,
                                a.accountID AS accountID,
                                a.accountNickname AS accountNickname,
                                a.accountRole AS accountRoleID,
                                r.name AS accountRole,
                                a.status AS accountStatus,
                                up.uplineID AS uplineID,
                                (SELECT ac.accountNickname FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineNickname,
                                (SELECT ac.accountRole FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineRoleID,
                                (SELECT ro.name FROM accounts AS ac LEFT JOIN default_roles AS ro ON ac.accountRole = ro.id WHERE ac.accountID = up.uplineID) AS uplineRole,
                                (SELECT ac.status FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineStatus,
                                up.percentage AS agencyRake,
                                u.id AS accountuserID,
                                u.role AS accountuserRoleID,
                                (SELECT rol.name FROM users AS us LEFT JOIN default_roles AS rol ON us.role = rol.id WHERE us.id = a.userID) AS accountuserRole,
                                u.nickname AS accountuserNickname,
                                CONCAT(pa.path,img.file) AS accountuserAvatar
            FROM accounts AS a
            LEFT JOIN users AS u ON a.userID = u.id
            LEFT JOIN default_roles AS r ON a.accountRole = r.id
            LEFT JOIN applications AS app ON a.appID = app.id
            LEFT JOIN images AS img ON u.avatar = img.id
            LEFT JOIN paths AS pa ON img.type = pa.type
            LEFT JOIN uplines AS up ON up.status=0 ".$Midlane."
            LEFT JOIN clubs AS c ON up.clubID = c.idd
             ".$Extend;

    $result = $conx->query($sql);
    $data = [];
    $counter = 0;

    if ($result->num_rows > 0) {
        while ($i = $result->fetch_assoc()) {
            $counter = ++$counter;

            if($i['accountStatus']==0){
                $status = "Active";
            } else if($i['accountStatus']==1){
                $status = "Pending";
            } else {
                $status = "Inactive";
            }

            $data[] = array(
                    'id'                        => $counter,
                    'appID'                     => $i['appID'],
                    'appName'                   => $i['appName'],
                    'clubIDD'                   => $i['clubIDD'],
                    'clubName'                  => $i['clubName'],
                    'accountID'                 => $i['accountID'],
                    'accountNickname'           => $i['accountNickname'],
                    'accountRoleID'             => $i['accountRoleID'],
                    'accountRole'               => $i['accountRole'],
                    'accountStatus'             => $i['accountStatus'],
                    'accountStatusLabel'        => $status,
                    'uplineID'                  => $i['uplineID'],
                    'uplineNickname'            => $i['uplineNickname'],
                    'uplineRoleID'              => $i['uplineRoleID'],
                    'uplineRole'                => $i['uplineRole'],
                    'uplineStatus'              => $i['uplineStatus'],
                    'agencyRake'             => $i['agencyRake'],
                    'accountuserID'             => $i['accountuserID'],
                    'accountuserRoleID'         => $i['accountuserRoleID'],
                    'accountuserRole'           => $i['accountuserRole'],
                    'accountuserNickname'       => $i['accountuserNickname'],
                    'accountuserAvatar'         => $i['accountuserAvatar'],
            );

        }
    }

    echo json_encode($data, true);

 } else {
    echo json_encode("Err");
 }

 //Fetch all ACCOUNTS that is active including uplines, application, and club details