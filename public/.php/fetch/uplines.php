<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

        if( $Got['FOR'] == "ALL"){
            $Extend_For = " WHERE up.id IS NOT NULL ";
        } else {
            $Extend_For = " WHERE a.userID = ".$verifyID." ";

        }

        if ( $Got['STATUS'] == "ALL" && $Got['CLUB'] == "ALL" && $Got['APP'] == "ALL" ){

            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY up.id ".$Got['SORT'];
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " AND CONCAT(c.name,' ',c.id,' ',app.name, ' ',up.downlineID,' ',up.uplineID,' ',up.percentage,
                                                ' ',IF(up.status = 0, 'Active', IF(up.status=1, 'Pending', 'Disabled')),
                                                ' ',(SELECT rr.name FROM accounts AS aa
                                                                LEFT JOIN default_roles AS rr ON aa.accountRole = rr.id
                                                                    WHERE aa.accountID = up.downlineID),
                                                ' ',(SELECT rr.name FROM accounts AS aa
                                                                LEFT JOIN default_roles AS rr ON aa.accountRole = rr.id
                                                                    WHERE aa.accountID = up.uplineID),
                                                ' ',(SELECT aa.accountNickname FROM accounts AS aa WHERE aa.accountID = up.downlineID),
                                                ' ',(SELECT aa.accountNickname FROM accounts AS aa WHERE aa.accountID = up.uplineID)
                                                                    ) LIKE '%".$Got['SEARCH']."%' ";
            } else {
                $Extend_Search = " ";
            }

            $Extend = " ".$Extend_For." ".$Extend_Search." ".$Extend_Sort;

        } else {

            if ( $Got['STATUS'] == "ACTIVE"){
                $Extend_Status = " up.status=0 ";
            } else if ( $Got['STATUS'] == "ACTIVEPENDING"){
                $Extend_Status = " up.status!=2 ";
            } else if ( $Got['STATUS'] == "PENDING"){
                $Extend_Status = " up.status=1 ";
            } else if ( $Got['STATUS'] == "DISABLED"){
                $Extend_Status = " up.status=2 ";
            } else if ( $Got['STATUS'] == "ALL"){
                $Extend_Status = " up.status IN (0, 1, 2) ";
            } else {
                $Extend_Status = " up.status IN (0, 1, 2) ";
            }

            if ( $Got['CLUB'] != "ALL"){
                $Extend_Club = " AND c.id = '".$Got['CLUB']."' ";
            } else {
                $Extend_Club = " ";
            }

            if ( $Got['APP'] != "ALL"){
                $Extend_App = " AND a.appID = '".$Got['APP']."' ";
            } else {
                $Extend_App = " ";
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " AND CONCAT(c.name,' ',c.id,' ',app.name, ' ',up.downlineID,' ',up.uplineID,' ',up.percentage,
                                                ' ',IF(up.status = 0, 'Active', IF(up.status=1, 'Pending', 'Disabled')),
                                                ' ',(SELECT rr.name FROM accounts AS aa
                                                                LEFT JOIN default_roles AS rr ON aa.accountRole = rr.id
                                                                    WHERE aa.accountID = up.downlineID),
                                                ' ',(SELECT rr.name FROM accounts AS aa
                                                                LEFT JOIN default_roles AS rr ON aa.accountRole = rr.id
                                                                    WHERE aa.accountID = up.uplineID),
                                                ' ',(SELECT aa.accountNickname FROM accounts AS aa WHERE aa.accountID = up.downlineID),
                                                ' ',(SELECT aa.accountNickname FROM accounts AS aa WHERE aa.accountID = up.uplineID)
                                                                    ) LIKE '%".$Got['SEARCH']."%' ";
            } else {
                $Extend_Search = " ";
            }

            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY up.id ".$Got['SORT'];
            }

            $Extend = " ".$Extend_For." AND ".$Extend_Status. " ".$Extend_Club." ".$Extend_App." ".$Extend_Search." ".$Extend_Sort;
        }

