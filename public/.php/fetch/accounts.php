<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

        if( $Got['FOR'] == "ALL"){
            $Extend_For = " WHERE a.userID = ".$verifyID." ";
        } else {
            $Extend_For = " WHERE a.id IS NOT NULL ";
        }

        if ( $Got['STATUS'] == "ALL" && $Got['ROLE'] == "EVERYONE" && $Got['APP'] == "ALL" ){
            
            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY id ".$Got['SORT'];
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " AND CONCAT(a.accountID,' ',a.accountNickname,' ', r.name, ' ', app.name,' ',a.status) LIKE '%".$Got['SEARCH']."%' ";
            } else {
                $Extend_Search = " ";
            }

            $Extend = " ".$Extend_For." ".$Extend_Search." ".$Extend_Sort;

        } else {

            if ( $Got['STATUS'] == "ACTIVE"){
                $Extend_Status = " a.status=0 ";
            } else if ( $Got['STATUS'] == "ACTIVEPENDING"){
                $Extend_Status = " a.status!=2 ";
            } else if ( $Got['STATUS'] == "PENDING"){
                $Extend_Status = " a.status=1 ";
            } else if ( $Got['STATUS'] == "DISABLED"){
                $Extend_Status = " a.status=2 ";
            } else if ( $Got['STATUS'] == "ALL"){
                $Extend_Status = " a.status IN (0, 1, 2) ";
            } else {
                $Extend_Status = " a.status IN (0, 1, 2) ";
            }

            if ( $Got['ROLE'] != "EVERYONE"){
                $Extend_Role = " AND a.accountRole = '".$Got['ROLE']."' ";
            } else {
                $Extend_Role = " ";
            }

            if ( $Got['APP'] != "ALL"){
                $Extend_App = " AND a.appID = '".$Got['APP']."' ";
            } else {
                $Extend_App = " ";
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " AND CONCAT(a.accountID,' ',a.accountNickname, ' ', r.name, ' ', app.name,' ',a.status, ' ',statusLabel) LIKE '%".$Got['SEARCH']."%' ";
            } else {
                $Extend_Search = " ";
            }

            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY id ".$Got['SORT'];
            }

            $Extend = " ".$Extend_For." AND ".$Extend_Status. " ".$Extend_Role." ".$Extend_App." ".$Extend_Search." ".$Extend_Sort;
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
    $counted = 0;

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {
                $counted++;
                $data[] = array(
                    'id' =>                 $i['id'],
                    'increment' =>          $counted,
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
    echo json_encode("NOTFOUND");
 }

?>