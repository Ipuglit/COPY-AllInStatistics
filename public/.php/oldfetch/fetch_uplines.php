<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if ( $Got['FOR'] == "ALL" ){
            $Extend = " ";
    } else if( $Got['FOR'] == "MY" ){
            $Extend = " WHERE u.id = $verifyID ";
     } else if( $Got['FOR'] == "ACTIVEPENDING" ){
            $Extend = " WHERE u.status!=2 ";
    } else {
            $Extend = " WHERE u.id = 0 ";
    }

    $sql = "SELECT up.id AS id,
                    up.clubID AS clubIDD,
                    c.id AS clubID,
                    up.downlineID AS downacctID,
                    up.uplineID AS upacctID,
                    up.status AS status,
                    FROM_UNIXTIME(up.stated, '%M %D, %Y %h:%i:%s') AS stated,
                    up.stated AS eStated,
                    up.percentage AS percentage,
                    app.id as appID,
                    app.name AS appName,
                    CONCAT(p.path,i.file) AS appImage,
                    c.name AS clubName
            FROM uplines AS up
            LEFT JOIN accounts AS a ON up.downlineID = a.accountID
            LEFT JOIN users AS u ON a.userID = u.id
            LEFT JOIN clubs AS c ON up.clubID = c.idd
            LEFT JOIN applications AS app ON c.appID = app.id
            LEFT JOIN images AS i ON app.image = i.id
            LEFT JOIN paths AS p ON i.type = p.type
                ".$Extend;

    $result = $conx->query($sql);
    $feedback = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                if($i['status']==0){
                    $status = "Active";
                } else if($i['status']==1){
                    $status = "Pending";
                } else {
                    $status = "Inactive";
                }

                $downline = "SELECT u.nickname          AS downuserNickname,
                                    a.accountNickname   AS downacctNickname,
                                    u.status            AS downuserStatus,
                                    a.status            AS downacctStatus,
                                    r.name              AS downuserRole,
                                    (SELECT name FROM default_roles WHERE id=a.accountRole ) AS downacctRole,
                                    u.id                AS downuserID,
                                    CONCAT(p.path,i.file) AS downAvatar
                            FROM accounts AS a
                            LEFT JOIN users AS u ON a.userID = u.id
                            LEFT JOIN default_roles AS r ON u.role = r.id
                            LEFT JOIN images AS i ON u.avatar = i.id
                            LEFT JOIN paths AS p ON i.type = p.type
                            WHERE a.accountID =".$i['downacctID'];

                $upline = "SELECT   u.nickname          AS upuserNickname,
                                    a.accountNickname   AS upacctNickname,
                                    u.status            AS upuserStatus,
                                    a.status            AS upacctStatus,
                                    r.name              AS upuserRole,
                                    (SELECT name FROM default_roles WHERE id=a.accountRole ) AS upacctRole,
                                    u.id                AS upuserID,
                                    CONCAT(p.path,i.file) AS upAvatar
                            FROM accounts AS a
                            LEFT JOIN users AS u ON a.userID = u.id
                            LEFT JOIN default_roles AS r ON u.role = r.id
                            LEFT JOIN images AS i ON u.avatar = i.id
                            LEFT JOIN paths AS p ON i.type = p.type
                            WHERE a.accountID =".$i['upacctID'];

            $get_downline = $conx->query($downline);
                    while ($ii = $get_downline->fetch_assoc()) {
                    $downuserNickname =         $ii['downuserNickname'];
                    $downacctNickname =         $ii['downacctNickname'];
                    $downuserRole =             $ii['downuserRole'];
                    $downacctRole =             $ii['downacctRole'];
                    $downuserID =               $ii['downuserID'];
                    $downAvatar =               $ii['downAvatar'];
                    if($ii['downuserStatus']==0){
                        $downuserStatus = "Active";
                    } else if($ii['downuserStatus']==1){
                        $downuserStatus = "Pending";
                    } else {
                        $downuserStatus = "Inactive";
                    }
                    if($ii['downacctStatus']==0){
                        $downacctStatus = "Active";
                    } else if($ii['downacctStatus']==1){
                        $downacctStatus = "Pending";
                    } else {
                        $downacctStatus = "Inactive";
                    }
                }

            $get_upline = $conx->query($upline);
                    while ($iii = $get_upline->fetch_assoc()) {
                    $upuserNickname =         $iii['upuserNickname'];
                    $upacctNickname =         $iii['upacctNickname'];
                    $upuserRole =             $iii['upuserRole'];
                    $upacctRole =             $iii['upacctRole'];
                    $upuserID =               $iii['upuserID'];
                    $upAvatar =               $iii['upAvatar'];
                    if($iii['upuserStatus']==0){
                        $upuserStatus = "Active";
                    } else if($iii['upuserStatus']==1){
                        $upuserStatus = "Pending";
                    } else {
                        $upuserStatus = "Inactive";
                    }
                    if($iii['upacctStatus']==0){
                        $upacctStatus = "Active";
                    } else if($iii['upacctStatus']==1){
                        $upacctStatus = "Pending";
                    } else {
                        $upacctStatus = "Inactive";
                    }
                }

        $Stated = $i['stated'];
        $utc_timezone = new DateTimeZone("UTC");
        $dateTimeZone = new DateTimeZone($verifyZone);
        $datetime  = new DateTime($Stated, $utc_timezone);
        $datetime->setTimezone($dateTimeZone);
        $stateds = $datetime->format('F d, Y h:i:s A');

//$dateTime = new DateTime($i['stated'], $timezone);
//$stateds = date_format($i['stated'],'y-m-d H:i:sP');

                $feedback[] = array(
                    'id'                => $i['id'],
                    'clubID'            => $i['clubID'],
                    'clubIDD'           => $i['clubIDD'],
                    'clubName'          => $i['clubName'],
                    'appID'             => $i['appID'],
                    'appName'           => $i['appName'],
                    'appImage'          => $i['appImage'],
                    'percentage'        => $i['percentage'],
                    'stated'            => $stateds,
                    'statusLabel'       => $status,
                    'status'            => $i['status'],

                    'downacctID'        => $i['downacctID'],
                    'downacctNickname'  => $downacctNickname,
                    'downacctRole'      => $downacctRole,
                    'downacctStatus'    => $downacctStatus,

                    'downuserID'        => $downuserID,
                    'downuserNickname'  => $downuserNickname,
                    'downuserRole'      => $downuserRole,
                    'downuserStatus'    => $downuserStatus,
                    'downAvatar'        => $downAvatar,

                    'upacctID'        => $i['upacctID'],
                    'upacctNickname'  => $upacctNickname,
                    'upacctRole'      => $upacctRole,
                    'upacctStatus'    => $upacctStatus,

                    'upuserID'        => $upuserID,
                    'upuserNickname'  => $upuserNickname,
                    'upuserRole'      => $upuserRole,
                    'upuserStatus'    => $upuserStatus,
                    'upAvatar'        => $upAvatar,

                );
            }
        } else {
            $feedback = "Err";
        }
 } else {
    $feedback = "Err";
 }

 echo json_encode($feedback, true);

?>
~