<?php
    include '../conx.php';
    include '../verify/verify.php';

    if($Verified == "FOUND"){

        if( $Got['FOR'] == "MINE"){
            $Extend_For = " WHERE ";
        } else {
            $Extend_For = " WHERE ";
        }

        if ( $Got['STATUS'] == "ALL" && $Got['APP'] == "ALL" && $Got['UNION'] == "ALL"  ){
            
            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY c.id ".$Got['SORT'];
            }
    
            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " WHERE CONCAT(c.idd,' ',c.name,' ',c.details,' ',c.type,' ',uni.name,' ',app.name,' ', IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM applications WHERE company = c.id)) LIKE '%".$Got['SEARCH']."%' ";
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
    
            if ( $Got['APP'] != "ALL"){
                $Extend_App = " AND c.appID = ".$Got['APP']." ";
            } else {
                $Extend_App = " ";
            }

            if ( $Got['UNION'] == "PRIVATE"){
                $Extend_Union = " AND c.type = 'PRIVATE' ";
            } else if ( $Got['UNION'] != "ALL"){
                $Extend_Union = " AND c.unionID = ".$Got['UNION']." ";
            } else {
                $Extend_Union = " ";
            }

            if ( !empty($Got['SEARCH']) ){
                $Extend_Search = " AND CONCAT(c.idd,' ',c.name,' ',c.details,' ',c.type,' ',uni.name,' ',app.name,' ', IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')),' ',(SELECT COUNT(id) FROM applications WHERE company = c.id)) LIKE '%".$Got['SEARCH']."%' ";
            } else {
                $Extend_Search = " ";
            }
    
            if ( $Got['SORTBY'] != "NONE" ){
                $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
            } else {
                $Extend_Sort = " ORDER BY c.id ".$Got['SORT'];
            }
    
            $Extend = " WHERE ".$Extend_Status. " ".$Extend_App. " ".$Extend_Union." ".$Extend_Search." ".$Extend_Sort;
        }
    
            $sql = "SELECT DISTINCT (SELECT COUNT(id) FROM uplines WHERE clubID = c.idd AND status=0) AS upcountActive,
                            (SELECT COUNT(id) FROM uplines WHERE clubID = c.idd AND status=1) AS upcountPending,
                            (SELECT COUNT(id) FROM uplines WHERE clubID = c.idd AND status=2) AS upcountInactive,
                            (SELECT CONCAT(p.path,i.file) FROM images AS i LEFT JOIN paths AS p ON i.type = p.type WHERE uni.logo = i.id) AS unionImage,
                            (SELECT CONCAT(p.path,i.file) FROM images AS i LEFT JOIN paths AS p ON i.type = p.type WHERE app.image = i.id) AS appImage,
                            CONCAT(pa.path,img.file) AS imageFull,
                            c.id AS clubID,
                            c.idd AS clubIDD,
                            COALESCE(pe.percent,0) AS clubPercent,
                            c.name AS clubName,
                            c.details AS clubDetails,
                            c.type AS clubType,
                            c.unionID AS clubUnion,
                            uni.name AS unionName,
                            c.status AS status,
                            IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')) AS statusLabel,
                            app.name AS appName,
                            c.appID AS appID,
                            pa.path AS path,
                            c.image AS imageID
                    FROM clubs AS c
                    LEFT JOIN percentages AS pe ON c.idd = pe.idd AND pe.type = 'CLUB' AND pe.status = 0
                    LEFT JOIN uplines AS up ON c.idd = up.clubID
                    LEFT JOIN applications AS app ON c.appID = app.id
                    LEFT JOIN unions AS uni ON c.unionID=uni.id
                    LEFT JOIN images AS img ON c.image = img.id
                    LEFT JOIN paths AS pa ON img.type = pa.type
                    ".$Extend ;

    $result = $conx->query($sql);
    $data = [];
    $counted = 0;

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $counted++;
                $data[] = array(
                    'id'                => $i['clubID'],
                    'increment'         =>  $counted,
                    'idd'               => $i['clubIDD'],
                    'name'              => $i['clubName'],
                    'image'             => $i['clubImage'],
                    'details'           => $i['clubDetails'],
                    'percent'           => $i['clubPercent'],
                    'type'              => $i['clubType'],
                    'unionID'           => $i['clubUnion'],
                    'unionName'         => $i['unionName'],
                    'unionImage'        => $i['unionImage'],
                    'usersActive'       => $i['upcountActive'],
                    'usersPending'      => $i['upcountPending'],
                    'usersInactive'     => $i['upcountInactive'],
                    'imageID'           => $i['imageID'], 
                    'imageFull'         => $i['imageFull'], 
                    'appID'             => $i['appID'],
                    'appName'           => $i['appName'],
                    'appImage'          => $i['appImage'],
                    'statusLabel'       => $i['statusLabel'],
                    'status'            => $i['status'],
                );

            }
        }

    echo json_encode($data, true);

 } else {
    echo json_encode("NOTFOUND");
 }

?>