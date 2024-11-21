<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if ( $Got['FOR'] == "ALL" ){
                $MidLane = " up.downlineID = a.accountID  ";
                $Extend = " ";
    } else if( $Got['FOR'] == "MY" ){
                $MidLane = " up.status!=2 AND up.downlineID = a.accountID  ";
                $Extend = " WHERE a.accountID= ".$Got['WHAT'];
    } else if( $Got['FOR'] == "MYALL" ){
                $MidLane = " up.downlineID = a.accountID  ";
                $Extend = " WHERE a.accountID= ".$Got['WHAT'];
    } else if( $Got['FOR'] == "ACTIVEPENDING" ){
                $MidLane = " up.status!=2 AND up.downlineID = a.accountID ";
                $Extend = " ";
    } else if( $Got['FOR'] == "ACTIVE" ){
                $MidLane = " up.status=0 AND up.downlineID = a.accountID ";
                $Extend = " ";
    } else if( $Got['FOR'] == "PENDING" ){
                $MidLane = " up.status=1 AND up.downlineID = a.accountID ";
                $Extend = " ";
    } else if( $Got['FOR'] == "DISABLED" ){
                $MidLane = " up.status=2 AND up.downlineID = a.accountID ";
                $Extend = "  ";
    } else if( $Got['FOR'] == "APP" ){
                $MidLane = " up.status=0 AND up.downlineID = a.accountID ";
                $Extend = " WHERE app.id = ".$Got['WHAT'];
    } else if( $Got['FOR'] == "CLUB" ){
                $MidLane = " up.status=0 AND up.downlineID = a.accountID ";
                $Extend = " WHERE c.idd = ".$Got['WHAT'];
    } else if( $Got['FOR'] == "ASUPLINE" ){
                $MidLane = " up.status=0 AND up.uplineID = a.accountID ";
                $Extend = " ";
    } else {
                $MidLane = " up.status=0 AND up.downlineID = a.accountID";
                 $Extend = " ";
    }

    $sql = "SELECT DISTINCT     app.id AS appID,
                                app.name AS appName,
                                app.status AS appStatus,
                                IF(app.status = 0, 'Active', IF(app.status=1, 'Pending', 'Disabled')) AS appStatusLabel,
                                (SELECT CONCAT(pp.path,ii.file) FROM images AS ii LEFT JOIN paths AS pp ON ii.type = pp.type WHERE app.image = ii.id) AS appImage,
                                c.idd AS clubIDD,
                                c.name AS clubName,
                                c.status AS clubStatus,
                                (SELECT CONCAT(pp.path,ii.file) FROM images AS ii LEFT JOIN paths AS pp ON ii.type = pp.type WHERE c.image = ii.id) AS clubImage,
                                IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')) AS clubStatusLabel,
                                a.accountID AS accountID,
                                a.accountNickname AS accountNickname,
                                a.accountRole AS accountRoleID,
                                r.name AS accountRole,
                                a.status AS accountStatus,
                                IF(a.status = 0, 'Active', IF(a.status=1, 'Pending', 'Disabled')) AS accountStatusLabel,
                                up.uplineID AS uplineID,
                                (SELECT ac.accountNickname FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineNickname,
                                (SELECT ac.accountRole FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineRoleID,
                                (SELECT ro.name FROM accounts AS ac LEFT JOIN default_roles AS ro ON ac.accountRole = ro.id WHERE ac.accountID = up.uplineID) AS uplineRole,
                                (SELECT ac.status FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineStatus,
                                (SELECT IF(ac.status = 0, 'Active', IF(ac.status=1, 'Pending', 'Disabled')) FROM accounts AS ac WHERE ac.accountID = up.uplineID) AS uplineStatusLabel,
                                up.percentage AS agencyRake,
                                up.downlineID AS downlineID,
                                (SELECT ac.accountNickname FROM accounts AS ac WHERE ac.accountID = up.downlineID) AS downlineNickname,
                                (SELECT ac.accountRole FROM accounts AS ac WHERE ac.accountID = up.downlineID) AS downlineRoleID,
                                (SELECT ro.name FROM accounts AS ac LEFT JOIN default_roles AS ro ON ac.accountRole = ro.id WHERE ac.accountID = up.downlineID) AS downlineRole,
                                (SELECT ac.status FROM accounts AS ac WHERE ac.accountID = up.downlineID) AS downlineStatus,
                                (SELECT IF(ac.status = 0, 'Active', IF(ac.status=1, 'Pending', 'Disabled')) FROM accounts AS ac WHERE ac.accountID = up.downlineID) AS downlineStatusLabel,
                                u.id AS accountuserID,
                                u.role AS accountuserRoleID,
                                (SELECT rol.name FROM users AS us LEFT JOIN default_roles AS rol ON us.role = rol.id WHERE us.id = a.userID) AS accountuserRole,
                                u.nickname AS accountuserNickname,
                                u.status AS accountuserStatus,
                                IF(u.status = 0, 'Active', IF(u.status=1, 'Pending', 'Disabled')) AS accountuserStatusLabel,
                                CONCAT(pa.path,img.file) AS accountImage
            FROM accounts AS a
            LEFT JOIN users AS u ON a.userID = u.id
            LEFT JOIN default_roles AS r ON a.accountRole = r.id
            LEFT JOIN applications AS app ON a.appID = app.id
            LEFT JOIN images AS img ON u.avatar = img.id
            LEFT JOIN paths AS pa ON img.type = pa.type
            LEFT JOIN uplines AS up ON ".$MidLane."
            LEFT JOIN clubs AS c ON up.clubID = c.idd
             ".$Extend;

             $result = $conx->query($sql);
             $data = [];
             $counter = 0;
         
             if ($result->num_rows > 0) {
                 while ($i = $result->fetch_assoc()) {
         
                     $counter = ++$counter;
         
                     $data[] = array(
                             'id'                        => $counter,
                             'appID'                     => $i['appID'],
                             'appName'                   => $i['appName'],
                             'appStatus'                 => $i['appStatus'],
                             'appStatusLabel'            => $i['appStatusLabel'],
                             'appImage'                  => $i['appImage'],
                             'clubIDD'                   => $i['clubIDD'],
                             'clubName'                  => $i['clubName'],
                             'clubStatus'                => $i['clubStatus'],
                             'clubStatusLabel'           => $i['clubStatusLabel'],
                             'clubImage'                 => $i['clubImage'],
                             'accountID'                 => $i['accountID'],
                             'accountNickname'           => $i['accountNickname'],
                             'accountRoleID'             => $i['accountRoleID'],
                             'accountRole'               => $i['accountRole'],
                             'accountStatusLabel'        => $i['accountStatusLabel'],
                             'accountStatus'             => $i['accountStatus'],
                             'accountImage'              => $i['accountImage'],
                             'uplineID'                  => $i['uplineID'],
                             'uplineNickname'            => $i['uplineNickname'],
                             'uplineRoleID'              => $i['uplineRoleID'],
                             'uplineRole'                => $i['uplineRole'],
                             'agencyRake'             => $i['agencyRake'],
                             'uplineuserID'              => $i['uplineuserID'],
                             'uplineuserNickname'        => $i['uplineuserNickname'],
                             'uplineStated'              => $i['uplineStated'],
                             'uplineStatus'              => $i['uplineStatus'],
                             'uplineStatusLabel'         => $i['uplineStatusLabel'],
                             'downlineID'                => $i['downlineID'],
                             'downlineNickname'          => $i['downlineNickname'],
                             'downlineRoleID'            => $i['downlineRoleID'],
                             'downlineRole'              => $i['downlineRole'],
                             'downlineStatus'            => $i['downlineStatus'],
                             'downlineStatusLabel'       => $i['downlineStatusLabel'],
                             'accountuserID'             => $i['accountuserID'],
                             'accountuserRoleID'         => $i['accountuserRoleID'],
                             'accountuserRole'           => $i['accountuserRole'],
                             'accountuserNickname'       => $i['accountuserNickname'],
                             'accountuserAvatar'         => $i['accountuserAvatar'],
                             'accountuserStatus'         => $i['accountuserStatus'],
                             'accountuserStatusLabel'    => $i['accountuserStatusLabel'],
                     );
         
                 }
             }
         
             echo json_encode($data, true);
         
          } else {
             echo json_encode("Err");
          }
         
          //Fetch all ACCOUNTS that is active including uplines, application, and club details
                                                                                                