$sql = "SELECT up.id AS id,
                    up.clubID AS clubIDD,
                    c.id AS clubID,
                    c.name AS clubName,
                    up.downlineID AS playerID,
                    (SELECT aa.accountNickname FROM accounts AS aa WHERE aa.accountID = up.downlineID) AS playerNickname,
                    (SELECT aa.accountRole FROM accounts AS aa WHERE aa.accountID = up.downlineID) AS playerRoleID,
                    (SELECT rr.name FROM accounts AS aa
                                                                                        LEFT JOIN default_roles AS rr ON aa.accountRole = rr.id
                                                                                                                        WHERE aa.accountID = up.downlineID) AS playerRole,
                                                  (SELECT IF(aa.status = 0, 'Active', IF(aa.status=1, 'Pending', 'Disabled')) FROM accounts AS aa WHERE aa.accountID = up.downlineID) AS playerStatusLabel,
                    (SELECT uu.id FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                                                        WHERE aa.accountID = up.downlineID) AS playerUserID,
                    (SELECT uu.nickname FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                                                        WHERE aa.accountID = up.downlineID) AS playerUserNickname,
                    (SELECT rr.name FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                        LEFT JOIN default_roles AS rr ON uu.role = rr.id
                                                                                                                        WHERE aa.accountID = up.downlineID) AS playerUserRole,
                    (SELECT CONCAT(pp.path,ii.file) FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                                    LEFT JOIN images AS ii ON uu.avatar = ii.id
                                                                                                    LEFT JOIN paths AS pp ON ii.type = pp.type
                                                                                                                        WHERE aa.accountID = up.downlineID) AS playerUserAvatar,
                    up.uplineID AS uplineID,
                    (SELECT aa.accountNickname FROM accounts AS aa WHERE aa.accountID = up.uplineID) AS uplineNickname,
                    (SELECT aa.accountRole FROM accounts AS aa WHERE aa.accountID = up.uplineID) AS uplineRoleID,
                    (SELECT rr.name FROM accounts AS aa
                                                                                        LEFT JOIN default_roles AS rr ON aa.accountRole = rr.id
                                                                                                                        WHERE aa.accountID = up.uplineID) AS uplineRole,
                                                        (SELECT IF(aa.status = 0, 'Active', IF(aa.status=1, 'Pending', 'Disabled')) FROM accounts AS aa WHERE aa.accountID = up.uplineID) AS uplineStatusLabel,
                    (SELECT uu.id FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                                                        WHERE aa.accountID = up.uplineID) AS uplineUserID,
                    (SELECT uu.nickname FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                                                        WHERE aa.accountID = up.uplineID) AS uplineUserNickname,
                    (SELECT rr.name FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                        LEFT JOIN default_roles AS rr ON uu.role = rr.id
                                                                                                                        WHERE aa.accountID = up.downlineID) AS uplineUserRole,
                    (SELECT CONCAT(pp.path,ii.file) FROM accounts AS aa
                                                                                        LEFT JOIN users AS uu ON aa.userID = uu.id
                                                                                                    LEFT JOIN images AS ii ON uu.avatar = ii.id
                                                                                                    LEFT JOIN paths AS pp ON ii.type = pp.type
                                                                                                                        WHERE aa.accountID = up.uplineID) AS uplineUserAvatar,
                    up.status AS status,
                    IF(up.status = 0, 'Active', IF(up.status=1, 'Pending', 'Disabled')) AS statusLabel,
                    FROM_UNIXTIME(up.stated, '%M %D, %Y %h:%i:%s') AS stated,
                    up.stated AS eStated,
                    up.percentage AS percentage,
                    app.id as appID,
                    app.name AS appName,
                    CONCAT(p.path,i.file) AS appImage

            FROM uplines AS up
            LEFT JOIN accounts AS a ON up.downlineID = a.accountID
            LEFT JOIN users AS u ON a.userID = u.id
            LEFT JOIN clubs AS c ON up.clubID = c.idd
            LEFT JOIN applications AS app ON c.appID = app.id
            LEFT JOIN images AS i ON app.image = i.id
            LEFT JOIN paths AS p ON i.type = p.type
            ".$Extend;

    $result = $conx->query($sql);
    $data = [];
    $counted = 0;

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {
                $counted++;
                $data[] = array(
                    'id'                        => $i['id'],
                    'increment'                 => $counted,
                    'clubID'                    => $i['clubID'],
                    'clubIDD'                   => $i['clubIDD'],
                    'clubName'                  => $i['clubName'],
                    'appID'                     => $i['appID'],
                    'appName'                   => $i['appName'],
                    'appImage'                  => $i['appImage'],
                    'percentage'                => $i['percentage'],
                    'eStated'                   => $i['eStated'],
                    'stated'                    =>  $stateds,
                    'statusLabel'               => $i['statusLabel'],
                    'status'                    => $i['status'],

                    'playerID'                  => $i['playerID'],
                    'playerNickname'            => $i['playerNickname'],
                    'playerRoleID'              => $i['playerRoleID'],
                    'playerRole'                => $i['playerRole'],
                    'playerStatusLabel'         => $i['playerStatusLabel'],
                    'playerUserID'              => $i['playerUserID'],
                    'playerUserNickname'        => $i['playerUserNickname'],
                    'playerUserRole'            => $i['playerUserRole'],
                    'playerAvatar'              => $i['playerUserAvatar'],

                    'uplineID'                  => $i['uplineID'],
                    'uplineNickname'            => $i['uplineNickname'],
                    'uplineRoleID'              => $i['uplineRoleID'],
                    'uplineRole'                => $i['uplineRole'],
                    'uplineStatusLabel'         => $i['uplineStatusLabel'],
                    'uplineUserID'              => $i['uplineUserID'],
                    'uplineUserNickname'        => $i['uplineUserNickname'],
                    'uplineUserRole'            => $i['uplineUserRole'],
                    'uplineAvatar'              => $i['uplineUserAvatar'],
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("NOTFOUND");
 }

?>