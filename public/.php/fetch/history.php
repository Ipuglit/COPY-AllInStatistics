<?php
    include '../conx.php';
    include '../verify/verify.php';

    if($Verified == "FOUND"){

            if( $Got['FOR'] == "MINE"){
                $Extend_For = " WHERE h.userID = ".$verifyID." ";
            } else {
                $Extend_For = " WHERE h.userID IS NOT NULL ";
            }

            if( !empty($Got['LIMIT']) ){
                $Extend_Limit = " LIMIT ".$Got['LIMIT']." ";
            } else {
                $Extend_Limit = " LIMIT 300 ";
            }

            if ( $Got['USER'] == "ALL" && $Got['GADGET'] == "ALL" && $Got['ACTION'] == "ALL" && $Got['DASH'] == "ALL" ){

                if ( $Got['SORTBY'] != "NONE" ){
                    $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
                } else {
                    $Extend_Sort = " ORDER BY h.datetime ".$Got['SORT'];
                }

                if ( !empty($Got['SEARCH']) ){
                    $Extend_Search = " AND CONCAT(h.userID,' ',u.nickname,' ', r.name, ' ',h.gadget,' ',h.timezone,' ',h.action,' ',h.dash,' ',h.details,' ',FROM_UNIXTIME(h.datetime, '%M %D, %Y %h:%i:%s')) LIKE '%".$Got['SEARCH']."%' ";
                } else {
                    $Extend_Search = " ";
                }

                $Extend = " ".$Extend_For." ".$Extend_Search." ".$Extend_Sort." ".$Extend_Limit;

            } else {

                if ( $Got['USER'] != "ALL"){
                    $Extend_User = " AND h.userID = '".$Got['USER']."' ";
                } else {
                    $Extend_User = " ";
                }

                if ( $Got['GADGET'] != "ALL"){
                    $Extend_Gadget = " AND h.gadget = '".$Got['GADGET']."' ";
                } else {
                    $Extend_Gadget = " ";
                }

                if ( $Got['ACTION'] != "ALL"){
                    $Extend_Action = " AND h.action = '".$Got['ACTION']."' ";
                } else {
                    $Extend_Action = " ";
                }

                if ( $Got['DASH'] != "ALL"){
                    $Extend_OnFor = " AND h.dash = '".$Got['DASH']."' ";
                } else {
                    $Extend_OnFor = " ";
                }

                if ( !empty($Got['SEARCH']) ){
                    $Extend_Search = " AND CONCAT(h.userID,' ',u.nickname,' ', r.name, ' ',h.gadget,' ',h.timezone,' ',h.action,' ',h.dash,' ',h.details,' ',FROM_UNIXTIME(h.datetime, '%M %D, %Y %h:%i:%s')) LIKE '%".$Got['SEARCH']."%' ";
                } else {
                    $Extend_Search = " ";
                }

                if ( $Got['SORTBY'] != "NONE" ){
                    $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
                } else {
                    $Extend_Sort = " ORDER BY h.datetime ".$Got['SORT'];
                }

                $Extend = " ".$Extend_For." AND ".$Extend_User. " ".$Extend_Gadget." ".$Extend_Action." ".$Extend_OnFor." ".$Extend_Search." ".$Extend_Sort." ".$Extend_Limit;
            }


            $sql = "SELECT h.id AS historyID,
                        h.userID AS userID,
                        u.nickname AS userNickname,
                        r.name AS userRole,
                        img.file AS image,
                        pa.path AS path,
                        h.datetime AS etime,
                        FROM_UNIXTIME(h.datetime, '%M %D, %Y %h:%i:%s') AS dtime,
                        h.gadget AS gadget,
                        h.timezone AS timezone,
                        h.action AS action,
                        h.dash AS dash,
                        h.details AS details
                FROM history AS h
                LEFT JOIN users AS u ON u.id = h.userID
                LEFT JOIN default_roles AS r ON r.id = h.userRole
                LEFT JOIN images AS img ON u.avatar = img.id
                LEFT JOIN paths AS pa ON img.type = pa.type".
                $Extend;

        $result = $conx->query($sql);
        $data = [];

            if ($result->num_rows > 0) {
                while ($i = $result->fetch_assoc()) {

                    $DT             = $i['dtime'];
                    $UTC            = new DateTimeZone("UTC");
                    $TZ             = new DateTimeZone($verifyZone);
                    $datetime       = new DateTime($DT, $UTC);
                    $datetime->setTimezone($TZ);
                    $DTime          = $datetime->format('F d, Y h:i:s A (P)');

                    $data[] = array(
                        'id' =>             $i['historyID'],
                        'userID' =>         $i['userID'],
                        'userNickname' =>   $i['userNickname'],
                        'userRole' =>       $i['userRole'],
                        'userImage' =>      $i['path'].$i['image'],
                        'datetime' =>       $DTime,
                        'edatetime' =>      $i['etime'],
                        'gadget' =>         $i['gadget'],
                        'timezone' =>       $i['timezone'],
                        'action' =>         $i['action'],
                        'dash' =>           $i['dash'],
                        'details' =>        $i['details'],
                    );
                }
            }
        echo json_encode($data, true);
    } else {
        echo json_encode("NOTFOUND");
    }

?>
~