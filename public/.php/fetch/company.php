<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

    if ( $Got['STATUS'] == "ALL" ){
            
        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " ORDER BY c.id ".$Got['SORT'];
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " WHERE CONCAT(c.name,' ',c.details,' ', c.details, ' ', IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM applications WHERE company = c.id)) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        $Extend = " ".$Extend_Search." ".$Extend_Sort;

    } else {

        if ( $Got['STATUS'] == "ACTIVE"){
            $Extend_Status = " c.status=0 ";
        } else if ( $Got['STATUS'] == "ACTIVEPENDING"){
            $Extend_Status = " c.status!=2 ";
        } else if ( $Got['STATUS'] == "PENDING"){
            $Extend_Status = " c.status=1 ";
        } else if ( $Got['STATUS'] == "DISABLED"){
            $Extend_Status = " c.status=2 ";
        } else if ( $Got['STATUS'] == "ALL"){
            $Extend_Status = " c.status IN (0, 1, 2) ";
        } else {
            $Extend_Status = " c.status IN (0, 1, 2) ";
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " AND CONCAT(c.name,' ',c.details,' ', c.details, ' ', IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM applications WHERE company = c.id)) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " ORDER BY c.id ".$Got['SORT'];
        }

        $Extend = " WHERE ".$Extend_Status. " ".$Extend_Company." ".$Extend_Search." ".$Extend_Sort;
    }


    $sql = "SELECT c.id as id,
                    c.name as name,
                    c.details as details,
                    c.logo as imageID,
                    c.status as status,
                    IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')) AS statusLabel,
                    CONCAT(p.path,img.file) AS imageFull,
                    img.name as imageName,
                    p.path as imagePath,
                    (SELECT COUNT(id) FROM applications WHERE company = c.id) AS appsCount
            FROM company as c
            LEFT JOIN images AS img ON c.logo = img.id
            LEFT JOIN paths AS p ON img.type = p.type 
            ".$Extend;

    $result = $conx->query($sql);
    $feedback = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                if($i['status']==0){
                    $status = "Active";
                } else {
                    $status = "Inactive";
                }

                $feedback[] = array(
                                'id' =>             $i['id'],
                                'name' =>           $i['name'],
                                'details' =>        $i['details'],
                                'imageID' =>        $i['imageID'],
                                'appsCount' =>      $i['appsCount'],
                                'imageFull' =>      $i['imageFull'],
                                'statusLabel' =>    $i['statusLabel'],
                                'status' =>         $i['status'],
                            );
            }
        } else {
            $feedback = "Err";
        }

 } else {
    $feedback = "NOTFOUND";
 }

 echo json_encode($feedback, true);

?>