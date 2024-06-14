<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if ( $Got['STATUS'] == "ALL" && $Got['COMPANY'] == "ALL" ){
            
        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " ORDER BY a.id ".$Got['SORT'];
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " WHERE CONCAT(a.name,' ',c.name,' ', a.details, ' ', IF(a.status = 0, 'Active', IF(a.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM accounts WHERE appID = a.id)) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        $Extend = " ".$Extend_Search." ".$Extend_Sort;

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

        if ( $Got['COMPANY'] != "ALL"){
            $Extend_App = " AND c.name = '".$Got['COMPANY']."' ";
        } else {
            $Extend_App = " ";
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " WHERE CONCAT(a.name,' ',c.name,' ', a.details, ' ', IF(a.status = 0, 'Active', IF(a.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM accounts WHERE appID = a.id)) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " ORDER BY a.id ".$Got['SORT'];
        }

        $Extend = " WHERE ".$Extend_Status. " ".$Extend_Role." ".$Extend_App." ".$Extend_Search." ".$Extend_Sort;
    }

         $sql = "SELECT DISTINCT
                    a.id AS id,
                    a.name AS name,
                    p.path AS imagePath,
                    i.file AS image,
                    i.id AS imageID,
                    c.id AS companyID,
                    c.name AS company,
                    a.details AS details,
                    (SELECT COUNT(id) FROM accounts WHERE appID = a.id) AS allAccounts,
                    (SELECT COUNT(id) FROM accounts WHERE appID = a.id AND status = 0) AS activeAccounts,
                    (SELECT COUNT(id) FROM accounts WHERE appID = a.id AND status = 1) AS pendingAccounts,
                    IF(a.status = 0, 'Active', IF(a.status=1, 'Pending', 'Disabled')) AS statusLabel,
                    a.status AS status
                FROM applications AS a
                LEFT JOIN accounts AS ac ON ac.appID = a.id AND ac.status = 0
                LEFT JOIN company AS c ON a.company = c.id
                LEFT JOIN images AS i ON i.id = a.image
                left JOIN paths AS p ON p.type = i.type ".$Extend_Status;

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                 $sql2 = "SELECT COUNT(id) AS counted FROM accounts WHERE appID =".$i['id'];
                 $result2 = $conx->query($sql2);
                        if ($result2->num_rows > 0) {
                                while ($ii = $result2->fetch_assoc()) {
                                        $counted = $ii['counted'];
                                }
                        } else {
                                $counted = "0";
                        }

                $data[] = array(
                    'id' =>             $i['id'],
                    'name' =>           $i['name'],
                    'imageID' =>        $i['imageID'],
                    'imagePath' =>      $i['imagePath'],
                    'image' =>          $i['image'],
                    'imageFull' =>      $i['imagePath'].$i['image'],
                    'companyID' =>      $i['companyID'],
                    'company' =>        $i['company'],
                    'details' =>        $i['details'],
                    'statusLabel' =>    $i['statusLabel'],
                    'status' =>         $i['status'],
                    'allAccounts' =>    $i['allAccounts'],
                    'activeAccounts' =>    $i['activeAccounts'],
                    'pendingAccounts' =>    $i['pendingAccounts'],
                    'userCount' =>      $userCount,
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("NOTFOUND");
 }

?>