<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

        if ( $Got['FOR'] == "ALL" ){
                $Extend = " ";
        } else if( $Got['FOR'] == "ACTIVEPENDING" ){
                $Extend = " WHERE a.status !=2 ";
        } else if( $Got['FOR'] == "ACTIVE" ){
                $Extend = " WHERE a.status = 0 ";
        } else if( $Got['FOR'] == "PENDING" ){
                $Extend = " WHERE a.status = 1 ";
        } else if( $Got['FOR'] == "DISABLED" ){
                $Extend = " WHERE a.status = 2 ";
        } else if( $Got['FOR'] == "MY" ){
                $Extend = " WHERE u.id = $verifyID ";
        } else if( $Got['FOR'] == "MYACTIVEPENDING" ){
                $Extend = " WHERE u.id = $verifyID AND a.status !=2 ";
        } else if( $Got['FOR'] == "MYACTIVE" ){
                $Extend = " WHERE u.id = $verifyID AND a.status = 0 ";
        } else if( $Got['FOR'] == "MYPENDING" ){
                $Extend = " WHERE u.id = $verifyID AND a.status = 1 ";
        } else if( $Got['FOR'] == "MYDISABLED" ){
                $Extend = " WHERE u.id = $verifyID AND a.status = 2 ";
        } else if( $Got['FOR'] == "SEARCHUSER" ){
                $Extend = " WHERE u.id = ".$GOT['WHAT']." AND a.status = ".$GOT['STATUS'];
        } else if( $Got['FOR'] == "SEARCHACCOUNT" ){
                $Extend = " WHERE a.accountID = ".$GOT['WHAT']." AND a.status = ".$GOT['STATUS'];
        } else if( is_numeric($Got['FOR']) ){
                $Extend = " RIGHT JOIN uplines AS up ON (a.accountID = up.downlineID OR a.accountID = up.uplineID)
                            LEFT JOIN clubs AS c ON up.clubID = c.idd
                            WHERE c.idd = ".$Got['FOR']." AND a.accountID!=".$Got['DOWN'];
        } else {
                $Extend = " WHERE u.id = 0 ";
        }

    $sql = "SELECT DISTINCT
                                                                a.id AS id,
                                a.accountID AS accountID,
                                a.accountNickname AS accountNickname,
                                r.name AS accountRole,
                                a.accountRole AS accountRoleID,
                                a.status AS status,
                                IF(a.status = 0, 'Active', IF(a.status=1, 'Pending', 'Disabled')) AS statusLabel,
                                (SELECT COUNT(upl.uplineID) FROM uplines AS upl WHERE a.accountID = upl.uplineID AND upl.status=0 ) AS accountAsUpline,
                                (SELECT COUNT(upl.uplineID) FROM uplines AS upl WHERE a.accountID = upl.downlineID AND upl.status=0 ) AS accountAsDownline,
                                (SELECT COUNT(upl.clubID) FROM uplines AS upl WHERE (a.accountID = upl.uplineID OR a.accountID = upl.downlineID) AND upl.status=0 ) AS accountClubs,
                                u.id AS userID,
                                u.role AS userRole,
                                u.nickname AS userNickname,
                                CONCAT(pa.path,img.file) AS avatar,
                                app.id AS appID,
                                app.name AS appName,
                                (SELECT CONCAT(pp.path,ii.file) FROM applications AS aa
                                                LEFT JOIN images AS ii ON aa.image = ii.id
                                                LEFT JOIN paths AS pp ON ii.type = pp.type
                                                WHERE aa.id = a.appID ) AS appImage
            FROM accounts AS a
            LEFT JOIN users AS u ON a.userID = u.id
            LEFT JOIN default_roles AS r ON a.accountRole = r.id
            LEFT JOIN applications AS app ON a.appID = app.id
            LEFT JOIN images AS img ON u.avatar = img.id
            LEFT JOIN paths AS pa ON img.type = pa.type
            ".$Extend;

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $data[] = array(
                    'id' =>                 $i['id'],
                    'accountID' =>          $i['accountID'],
                    'accountNickname' =>    $i['accountNickname'],
                    'accountRole' =>        $i['accountRole'],
                    'accountRoleID' =>      $i['accountRoleID'],
                    'accountAsDownline' =>  $i['accountAsUpline'],
                    'accountAsUpline' =>    $i['accountAsDownline'],
                    'accountClubsCount' =>  $i['accountClubs'],
                    'userID' =>             $i['userID'],
                    'userRole' =>           $i['userRole'],
                    'userNickname' =>       $i['userNickname'],
                    'userAvatar' =>         $i['avatar'],
                    'appID' =>              $i['appID'],
                    'appName' =>            $i['appName'],
                    'appImage' =>            $i['appImage'],
                    'statusLabel' =>        $i['statusLabel'],
                    'status' =>             $i['status'],
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("Err");
 }

?>