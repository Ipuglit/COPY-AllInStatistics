<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){


        if ( $Got['STATUS'] == "ALL" && $Got['TYPE'] == "ALL" ){

            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY u.id ".$Got['SORT'];
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " WHERE CONCAT(u.name,' ',u.type,' ',IF(u.status = 0, 'Active', IF(u.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM clubs WHERE unionID = u.id) ) LIKE '%".$Got['SEARCH']."%' ";
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

            if ( $Got['TYPE'] != "ALL"){
                $Extend_Type = " AND u.type = '".$Got['TYPE']."' ";
            } else {
                $Extend_Type = " ";
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " AND CONCAT(u.name,' ',u.type,' ',IF(u.status = 0, 'Active', IF(u.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM clubs WHERE unionID = u.id) ) LIKE '%".$Got['SEARCH']."%' ";
            } else {
                $Extend_Search = " ";
            }

            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY id ".$Got['SORT'];
            }

            $Extend = " WHERE ".$Extend_Status. " ".$Extend_Type." ".$Extend_Search." ".$Extend_Sort;
        }

        $sql = "SELECT u.id AS id,
                        u.name AS name,
                        u.type AS type,
                        u.details AS details,
                        u.logo AS imageID,
                        u.status AS status,
                        IF(u.status = 0, 'Active', IF(u.status=1, 'Pending', 'Disabled')) AS statusLabel,
                        i.file AS imageName,
                        p.path AS imagePath,
                        CONCAT(p.path,i.file) AS imageFull,
                        (SELECT COUNT(id) FROM clubs WHERE unionID = u.id) AS clubsCount
                    FROM unions AS u
                    LEFT JOIN images AS i ON u.logo = i.id
                    LEFT JOIN paths AS p ON i.type = p.type
                    ".$Extend;

    $result = $conx->query($sql);
    $feedback = [];

    $counted = 0;

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {
                $counted++;
                $feedback[] = array(
                                'id' =>             $i['id'],
                                'increment' =>      $counted,
                                'name' =>           $i['name'],
                                'type' =>           $i['type'],
                                'details' =>        $i['details'],
                                'imageID' =>        $i['imageID'],
                                'imageFull' =>      $i['imageFull'],
                                'status' =>         $i['status'],
                                'statusLabel' =>    $i['statusLabel'],
                                'clubsCount' =>     $i['clubsCount'],
                            );
            }
        }

 } else {
    $feedback = "NOTFOUND";
 }



 echo json_encode($feedback, true);