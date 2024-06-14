<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){


    if ( $Got['STATUS'] == "ALL" && $Got['ROLE'] == "EVERYONE"  ){
            
        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " GROUP BY u.id ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " GROUP BY u.id ORDER BY u.id ".$Got['SORT'];
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " WHERE CONCAT(u.nickname,' ',u.email,' ', u.telegram, ' ', u.username,' ',r.name) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        $Extend = " ".$Extend_Search." ".$Extend_Sort;

    } else {

        if ( $Got['STATUS'] == "ACTIVE"){
            $Extend_Status = " u.status=0 ";
        } else if ( $Got['STATUS'] == "ACTIVEPENDING"){
            $Extend_Status = " u.status!=2 ";
        } else if ( $Got['STATUS'] == "PENDING"){
            $Extend_Status = " u.status=1 ";
        } else if ( $Got['STATUS'] == "DISABLED"){
            $Extend_Status = " u.status=2 ";
        } else if ( $Got['STATUS'] == "ALL"){
            $Extend_Status = " u.status IN (0, 1, 2) ";
        } else {
            $Extend_Status = " u.status IN (0, 1, 2) ";
        }

        if ( $Got['ROLE'] != "EVERYONE"){
            $Extend_Role = " AND u.role = '".$Got['ROLE']."' ";
        } else {
            $Extend_Role = " ";
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " WHERE CONCAT(u.nickname,' ',u.email,' ', u.telegram, ' ', u.username,' ',r.name, ' ',(SELECT COUNT(id) FROM accounts WHERE userID=u.id AND status=0)) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " GROUP BY u.id ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " GROUP BY u.id ORDER BY u.id ".$Got['SORT'];
        }

        $Extend = " WHERE ".$Extend_Status. " ".$Extend_Role." ".$Extend_Search." ".$Extend_Sort;
    }


    $sql = "SELECT  u.id AS id,
                    u.nickname AS nickname,
                    u.email AS email,
                    u.telegram AS telegram,
                    u.username as username,
                    u.password AS password,
                    u.avatar AS avatarID,
                    u.status AS status,
                    IF(u.status = 0, 'Active', IF(u.status=1, 'Pending', 'Disabled')) AS statusLabel,
                    r.id AS roleID,
                    r.name AS roleName,
                    CONCAT((SELECT path FROM paths WHERE TYPE = i.type),i.file) AS avatarFull,
                    COUNT(acc.userID) AS totalAccounts,
                    (SELECT COUNT(id) FROM accounts WHERE userID=u.id AND status=0) AS activeAccounts,
                    (SELECT COUNT(id) FROM accounts WHERE userID=u.id AND status=1) AS pendingAccounts,
                    (SELECT COUNT(id) FROM accounts WHERE userID=u.id AND status=2) AS disabledAccounts
                FROM users AS u
                LEFT JOIN accounts AS acc ON u.id = acc.userID AND acc.status=0
                LEFT JOIN default_roles AS r ON u.role = r.id
                LEFT JOIN images AS i ON u.avatar = i.id
                LEFT JOIN paths AS p ON i.type = p.type
                ".$Extend;

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $data[] = array(
                    'id'                    => $i['id'],
                    'roleID'                => $i['roleID'],
                    'roleName'              => $i['roleName'],
                    'nickname'              => $i['nickname'],
                    'email'                 => $i['email'],
                    'telegram'              => $i['telegram'],
                    'username'              => $i['username'],
                    'password'              => $i['password'],
                    'avatarID'              => $i['avatarID'],
                    'avatarFull'            => $i['avatarFull'],
                    'statusLabel'           => $i['statusLabel'],
                    'status'                => $i['status'],
                    'totalAccounts'         => $i['totalAccounts'],
                    'activeAccounts'         => $i['activeAccounts'],
                    'pendingAccounts'        => $i['pendingAccounts'],
                    'disabledAccounts'      => $i['disabledAccounts'],
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("NOTFOUND");
 }

?>